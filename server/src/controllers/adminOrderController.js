const AdminOrder = require("../models/AdminOrder");

const toPositiveInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await AdminOrder.getAll({
            page: toPositiveInteger(req.query.page, 1),
            limit: toPositiveInteger(req.query.limit, 20),
            search: req.query.search
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await AdminOrder.getById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
