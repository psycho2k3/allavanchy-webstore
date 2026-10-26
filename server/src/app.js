const express = require("express");
const cors = require("cors");

const app = express();

app.disable("x-powered-by");

// Browsers never send a trailing slash in the Origin header, but it is easy
// to paste one into the environment variable, so compare without them.
const normalizeOrigin = (origin) => String(origin).trim().replace(/\/+$/, "");

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (
            !origin ||
            process.env.NODE_ENV !== "production" ||
            allowedOrigins.includes(normalizeOrigin(origin))
        ) {
            return callback(null, true);
        }

        return callback(null, false);
    },

    methods: [
        "GET",
        "HEAD",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
};

app.use(cors(corsOptions));

// Paystack webhook needs the raw body for signature checks, so register it
// before the JSON parser.
const { handleWebhook } = require("./controllers/paymentController");
app.post(
    "/api/payments/paystack/webhook",
    express.raw({ type: "application/json" }),
    handleWebhook
);

app.use(express.json({ limit: "1mb" }));

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Allavanchy API running 🚀"
    });
});

// Unknown API routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Last-resort error handler (bad JSON bodies, unexpected exceptions)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({
        message: status >= 500 ? "Internal server error" : err.message
    });
});

module.exports = app;