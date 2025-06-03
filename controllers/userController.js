const User = require("../models/userModel");
const { generateToken, generateRefreshToken } = require("../config/jwtToken");
const {
  sendWelcomeEmail,
  sendPasswordResetOTP,
  sendPasswordChangedEmail,
} = require("../utils/emailService");
const { generateRandomPassword, generateOTP } = require("../utils/helpers");
const bcrypt = require("bcryptjs");

// @desc    Register a new user (admin only)
// @route   POST /api/users/register
// @access  Private/Admin
const registerUser = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      role,
      phoneNumber,
      sex,
      address,
      dob,
      profilePic,
      // Doctor specific fields
      username,
      maritalStatus,
      age,
      qualifications,
      yearsOfExperience,
      degreeType,
      hospital,
      specialization,
      // Patient specific fields
      emergencyNumber,
      allergies,
      pastSurgeries,
      bloodGroup,
      genotype,
      lifestyleDiseases,
      hereditaryDiseases,
      chronicConditions,
      currentMedications,
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !firstName ||
      !lastName ||
      !role ||
      !sex ||
      !dob ||
      !profilePic
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        requiredFields: {
          email: !email ? "Email is required" : null,
          firstName: !firstName ? "First name is required" : null,
          lastName: !lastName ? "Last name is required" : null,
          role: !role ? "Role is required" : null,
          sex: !sex ? "Sex is required" : null,
          dob: !dob ? "Date of birth is required" : null,
          profilePic: !profilePic ? "Profile picture is required" : null,
        },
      });
    }

    // Validate role-specific required fields
    if (role === "doctor" && (!username || !age || !specialization)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for doctor",
        requiredFields: {
          username: !username ? "Username is required for doctors" : null,
          age: !age ? "Age is required for doctors" : null,
          specialization: !specialization
            ? "Specialization is required for doctors"
            : null,
        },
      });
    }

    if (role === "patient" && (!emergencyNumber || !bloodGroup || !genotype)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for patient",
        requiredFields: {
          emergencyNumber: !emergencyNumber
            ? "Emergency number is required for patients"
            : null,
          bloodGroup: !bloodGroup
            ? "Blood group is required for patients"
            : null,
          genotype: !genotype ? "Genotype is required for patients" : null,
        },
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        field: "email",
      });
    }

    const password = generateRandomPassword();
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      phoneNumber,
      sex,
      address,
      dob,
      profilePic,
      accountOpeningDate: new Date(),
      ...(role === "doctor" && {
        username,
        maritalStatus,
        age,
        qualifications,
        yearsOfExperience,
        degreeType,
        hospital,
        specialization,
      }),
      ...(role === "patient" && {
        emergencyNumber,
        allergies,
        pastSurgeries,
        bloodGroup,
        genotype,
        lifestyleDiseases,
        hereditaryDiseases,
        chronicConditions,
        currentMedications,
      }),
    });

    // Send welcome email with credentials
    try {
      await sendWelcomeEmail(email, password);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Continue with user creation even if email fails
    }

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        ...(role === "doctor" && {
          username: user.username,
          specialization: user.specialization,
        }),
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        requiredFields: {
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null,
        },
      });
    }

    // Find user and check if active
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        field: "email",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
        field: "account",
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        field: "password",
      });
    }

    try {
      // Generate tokens
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Prepare user data for response
      const userData = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        sex: user.sex,
        address: user.address,
        dob: user.dob,
        profilePic: user.profilePic,
        accountOpeningDate: user.accountOpeningDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
        // Role specific data
        ...(user.role === "doctor" && {
          username: user.username,
          maritalStatus: user.maritalStatus,
          age: user.age,
          qualifications: user.qualifications,
          yearsOfExperience: user.yearsOfExperience,
          degreeType: user.degreeType,
          hospital: user.hospital,
          specialization: user.specialization,
        }),
        ...(user.role === "patient" && {
          emergencyNumber: user.emergencyNumber,
          allergies: user.allergies,
          pastSurgeries: user.pastSurgeries,
          bloodGroup: user.bloodGroup,
          genotype: user.genotype,
          lifestyleDiseases: user.lifestyleDiseases,
          hereditaryDiseases: user.hereditaryDiseases,
          chronicConditions: user.chronicConditions,
          currentMedications: user.currentMedications,
        }),
      };

      // Send success response
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: userData,
          tokens: {
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: "1d",
            refreshExpiresIn: "7d",
          },
        },
      });
    } catch (tokenError) {
      return res.status(500).json({
        success: false,
        message: "Authentication failed",
        error: tokenError.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      data: user,
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to retrieve profile",
      error: error.message,
    });
  }
};

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.resetPasswordOTP = otp;
    user.resetPasswordExpire = otpExpiry;
    await user.save();

    // Send OTP email
    try {
      await sendPasswordResetOTP(email, otp);
      res.json({
        success: true,
        message: "Password reset OTP sent to your email",
      });
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing request",
      error: error.message,
    });
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send password changed email
    try {
      await sendPasswordChangedEmail(email);
    } catch (emailError) {
      console.error("Error sending password changed email:", emailError);
    }

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Send password changed email
    try {
      await sendPasswordChangedEmail(user.email);
    } catch (emailError) {
      console.error("Error sending password changed email:", emailError);
    }

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      profilePic,
      // Doctor specific fields
      username,
      maritalStatus,
      age,
      qualifications,
      yearsOfExperience,
      degreeType,
      hospital,
      specialization,
      // Patient specific fields
      emergencyNumber,
      allergies,
      pastSurgeries,
      bloodGroup,
      genotype,
      lifestyleDiseases,
      hereditaryDiseases,
      chronicConditions,
      currentMedications,
    } = req.body;

    const user = await User.findById(req.user._id);

    // Update common fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (profilePic) user.profilePic = profilePic;

    // Update role-specific fields
    if (user.role === "doctor") {
      if (username) user.username = username;
      if (maritalStatus) user.maritalStatus = maritalStatus;
      if (age) user.age = age;
      if (qualifications) user.qualifications = qualifications;
      if (yearsOfExperience) user.yearsOfExperience = yearsOfExperience;
      if (degreeType) user.degreeType = degreeType;
      if (hospital) user.hospital = hospital;
      if (specialization) user.specialization = specialization;
    }

    if (user.role === "patient") {
      if (emergencyNumber) user.emergencyNumber = emergencyNumber;
      if (allergies) user.allergies = allergies;
      if (pastSurgeries) user.pastSurgeries = pastSurgeries;
      if (bloodGroup) user.bloodGroup = bloodGroup;
      if (genotype) user.genotype = genotype;
      if (lifestyleDiseases) user.lifestyleDiseases = lifestyleDiseases;
      if (hereditaryDiseases) user.hereditaryDiseases = hereditaryDiseases;
      if (chronicConditions) user.chronicConditions = chronicConditions;
      if (currentMedications) user.currentMedications = currentMedications;
    }

    await user.save();

    res.json({
      success: true,
      data: user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
