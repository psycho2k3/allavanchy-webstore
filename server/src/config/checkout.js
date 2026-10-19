// Single source of truth for order pricing. The storefront reads these values
// from GET /api/settings so the totals shown at checkout always match what is
// stored on the order and charged through Paystack.

const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const getCheckoutConfig = () => ({
    currency: (process.env.PAYSTACK_CURRENCY || "USD").toUpperCase(),
    shipping_flat_fee: toNumber(process.env.SHIPPING_FLAT_FEE, 0),
    tax_rate: toNumber(process.env.TAX_RATE, 0.0825)
});

const roundMoney = (value) => Math.round(value * 100) / 100;

const calculateTotals = (items) => {
    const { shipping_flat_fee, tax_rate } = getCheckoutConfig();

    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );
    const shipping = subtotal > 0 ? shipping_flat_fee : 0;
    const tax = subtotal * tax_rate;

    return {
        subtotal: roundMoney(subtotal),
        shipping: roundMoney(shipping),
        tax: roundMoney(tax),
        total: roundMoney(subtotal + shipping + tax)
    };
};

module.exports = {
    getCheckoutConfig,
    calculateTotals
};
