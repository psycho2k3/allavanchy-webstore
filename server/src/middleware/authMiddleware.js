const jwt = require("jsonwebtoken");
const db = require("../config/database");
const { isValidId, sendError } = require("../utils/http");

const authMiddleware = async (
    req,
    res,
    next
) => {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message:
                "No token provided"
        });
    }

    const parts =
        authHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer" ||
        !parts[1]
    ) {
        return res.status(401).json({
            message:
                "Invalid authorization header"
        });
    }

    const token = parts[1];

    let decoded;

    try {

        decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

    } catch (error) {

        return res.status(401).json({
            message:
                "Invalid or expired token"
        });
    }

    if (!decoded || !isValidId(decoded.id)) {
        return res.status(401).json({
            message:
                "Invalid or expired token"
        });
    }

    /*
     * Re-load the user on every request so that suspended, deleted or
     * demoted accounts lose access immediately instead of when the
     * token expires. The role always comes from the database.
     */
    let user;

    try {

        const result = await db.query(
            `
            SELECT id, name, email, role, status
            FROM users
            WHERE id = $1
            `,
            [decoded.id]
        );

        user = result.rows[0];

    } catch (error) {

        return sendError(
            res,
            error,
            "Failed to authenticate request"
        );
    }

    if (!user || user.status !== "active") {
        return res.status(401).json({
            message:
                "Your session is no longer valid. Please sign in again."
        });
    }

    req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    };

    next();
};

module.exports = authMiddleware;