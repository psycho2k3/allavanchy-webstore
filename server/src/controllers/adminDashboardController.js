const AdminDashboard = require("../models/AdminDashboard");

exports.getDashboard = async (req, res) => {
    try {
        const dashboard = await AdminDashboard.getMetrics();
        res.json(dashboard);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
