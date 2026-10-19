const crypto = require("crypto");

const PAYSTACK_API = "https://api.paystack.co";

const getSecretKey = () => {
    const key = process.env.PAYSTACK_SECRET_KEY;

    if (!key) {
        throw new Error("Paystack is not configured");
    }

    return key;
};

const paystackRequest = async (path, options = {}) => {
    const response = await fetch(`${PAYSTACK_API}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${getSecretKey()}`,
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok || body.status === false) {
        const error = new Error(body.message || "Paystack request failed");
        error.status = 502;
        throw error;
    }

    return body.data;
};

// Amounts are sent to Paystack in the currency's subunit (cents / kobo).
const toSubunit = (amount) => Math.round(Number(amount) * 100);

const initializeTransaction = ({ email, amount, currency, reference, callbackUrl, metadata }) =>
    paystackRequest("/transaction/initialize", {
        method: "POST",
        body: JSON.stringify({
            email,
            amount: toSubunit(amount),
            currency,
            reference,
            callback_url: callbackUrl,
            metadata
        })
    });

const verifyTransaction = (reference) =>
    paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);

const isValidWebhookSignature = (rawBody, signature) => {
    if (!signature || !process.env.PAYSTACK_SECRET_KEY) {
        return false;
    }

    const expected = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(rawBody)
        .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(String(signature));

    return a.length === b.length && crypto.timingSafeEqual(a, b);
};

module.exports = {
    initializeTransaction,
    verifyTransaction,
    isValidWebhookSignature,
    toSubunit
};
