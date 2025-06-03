const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { patientId, date, time, reason } = req.body;

    // Verify patient exists
    const patient = await User.findOne({ _id: patientId, role: "patient" });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if doctor is available at the requested time
    const existingAppointment = await Appointment.findOne({
      doctor: req.user._id,
      date,
      time,
      status: "scheduled",
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot is already booked" });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: req.user._id,
      date,
      time,
      reason,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all appointments for a doctor
// @route   GET /api/appointments/doctor
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate("patient", "firstName lastName email")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all appointments for a patient
// @route   GET /api/appointments/patient
// @access  Private/Patient
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "firstName lastName specialization")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user is authorized to update
    if (
      req.user.role === "patient" &&
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }
    if (
      req.user.role === "doctor" &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    appointment.status = req.body.status || appointment.status;
    appointment.notes = req.body.notes || appointment.notes;
    appointment.followUp = req.body.followUp || appointment.followUp;
    appointment.followUpDate =
      req.body.followUpDate || appointment.followUpDate;

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user is authorized to cancel
    if (
      req.user.role === "patient" &&
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
    }
    if (
      req.user.role === "doctor" &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();
    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/appointments/admin
// @access  Private/Admin
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "firstName lastName email phoneNumber")
      .populate("doctor", "firstName lastName email specialization")
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
      message: "All appointments retrieved successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve appointments",
      error: error.message,
    });
  }
};

// @desc    Get appointments with filters
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const { status, date, doctorId, patientId } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (doctorId) {
      filter.doctor = doctorId;
    }

    if (patientId) {
      filter.patient = patientId;
    }

    // Add role-based filtering
    if (req.user.role === "doctor") {
      filter.doctor = req.user._id;
    } else if (req.user.role === "patient") {
      filter.patient = req.user._id;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "firstName lastName email phoneNumber")
      .populate("doctor", "firstName lastName email specialization")
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
      message: "Appointments retrieved successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve appointments",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointment,
  cancelAppointment,
  getAllAppointments,
  getAppointments,
};
