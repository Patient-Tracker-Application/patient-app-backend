const Consultation = require("../models/consultationModel");
const User = require("../models/userModel");

// @desc    Create a new consultation
// @route   POST /api/consultations
// @access  Private/Doctor
const createConsultation = async (req, res) => {
  try {
    const {
      date,
      time,
      complaints,
      note,
      userId,
      blood_pressure,
      pulse,
      temperature,
      weight,
    } = req.body;

    // Verify patient exists
    const patient = await User.findOne({ _id: userId, role: "patient" });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const consultation = await Consultation.create({
      date,
      time,
      complaints,
      note,
      userId,
      doctorId: req.user._id,
      blood_pressure,
      pulse,
      temperature,
      weight,
    });

    res.status(201).json({
      success: true,
      data: consultation,
      message: "Consultation created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating consultation",
      error: error.message,
    });
  }
};

// @desc    Get all consultations (admin only)
// @route   GET /api/consultations
// @access  Private/Admin
const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate("userId", "firstName lastName email")
      .populate("doctorId", "firstName lastName email")
      .sort("-createdAt");

    res.json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching consultations",
      error: error.message,
    });
  }
};

// @desc    Get doctor's consultations
// @route   GET /api/consultations/doctor
// @access  Private/Doctor
const getDoctorConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctorId: req.user._id })
      .populate("userId", "firstName lastName email")
      .sort("-createdAt");

    res.json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching consultations",
      error: error.message,
    });
  }
};

// @desc    Get patient's consultations
// @route   GET /api/consultations/patient
// @access  Private/Patient
const getPatientConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ userId: req.user._id })
      .populate("doctorId", "firstName lastName email")
      .sort("-createdAt");

    res.json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching consultations",
      error: error.message,
    });
  }
};

// @desc    Update consultation
// @route   PUT /api/consultations/:id
// @access  Private/Doctor
const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      doctorId: req.user._id,
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    const updatedConsultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: updatedConsultation,
      message: "Consultation updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating consultation",
      error: error.message,
    });
  }
};

// @desc    Delete consultation
// @route   DELETE /api/consultations/:id
// @access  Private/Doctor
const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      doctorId: req.user._id,
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    await consultation.deleteOne();

    res.json({
      success: true,
      message: "Consultation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting consultation",
      error: error.message,
    });
  }
};

module.exports = {
  createConsultation,
  getAllConsultations,
  getDoctorConsultations,
  getPatientConsultations,
  updateConsultation,
  deleteConsultation,
};
