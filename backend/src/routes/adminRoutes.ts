// src/routes/adminRoutes.ts
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdmin,
} from "../controllers/admins/adminController.js";
import {
  adminAuth,
  superAdminAuth,
  checkPermission,
} from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", superAdminAuth, registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.get("/profile", adminAuth, getAdminProfile);
router.put("/profile", adminAuth, updateAdmin);

// Permission management
router.post(
  "/:id/permissions",
  superAdminAuth,
  checkPermission("manage_permissions"),
  async (req, res) => {
    // Implementation for managing permissions
  }
);

export default router;
