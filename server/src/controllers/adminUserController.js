const AdminUser = require("../models/AdminUser");

const toPositiveInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await AdminUser.getCustomers({
            page: toPositiveInteger(req.query.page, 1),
            limit: toPositiveInteger(req.query.limit, 20),
            search: req.query.search
        });

        res.json(customers);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
