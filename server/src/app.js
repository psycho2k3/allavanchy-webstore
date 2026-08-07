const express = require("express");
const cors = require("cors");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authMiddleware = require("./middleware/authMiddleware");


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/contact", contactRoutes);


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Allavanchy API running 🚀"
    });
});


module.exports = app;