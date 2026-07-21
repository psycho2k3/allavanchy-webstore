const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct
} = require("../controllers/productController");



// Get all products
router.get("/", getProducts);


// Get single product
router.get("/:id", getProduct);


// Create product
router.post("/", createProduct);


// Delete product
router.delete("/:id", deleteProduct);



module.exports = router;