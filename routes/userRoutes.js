const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  getUserProfile,
} = require("../controllers/userController");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.post("/admin/register", protect, authorize("admin"), registerUser);
router.get("/profile", protect, getUserProfile);
router.put("/update/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
