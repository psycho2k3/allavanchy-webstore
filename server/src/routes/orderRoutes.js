const express = require("express");
const router = express.Router();


const {
    createOrder,
    getOrders
} = require("../controllers/orderController");



// Create order
router.post("/", createOrder);


// Get user orders
router.get("/:user_id", getOrders);



module.exports = router;