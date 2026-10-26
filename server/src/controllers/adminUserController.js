const bcrypt = require("bcrypt");
const AdminUser = require("../models/AdminUser");
const User = require("../models/User");
const Order = require("../models/Order");
const { isValidId, sendError } = require("../utils/http");

const toPositiveInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const isValidEmail = (value) => {
    return typeof value === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
        return sendError(res, error, "Failed to fetch customers");
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
        return sendError(res, error, "Failed to fetch users");
    }
};

exports.getUser = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

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
        return sendError(res, error, "Failed to fetch user");
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        const { role } = req.body || {};

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
        return sendError(res, error, "Failed to update user role");
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        const { status } = req.body || {};

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
        return sendError(res, error, "Failed to update user status");
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body || {};
        let { name, email } = req.body || {};

        if (name !== undefined && name !== null) {
            name = typeof name === "string" ? name.trim() : "";

            if (!name || name.length > 150) {
                return res.status(400).json({
                    message: "Name must be between 1 and 150 characters"
                });
            }
        } else {
            name = undefined;
        }

        if (email !== undefined && email !== null) {
            email = typeof email === "string" ? email.trim().toLowerCase() : "";

            if (!isValidEmail(email) || email.length > 255) {
                return res.status(400).json({
                    message: "A valid email address is required"
                });
            }
        } else {
            email = undefined;
        }

        const currentUser = await User.findById(req.user.id);

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (email && email !== currentUser.email) {
            const existingUser = await User.findByEmail(email);

            if (existingUser && String(existingUser.id) !== String(currentUser.id)) {
                return res.status(409).json({
                    message: "Another account already uses this email"
                });
            }
        }

        let hashedPassword;

        if (newPassword) {
            if (typeof newPassword !== "string" || newPassword.length < 8) {
                return res.status(400).json({
                    message: "New password must be at least 8 characters"
                });
            }

            if (!currentPassword || typeof currentPassword !== "string") {
                return res.status(400).json({
                    message: "Current password is required to set a new password"
                });
            }

            const validPassword = await bcrypt.compare(currentPassword, currentUser.password);

            // 400 rather than 401 so the admin app does not treat this as an
            // expired session and sign the user out.
            if (!validPassword) {
                return res.status(400).json({
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
        return sendError(res, error, "Failed to update profile", {
            "23505": "Another account already uses this email"
        });
    }
};
