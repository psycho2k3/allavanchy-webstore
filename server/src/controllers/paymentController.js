const crypto = require("crypto");
const Order = require("../models/Order");
const User = require("../models/User");
const { getCheckoutConfig } = require("../config/checkout");
const paystack = require("../services/paystack");
const { isValidId } = require("../utils/http");

const getStorefrontUrl = () =>
    (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

/**
 * Read our order id from a Paystack transaction's metadata. Paystack may
 * return metadata as an object or as a JSON string.
 */
const getMetadataOrderId = (transaction) => {
    let metadata = transaction && transaction.metadata;

    if (typeof metadata === "string") {
        try {
            metadata = JSON.parse(metadata);
        } catch (error) {
            return null;
        }
    }

    const orderId = metadata && metadata.order_id;

    return isValidId(orderId) ? String(orderId) : null;
};

/**
 * Find the order a Paystack transaction belongs to. The order's
 * payment_reference is replaced every time checkout is restarted, so an
 * older (but genuinely paid) reference falls back to metadata.order_id.
 */
const findOrderForTransaction = async (transaction) => {
    const order = await Order.findByPaymentReference(transaction.reference);

    if (order) {
        return order;
    }

    const orderId = getMetadataOrderId(transaction);

    return orderId ? Order.getById(orderId) : null;
};

/**
 * Confirm a Paystack transaction against our order and mark it paid.
 * Shared by the browser verify call and the webhook so either can settle it.
 */
const settleTransaction = async (transaction, knownOrder) => {
    if (!transaction || transaction.status !== "success") {
        return { paid: false, order: knownOrder || null };
    }

    const order = knownOrder || await findOrderForTransaction(transaction);

    if (!order) {
        console.error(
            `Paystack transaction ${transaction.reference} succeeded but no matching order was found`
        );
        return { paid: false, order: null };
    }

    if (order.payment_status === "paid") {
        if (order.payment_reference !== transaction.reference) {
            console.error(
                `Order ${order.id} was already paid with ${order.payment_reference}; ` +
                `Paystack transaction ${transaction.reference} also succeeded and needs a manual refund`
            );
        }

        return { paid: true, order };
    }

    if (order.status === "Cancelled") {
        console.error(
            `Paystack transaction ${transaction.reference} succeeded for cancelled order ${order.id}; ` +
            "it was not marked paid and needs a manual refund"
        );
        return { paid: false, order };
    }

    const expectedAmount = paystack.toSubunit(order.total);
    const { currency } = getCheckoutConfig();

    if (
        Number(transaction.amount) !== expectedAmount ||
        String(transaction.currency).toUpperCase() !== currency
    ) {
        console.error(
            `Paystack amount mismatch for order ${order.id}: ` +
            `expected ${expectedAmount} ${currency}, got ${transaction.amount} ${transaction.currency}`
        );
        return { paid: false, order };
    }

    const paidOrder = await Order.markPaid(order.id, transaction.reference);

    if (paidOrder) {
        return { paid: true, order: paidOrder };
    }

    // Nothing was updated: the order was paid or cancelled concurrently.
    const latest = await Order.getById(order.id);

    if (latest && latest.payment_status === "paid") {
        return { paid: true, order: latest };
    }

    console.error(
        `Paystack transaction ${transaction.reference} succeeded but order ${order.id} ` +
        "could not be marked paid (cancelled?); it needs a manual refund"
    );

    return { paid: false, order: latest || order };
};

// POST /api/payments/paystack/initialize  { order_id }
exports.initializePayment = async (req, res) => {
    try {
        const orderId = req.body && req.body.order_id;

        if (!isValidId(orderId)) {
            return res.status(400).json({
                message: "Invalid order id"
            });
        }

        const order = await Order.getById(orderId);

        if (!order || String(order.user_id) !== String(req.user.id)) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.payment_status === "paid") {
            return res.status(400).json({
                message: "This order has already been paid"
            });
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({
                message: "This order has been cancelled"
            });
        }

        const user = await User.findById(req.user.id);
        const { currency } = getCheckoutConfig();
        const reference = `AV-${order.id}-${crypto.randomBytes(6).toString("hex")}`;

        const updated = await Order.setPaymentReference(order.id, reference);

        if (!updated) {
            return res.status(400).json({
                message: "This order has already been paid"
            });
        }

        // metadata.order_id lets verify/webhook find the order even after
        // a later checkout attempt replaces payment_reference.
        const transaction = await paystack.initializeTransaction({
            email: user.email,
            amount: order.total,
            currency,
            reference,
            callbackUrl: `${getStorefrontUrl()}/payment/callback`,
            metadata: {
                order_id: order.id,
                customer_name: user.name
            }
        });

        res.json({
            authorization_url: transaction.authorization_url,
            reference: transaction.reference
        });
    } catch (error) {
        console.error("Paystack initialize error:", error);

        res.status(error.status || 500).json({
            message: error.message === "Paystack is not configured"
                ? "Online payments are not available right now"
                : "Unable to start payment",
            error:
                process.env.NODE_ENV !== "production" && !error.status
                    ? error.message
                    : undefined
        });
    }
};

// Orders returned to the storefront always include their items.
const withItems = async (order) => {
    if (!order || Array.isArray(order.items)) {
        return order;
    }

    return (await Order.getById(order.id)) || order;
};

// GET /api/payments/paystack/verify/:reference
exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;
        let order = await Order.findByPaymentReference(reference);

        if (order) {
            if (String(order.user_id) !== String(req.user.id)) {
                return res.status(404).json({
                    message: "Payment not found"
                });
            }

            if (
                order.payment_status === "paid" &&
                order.payment_reference === reference
            ) {
                return res.json({ paid: true, order: await withItems(order) });
            }
        }

        // The reference may belong to an earlier checkout attempt whose
        // reference was overwritten. Ask Paystack first, then resolve the
        // order from the transaction metadata.
        let transaction;

        try {
            transaction = await paystack.verifyTransaction(reference);
        } catch (error) {
            if (!order) {
                return res.status(404).json({
                    message: "Payment not found"
                });
            }

            throw error;
        }

        if (!order) {
            const orderId = getMetadataOrderId(transaction);
            order = orderId ? await Order.getById(orderId) : null;

            if (!order || String(order.user_id) !== String(req.user.id)) {
                return res.status(404).json({
                    message: "Payment not found"
                });
            }
        }

        const result = await settleTransaction(transaction, order);

        if (!result.paid) {
            return res.status(402).json({
                paid: false,
                message: result.order && result.order.status === "Cancelled"
                    ? "This order has been cancelled. Please contact us about a refund."
                    : "Payment was not completed",
                order: await withItems(result.order || order)
            });
        }

        res.json({ paid: true, order: await withItems(result.order) });
    } catch (error) {
        console.error("Paystack verify error:", error);

        res.status(error.status || 500).json({
            message: "Unable to verify payment"
        });
    }
};

// POST /api/payments/paystack/webhook  (raw body, signed by Paystack)
exports.handleWebhook = async (req, res) => {
    const rawBody = req.body;

    if (!paystack.isValidWebhookSignature(rawBody, req.headers["x-paystack-signature"])) {
        return res.status(401).send("Invalid signature");
    }

    try {
        const event = JSON.parse(rawBody.toString("utf8"));

        if (event.event === "charge.success") {
            // Re-verify with Paystack rather than trusting the payload alone.
            const transaction = await paystack.verifyTransaction(event.data.reference);
            await settleTransaction(transaction);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("Paystack webhook error:", error);
        res.sendStatus(500);
    }
};
