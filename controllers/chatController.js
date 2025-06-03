const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// @desc    Get or create chat between doctor and patient
// @route   POST /api/chats
// @access  Private
const getOrCreateChat = async (req, res) => {
  try {
    const { participantId } = req.body;

    // Verify participant exists and is of correct role
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] },
    }).populate("participants", "firstName lastName role");

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [req.user._id, participantId],
        messages: [],
      });
      chat = await chat.populate("participants", "firstName lastName role");
    }

    res.json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Send message in chat
// @route   POST /api/chats/:chatId/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Verify user is a participant in the chat
    if (!chat.participants.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to send message in this chat" });
    }

    const message = {
      sender: req.user._id,
      content,
      read: false,
    };

    chat.messages.push(message);
    chat.lastMessage = new Date();
    await chat.save();

    // Populate sender details
    const populatedChat = await Chat.findById(chat._id)
      .populate("participants", "firstName lastName role")
      .populate("messages.sender", "firstName lastName role");

    res.json(populatedChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("participants", "firstName lastName role")
      .populate("messages.sender", "firstName lastName role")
      .sort({ lastMessage: -1 });

    res.json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chats/:chatId/read
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Verify user is a participant in the chat
    if (!chat.participants.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this chat" });
    }

    // Mark all unread messages as read
    chat.messages.forEach((message) => {
      if (
        message.sender.toString() !== req.user._id.toString() &&
        !message.read
      ) {
        message.read = true;
      }
    });

    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getOrCreateChat,
  sendMessage,
  getUserChats,
  markMessagesAsRead,
};
