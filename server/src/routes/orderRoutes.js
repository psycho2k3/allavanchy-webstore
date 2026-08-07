const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createOrder, getMyOrders } = require("../controllers/orderController");


router.use(authMiddleware);


// Create order
router.post("/", createOrder);


// Get logged-in customer's own orders
router.get("/my-orders", getMyOrders);



module.exports = router;