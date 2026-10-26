const Order = require("../models/Order");
const Product = require("../models/Product");
const { isValidId, sendError } = require("../utils/http");

const hasText = (value) => typeof value === "string" && value.trim().length > 0;


// Create Order
// items: [{ product_id, quantity, size }]
exports.createOrder = async (req, res) => {

    try {

        const { items, shipping } = req.body || {};
        const user_id = req.user.id;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }

        if (
            !shipping ||
            !hasText(shipping.name) ||
            !hasText(shipping.address) ||
            !hasText(shipping.city) ||
            !hasText(shipping.phone)
        ) {
            return res.status(400).json({
                message: "Shipping name, address, city, and phone are required"
            });
        }

        const products = new Map();
        const lines = new Map();
        const requestedPerProduct = new Map();

        for (const item of items) {

            if (!item || !isValidId(item.product_id)) {
                return res.status(400).json({
                    message: "Invalid product in cart"
                });
            }

            const productKey = String(item.product_id);
            let product = products.get(productKey);

            if (!product) {
                product = await Product.getById(item.product_id);

                if (!product) {
                    return res.status(400).json({
                        message: `Product ${item.product_id} was not found`
                    });
                }

                products.set(productKey, product);
            }

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({
                    message: `Invalid quantity for ${product.name}`
                });
            }

            // A size is required (and must be offered) only for products
            // that have sizes.
            const sizes = Array.isArray(product.sizes) ? product.sizes : [];
            let size = null;

            if (sizes.length > 0) {
                size = typeof item.size === "string" ? item.size.trim() : "";

                // The storefront sends no size for single-size products.
                if (!size && sizes.length === 1 && sizes[0] === "One Size") {
                    size = "One Size";
                }

                if (!sizes.includes(size)) {
                    return res.status(400).json({
                        message: size
                            ? `${product.name} is not available in size ${size}`
                            : `Please choose a size for ${product.name}`
                    });
                }
            }

            requestedPerProduct.set(
                productKey,
                (requestedPerProduct.get(productKey) || 0) + quantity
            );

            // Merge duplicate cart lines for the same product and size.
            const lineKey = `${productKey}::${size || ""}`;
            const existingLine = lines.get(lineKey);

            if (existingLine) {
                existingLine.quantity += quantity;
            } else {
                lines.set(lineKey, {
                    product_id: product.id,
                    product_name: product.name,
                    size,
                    quantity,
                    price: Number(product.price)
                });
            }

        }

        // Check the combined quantity of every size against the stock.
        for (const [productKey, quantity] of requestedPerProduct) {
            const product = products.get(productKey);

            if (Number(product.stock) < quantity) {
                return res.status(409).json({
                    message: `${product.name} does not have enough stock`
                });
            }
        }

        const order = await Order.createWithItems({
            user_id,
            items: [...lines.values()],
            shipping: {
                name: shipping.name.trim(),
                address: shipping.address.trim(),
                city: shipping.city.trim(),
                postal_code: hasText(shipping.postal_code)
                    ? shipping.postal_code.trim()
                    : null,
                phone: shipping.phone.trim()
            }
        });

        res.status(201).json(order);

    } catch (error) {

        // Stock races inside the transaction throw a 409 with the same message.
        return sendError(res, error, "Failed to create order");

    }

};



// Get logged-in customer's orders
exports.getMyOrders = async (req, res) => {

    try {

        const orders = await Order.getUserOrders(req.user.id);

        res.json(orders);

    } catch (error) {

        return sendError(res, error, "Failed to fetch orders");

    }

};
