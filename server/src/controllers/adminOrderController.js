const AdminOrder = require("../models/AdminOrder");

const toPositiveInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const allowedStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Completed",
    "Cancelled",
    "Refunded"
];

exports.getOrders = async (req, res) => {
    try {
        const orders = await AdminOrder.getAll({
            page: toPositiveInteger(req.query.page, 1),
            limit: toPositiveInteger(req.query.limit, 20),
            search: req.query.search,
            status: req.query.status
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

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const order = await AdminOrder.updateStatus(req.params.id, status);

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