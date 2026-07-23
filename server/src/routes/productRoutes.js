const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");



// Get all products
router.get("/", getProducts);


// Get single product
router.get("/:id", getProduct);


// Create product
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createProduct
);


// Update product
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateProduct
);


// Delete product
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);



module.exports = router;
