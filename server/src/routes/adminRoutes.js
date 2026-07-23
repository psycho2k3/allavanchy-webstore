const express = require("express");
const adminDashboardController = require("../controllers/adminDashboardController");
const adminProductController = require("../controllers/adminProductController");
const adminOrderController = require("../controllers/adminOrderController");
const adminUserController = require("../controllers/adminUserController");
const { requireAdmin, requirePermission } = require("../middleware/adminAuth");

const router = express.Router();

router.use(requireAdmin);

router.get("/dashboard", requirePermission("dashboard:read"), adminDashboardController.getDashboard);

router.get("/products", requirePermission("products:read"), adminProductController.getProducts);
router.post("/products", requirePermission("products:write"), adminProductController.createProduct);
router.get("/products/:id", requirePermission("products:read"), adminProductController.getProduct);
router.patch("/products/:id", requirePermission("products:write"), adminProductController.updateProduct);
router.delete("/products/:id", requirePermission("products:write"), adminProductController.deleteProduct);

router.get("/orders", requirePermission("orders:read"), adminOrderController.getOrders);
router.get("/orders/:id", requirePermission("orders:read"), adminOrderController.getOrder);

router.get("/customers", requirePermission("customers:read"), adminUserController.getCustomers);

module.exports = router;
