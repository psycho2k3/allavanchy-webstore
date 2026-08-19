const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    if (req.user.role !== "admin") {
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

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        /*
         * Admin users currently have full access.
         *
         * The JWT currently contains:
         * {
         *     id,
         *     role
         * }
         *
         * There is no permissions array in the token yet,
         * so every admin is allowed to use admin permissions.
         */

        next();
    };
};


module.exports = {
    requireAdmin,
    requirePermission
};