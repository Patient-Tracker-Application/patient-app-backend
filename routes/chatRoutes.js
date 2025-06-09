const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getOrCreateChat,
  sendMessage,
  getUserChats,
  markMessagesAsRead,
} = require("../controllers/chatController");

// All routes are protected
router.use(protect);

// Chat routes
router.post("/", getOrCreateChat);
router.get("/", getUserChats);
router.post("/messages/:chatId", sendMessage);
router.put("/read/:chatId", markMessagesAsRead);

module.exports = router;
