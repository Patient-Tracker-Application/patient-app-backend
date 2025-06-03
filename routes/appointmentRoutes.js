const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointment,
  cancelAppointment,
  getAllAppointments,
  getAppointments,
} = require("../controllers/appointmentController");

// Get appointments with filters
router.get("/", protect, getAppointments);

// Admin routes
router.get("/admin", protect, authorize("admin"), getAllAppointments);

// Doctor routes
router.post("/", protect, authorize("doctor"), createAppointment);
router.get("/doctor", protect, authorize("doctor"), getDoctorAppointments);

// Patient routes
router.get("/patient", protect, authorize("patient"), getPatientAppointments);

// Shared routes
router.put("/:id", protect, updateAppointment);
router.delete("/:id", protect, cancelAppointment);

module.exports = router;
