const isAdminUser = (user) => {
    if (!user) return false;
    return user.role === "admin" || user.role === "super_admin";
};

const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    if (!isAdminUser(req.user)) {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
};

const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        if (req.user.role === "super_admin") {
            return next();
        }

        if (req.user.role === "admin" && !Array.isArray(req.user.permissions)) {
            return next();
        }

        const permissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];

        if (!permissions.includes(permission)) {
            return res.status(403).json({
                message: "Insufficient admin permission"
            });
        }

        next();
    };
};

module.exports = {
    requireAdmin,
    requirePermission
};
