const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");

const {
  createMedicalRecord,
  updateMedicalRecord,
  getMedicalRecordByAppointment,
} = require("../controllers/appointmentMedicalRecordController");

router.post("/", authMiddleware("DOCTOR"), createMedicalRecord); // Create
router.put("/:recordId", authMiddleware("DOCTOR"), updateMedicalRecord); // Update

router.get(
  "/appointment/:appointmentId",
  authMiddleware("ADMIN", "DOCTOR", "PATIENT"),
  getMedicalRecordByAppointment
);

module.exports = router;
