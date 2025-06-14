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
  getAllUsers,
  getMyPatients,
} = require("../controllers/userController");

// Public routes
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.post("/register", protect, authorize("doctor"), registerUser);
router.post("/admin/register", protect, authorize("admin"), registerUser);
router.get("/profile", protect, getUserProfile);
router.get("/all-users", protect, authorize("admin"), getAllUsers);
router.get("/my-patients", protect, authorize("doctor"), getMyPatients);
router.put("/update/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
