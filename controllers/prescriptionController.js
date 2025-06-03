const Prescription = require("../models/prescriptionModel");
const User = require("../models/userModel");

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Private/Doctor
const createPrescription = async (req, res) => {
  try {
    const { name, amount, dose, duration, patientId, notes } = req.body;

    // Verify patient exists
    const patient = await User.findOne({ _id: patientId, role: "patient" });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const prescription = await Prescription.create({
      name,
      amount,
      dose,
      duration,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientId,
      doctorId: req.user._id,
      notes,
    });

    res.status(201).json({
      success: true,
      data: prescription,
      message: "Prescription created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating prescription",
      error: error.message,
    });
  }
};

// @desc    Get all prescriptions (admin only)
// @route   GET /api/prescriptions
// @access  Private/Admin
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("patientId", "firstName lastName email")
      .populate("doctorId", "firstName lastName email")
      .sort("-createdAt");

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};

// @desc    Get doctor's prescriptions
// @route   GET /api/prescriptions/doctor
// @access  Private/Doctor
const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.user._id })
      .populate("patientId", "firstName lastName email")
      .sort("-createdAt");

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};

// @desc    Get patient's prescriptions
// @route   GET /api/prescriptions/patient
// @access  Private/Patient
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user._id })
      .populate("doctorId", "firstName lastName email")
      .sort("-createdAt");

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private/Doctor
const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctorId: req.user._id,
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: updatedPrescription,
      message: "Prescription updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating prescription",
      error: error.message,
    });
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private/Doctor
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctorId: req.user._id,
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    await prescription.remove();

    res.json({
      success: true,
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting prescription",
      error: error.message,
    });
  }
};

module.exports = {
  createPrescription,
  getAllPrescriptions,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  updatePrescription,
  deletePrescription,
};
