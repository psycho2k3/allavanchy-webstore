const Order = require("../models/Order");
const Product = require("../models/Product");

const hasText = (value) => typeof value === "string" && value.trim().length > 0;


// Create Order
exports.createOrder = async (req, res) => {

    try {

        const { items, shipping } = req.body;
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

        const resolvedItems = [];

        for (const item of items) {

            const product = await Product.getById(item.product_id);

            if (!product) {
                return res.status(400).json({
                    message: `Product ${item.product_id} was not found`
                });
            }

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({
                    message: `Invalid quantity for ${product.name}`
                });
            }

            if (Number(product.stock) < quantity) {
                return res.status(400).json({
                    message: `${product.name} does not have enough stock`
                });
            }

            resolvedItems.push({
                product_id: product.id,
                product_name: product.name,
                quantity,
                price: Number(product.price)
            });

        }

        const order = await Order.createWithItems({
            user_id,
            items: resolvedItems,
            shipping: {
                name: shipping.name,
                address: shipping.address,
                city: shipping.city,
                postal_code: shipping.postal_code || null,
                phone: shipping.phone
            }
        });

        res.status(201).json(order);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// Get logged-in customer's orders
exports.getMyOrders = async (req, res) => {

    try {

        const orders = await Order.getUserOrders(req.user.id);

        res.json(orders);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};