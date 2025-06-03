const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getAllPrescriptions,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  updatePrescription,
  deletePrescription,
} = require("../controllers/prescriptionController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Protected routes
router.post("/", protect, authorize("doctor"), createPrescription);
router.get("/", protect, authorize("admin"), getAllPrescriptions);
router.get("/doctor", protect, authorize("doctor"), getDoctorPrescriptions);
router.get("/patient", protect, authorize("patient"), getPatientPrescriptions);
router.put("/:id", protect, authorize("doctor"), updatePrescription);
router.delete("/:id", protect, authorize("doctor"), deletePrescription);

module.exports = router;
