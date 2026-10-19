const crypto = require("crypto");
const Order = require("../models/Order");
const User = require("../models/User");
const { getCheckoutConfig } = require("../config/checkout");
const paystack = require("../services/paystack");

const getStorefrontUrl = () =>
    (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

/**
 * Confirm a Paystack transaction against our order and mark it paid.
 * Shared by the browser verify call and the webhook so either can settle it.
 */
const settleTransaction = async (transaction) => {
    if (!transaction || transaction.status !== "success") {
        return { paid: false, order: null };
    }

    const order = await Order.findByPaymentReference(transaction.reference);

    if (!order) {
        return { paid: false, order: null };
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

    return { paid: true, order: paidOrder || order };
};

// POST /api/payments/paystack/initialize  { order_id }
exports.initializePayment = async (req, res) => {
    try {
        const order = await Order.getById(req.body.order_id);

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

        await Order.setPaymentReference(order.id, reference);

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
                : "Unable to start payment"
        });
    }
};

// GET /api/payments/paystack/verify/:reference
exports.verifyPayment = async (req, res) => {
    try {
        const order = await Order.findByPaymentReference(req.params.reference);

        if (!order || String(order.user_id) !== String(req.user.id)) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        if (order.payment_status === "paid") {
            return res.json({ paid: true, order });
        }

        const transaction = await paystack.verifyTransaction(req.params.reference);
        const result = await settleTransaction(transaction);

        if (!result.paid) {
            return res.status(402).json({
                paid: false,
                message: "Payment was not completed",
                order
            });
        }

        res.json({ paid: true, order: result.order });
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
