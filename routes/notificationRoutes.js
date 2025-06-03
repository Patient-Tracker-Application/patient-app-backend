const express = require("express");
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/", protect, createNotification);

// Protected routes
router.get("/", protect, authorize("admin"), getAllNotifications);
router.get("/user", protect, getUserNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
