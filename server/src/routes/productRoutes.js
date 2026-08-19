const express = require("express");

const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

const {
    uploadProductImages,
    handleUploadError
} = require("../middleware/uploadMiddleware");

// =====================================================
// PUBLIC PRODUCT ROUTES
// =====================================================

router.get(
    "/",
    getProducts
);

router.get(
    "/:id",
    getProduct
);

// =====================================================
// ADMIN PRODUCT ROUTES
// =====================================================

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    uploadProductImages,
    handleUploadError,
    createProduct
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    uploadProductImages,
    handleUploadError,
    updateProduct
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);

module.exports = router;