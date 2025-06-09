const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    address: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    accountOpeningDate: {
      type: Date,
      default: Date.now,
    },
    profilePic: {
      type: String,
      required: true,
    },
    // Doctor specific fields
    username: {
      type: String,
      trim: true,
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    age: {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
    },
    qualifications: [
      {
        type: String, // URLs to uploaded documents
      },
    ],
    yearsOfExperience: {
      type: Number,
    },
    degreeType: {
      type: String,
    },
    hospital: {
      type: String,
    },
    specialization: {
      type: String,
      trim: true,
    },
    // Patient specific fields
    emergencyNumber: {
      type: String,
      required: function () {
        return this.role === "patient";
      },
    },
    allergies: [
      {
        type: String,
        required: function () {
          return this.role === "patient";
        },
      },
    ],
    pastSurgeries: [
      {
        type: String,
        required: function () {
          return this.role === "patient";
        },
      },
    ],
    bloodGroup: {
      type: String,
      required: function () {
        return this.role === "patient";
      },
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    genotype: {
      type: String,
      required: function () {
        return this.role === "patient";
      },
      enum: ["AA", "AS", "SS", "AC", "SC"],
    },
    lifestyleDiseases: [
      {
        type: String,
        required: function () {
          return this.role === "patient";
        },
      },
    ],
    hereditaryDiseases: [
      {
        type: String,
        required: function () {
          return this.role === "patient";
        },
      },
    ],
    chronicConditions: [
      {
        type: String,
        required: function () {
          return this.role === "patient";
        },
      },
    ],
    currentMedications: [
      {
        type: String,
        required: function () {
          return this.role === "patient";
        },
      },
    ],
    resetPasswordOTP: String,
    resetPasswordExpire: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
