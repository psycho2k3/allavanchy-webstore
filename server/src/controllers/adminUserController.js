const bcrypt = require("bcrypt");
const AdminUser = require("../models/AdminUser");
const User = require("../models/User");
const Order = require("../models/Order");

const toPositiveInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const allowedRoles = ["customer", "admin"];
const allowedStatuses = ["active", "suspended"];

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

exports.getUsers = async (req, res) => {
    try {
        const users = await AdminUser.getAll({
            page: toPositiveInteger(req.query.page, 1),
            limit: toPositiveInteger(req.query.limit, 20),
            search: req.query.search,
            role: req.query.role,
            status: req.query.status
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await AdminUser.getById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const orders = await Order.getUserOrders(req.params.id);

        res.json({
            user,
            orders
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        if (String(req.params.id) === String(req.user.id)) {
            return res.status(400).json({
                message: "You cannot change your own role"
            });
        }

        const user = await AdminUser.updateRole(req.params.id, role);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        if (String(req.params.id) === String(req.user.id)) {
            return res.status(400).json({
                message: "You cannot change your own account status"
            });
        }

        const user = await AdminUser.updateStatus(req.params.id, status);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;

        const currentUser = await User.findById(req.user.id);

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let hashedPassword;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    message: "Current password is required to set a new password"
                });
            }

            const validPassword = await bcrypt.compare(currentPassword, currentUser.password);

            if (!validPassword) {
                return res.status(401).json({
                    message: "Current password is incorrect"
                });
            }

            hashedPassword = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await User.updateCredentials(req.user.id, {
            name,
            email,
            password: hashedPassword
        });

        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};