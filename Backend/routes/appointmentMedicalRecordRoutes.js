const express = require("express");
const router = express.Router();
const {
  createMedicalRecord,
  updateMedicalRecord,
  getMedicalRecordByAppointment,
} = require("../controllers/appointmentMedicalRecordController");
const authMiddleware = require("../middlewares/authMiddlewares");

router.post("/", authMiddleware("DOCTOR"), createMedicalRecord);
router.put("/:recordId", authMiddleware("DOCTOR"), updateMedicalRecord);

router.get(
  "/appointment/:appointmentId",
  authMiddleware("ADMIN", "DOCTOR", "USER"),
  getMedicalRecordByAppointment
);

module.exports = router;
