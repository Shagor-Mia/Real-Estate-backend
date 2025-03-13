const express = require("express");
const {
  authenticate,
  authorizeRole,
} = require("../middlewares/authMiddleware");
const {
  logout,
  getAllUsersForSuperAdmin,
  getSingleUserForSuperAdmin,
  getAllUsersForAdmin,
  getSingleUserForAdmin,
  register,
  login,
} = require("../controllers/authController");

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);

// SuperAdmin Routes
router.get(
  "/superAdmin/users",
  authenticate,
  authorizeRole(["superAdmin"]),
  getAllUsersForSuperAdmin
);
router.get(
  "/superAdmin/users/:id",
  authenticate,
  authorizeRole(["superAdmin"]),
  getSingleUserForSuperAdmin
);

// Admin Routes (Excluding SuperAdmin)
router.get(
  "/admin/users",
  authenticate,
  authorizeRole(["admin"]),
  getAllUsersForAdmin
);
router.get(
  "/admin/users/:id",
  authenticate,
  authorizeRole(["admin"]),
  getSingleUserForAdmin
);

module.exports = router;
