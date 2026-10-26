// Small helpers shared by the controllers so every route validates ids and
// reports errors the same way.

// Route ids are BIGSERIAL values. Reject anything that is not a plain
// positive integer before it reaches PostgreSQL (which would throw 22P02).
const isValidId = (id) => {
    const text = String(id === undefined || id === null ? "" : id).trim();

    return (
        /^\d+$/.test(text) &&
        Number(text) > 0 &&
        Number.isSafeInteger(Number(text))
    );
};

// Known PostgreSQL error codes that are caused by the request rather than
// by the server.
const pgErrors = {
    "23505": { status: 409, message: "A record with these details already exists" },
    "23503": { status: 409, message: "This record is referenced by other records" },
    "22P02": { status: 400, message: "Invalid input" },
    "22001": { status: 400, message: "A value is too long" }
};

/**
 * Send a JSON error response for an unexpected exception.
 *
 * `messages` can override the default text for a pg error code, e.g.
 * { "23503": "Product is referenced by orders" }.
 */
const sendError = (res, error, message, messages = {}) => {
    const code = error && error.code;

    if (code && pgErrors[code]) {
        return res.status(pgErrors[code].status).json({
            message: messages[code] || pgErrors[code].message
        });
    }

    // Errors raised deliberately with a 4xx status (e.g. insufficient stock).
    if (error && error.status >= 400 && error.status < 500) {
        return res.status(error.status).json({
            message: error.message
        });
    }

    console.error(`${message}:`, error);

    return res.status(500).json({
        message,
        error:
            process.env.NODE_ENV !== "production" && error
                ? error.message
                : undefined
    });
};

module.exports = {
    isValidId,
    sendError
};
