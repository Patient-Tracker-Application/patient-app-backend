const Notification = require("../models/notificationModel");
const { sendWelcomeEmail } = require("../utils/emailService");

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private
const createNotification = async (req, res) => {
  try {
    const { title, body, notificationType, userType, userId } = req.body;

    const notification = await Notification.create({
      title,
      body,
      notificationType,
      userType,
      userId,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: "Notification created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating notification",
      error: error.message,
    });
  }
};

// @desc    Get all notifications (admin only)
// @route   GET /api/notifications
// @access  Private/Admin
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("userId", "firstName lastName email")
      .sort("-createdAt");

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// @desc    Get notifications with optional filtering by userId and createdBy
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const { userId, createdBy } = req.query;
    const filter = { isDeleted: false };
    if (userId) filter.userId = userId;
    if (createdBy) filter.createdBy = createdBy;
    const notifications = await Notification.find(filter)
      .populate("userId", "firstName lastName email")
      .populate("createdBy", "firstName lastName email")
      .sort("-createdAt");
    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      data: notification,
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.remove();

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

// @desc    Mark notifications as deleted (isDeleted: true) based on filters
// @route   PUT /api/notifications/mark-deleted
// @access  Private
const markNotificationsDeleted = async (req, res) => {
  try {
    const { userId, createdBy } = req.body;
    const filter = {};
    if (userId) filter.userId = userId;
    if (createdBy) filter.createdBy = createdBy;
    // Only update notifications that are not already deleted
    filter.isDeleted = false;
    const result = await Notification.updateMany(filter, { isDeleted: true });
    res.json({
      success: true,
      message: "Notifications  deleted",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking notifications as deleted",
      error: error.message,
    });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  markNotificationsDeleted,
};
