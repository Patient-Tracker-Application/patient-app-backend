require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const connectDB = require("../config/db_connect");

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      email: "admin@patienttracker.com",
      password: "Admin@123", // This will be hashed by the pre-save hook
      firstName: "System",
      lastName: "Admin",
      role: "admin",
      phoneNumber: "1234567890",
      sex: "male",
      address: "System Address",
      dob: new Date("1990-01-01"),
      profilePic: "default-admin.jpg",
      isActive: true,
    });

    console.log("Admin user created successfully:");
    console.log("Email:", admin.email);
    console.log("Password: Admin@123");
    console.log("\nPlease change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
