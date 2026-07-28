const express = require("express");
const adminDashboardController = require("../controllers/adminDashboardController");
const adminOrderController = require("../controllers/adminOrderController");
const adminUserController = require("../controllers/adminUserController");
const { requireAdmin, requirePermission } = require("../middleware/adminAuth");

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

module.exports = router;