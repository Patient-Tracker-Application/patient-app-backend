const express = require("express");
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  markNotificationsDeleted,
} = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/", protect, createNotification);

// Protected routes
router.get(
  "/all-notifications",
  protect,
  authorize("admin"),
  getAllNotifications
);
router.get("/user", protect, getUserNotifications);
router.put("/read/:id", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.put("/delete/:id", protect, markNotificationsDeleted);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
