const express = require("express");
const adminDashboardController = require("../controllers/adminDashboardController");
const adminOrderController = require("../controllers/adminOrderController");
const adminUserController = require("../controllers/adminUserController");
const adminSiteSettingsController = require("../controllers/adminSiteSettingsController");
const adminCollectionController = require("../controllers/adminCollectionController");
const { requireAdmin, requirePermission } = require("../middleware/adminAuth");
const {
    uploadSingleImage,
    uploadSiteImage,
    handleUploadError
} = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(requireAdmin);

router.get("/dashboard", requirePermission("dashboard:read"), adminDashboardController.getDashboard);

router.get("/orders", requirePermission("orders:read"), adminOrderController.getOrders);
router.get("/orders/:id", requirePermission("orders:read"), adminOrderController.getOrder);
router.patch("/orders/:id/status", requirePermission("orders:write"), adminOrderController.updateOrderStatus);

router.get("/customers", requirePermission("customers:read"), adminUserController.getCustomers);

router.get("/users", requirePermission("users:read"), adminUserController.getUsers);
router.get("/users/:id", requirePermission("users:read"), adminUserController.getUser);
router.patch("/users/:id/role", requirePermission("users:write"), adminUserController.updateUserRole);
router.patch("/users/:id/status", requirePermission("users:write"), adminUserController.updateUserStatus);

router.patch("/profile", requirePermission("profile:write"), adminUserController.updateProfile);

router.get("/settings", requirePermission("settings:read"), adminSiteSettingsController.getSettings);
router.patch("/settings", requirePermission("settings:write"), adminSiteSettingsController.updateSettings);
router.patch(
    "/settings/landing-image",
    requirePermission("settings:write"),
    uploadSingleImage,
    handleUploadError,
    uploadSiteImage,
    adminSiteSettingsController.updateLandingImage
);
router.patch(
    "/settings/hero-image",
    requirePermission("settings:write"),
    uploadSingleImage,
    handleUploadError,
    uploadSiteImage,
    adminSiteSettingsController.updateHeroImage
);

router.get("/collections", requirePermission("collections:read"), adminCollectionController.getCollections);
router.get("/collections/:id", requirePermission("collections:read"), adminCollectionController.getCollection);
router.post(
    "/collections",
    requirePermission("collections:write"),
    uploadSingleImage,
    handleUploadError,
    uploadSiteImage,
    adminCollectionController.createCollection
);
router.put(
    "/collections/:id",
    requirePermission("collections:write"),
    uploadSingleImage,
    handleUploadError,
    uploadSiteImage,
    adminCollectionController.updateCollection
);
router.delete("/collections/:id", requirePermission("collections:write"), adminCollectionController.deleteCollection);
router.put(
    "/collections/:id/products",
    requirePermission("collections:write"),
    adminCollectionController.setCollectionProducts
);

module.exports = router;