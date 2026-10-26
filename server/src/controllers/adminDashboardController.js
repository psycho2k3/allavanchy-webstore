const AdminDashboard = require("../models/AdminDashboard");
const { sendError } = require("../utils/http");

exports.getDashboard = async (req, res) => {
    try {
        const dashboard = await AdminDashboard.getMetrics();
        res.json(dashboard);
    } catch (error) {
        return sendError(res, error, "Failed to load dashboard");
    }
};
