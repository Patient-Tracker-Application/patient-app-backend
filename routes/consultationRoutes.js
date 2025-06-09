const express = require("express");
const router = express.Router();
const {
  createConsultation,
  getAllConsultations,
  getDoctorConsultations,
  getPatientConsultations,
  updateConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Protected routes
router.post("/", protect, authorize("doctor"), createConsultation);
router.get("/all-consultations", protect, authorize("admin"), getAllConsultations);
router.get("/doctor", protect, authorize("doctor"), getDoctorConsultations);
router.get("/patient", protect, authorize("patient"), getPatientConsultations);
router.put("/:id", protect, authorize("doctor"), updateConsultation);
router.delete("/:id", protect, authorize("doctor"), deleteConsultation);

module.exports = router;
