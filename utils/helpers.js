const crypto = require("crypto");
const mongoose = require("mongoose");

// Generate random password
const generateRandomPassword = (length = 8) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format date to YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Format time to HH:MM
const formatTime = (time) => {
  return time.toString().padStart(5, "0");
};

// Generate random string for tokens
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  generateRandomPassword,
  isValidObjectId,
  isValidEmail,
  formatDate,
  formatTime,
  generateRandomString,
  generateOTP,
};
