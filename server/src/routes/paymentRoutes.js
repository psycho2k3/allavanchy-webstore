const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    initializePayment,
    verifyPayment
} = require("../controllers/paymentController");

router.post("/paystack/initialize", authMiddleware, initializePayment);
router.get("/paystack/verify/:reference", authMiddleware, verifyPayment);

// The webhook route is mounted in app.js before express.json() because
// Paystack's signature must be checked against the raw request body.

module.exports = router;
