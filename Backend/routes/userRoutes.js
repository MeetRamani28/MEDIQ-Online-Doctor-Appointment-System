const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");

const {
  getAllSpecializations,
  getDoctorsBySpecialization,
  getMyMedicalRecords,
} = require("../controllers/userController");

const {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");

router.get(
  "/specializations",
  authMiddleware("PATIENT"),
  getAllSpecializations
);
router.get(
  "/specialization/:specializationId/doctors",
  authMiddleware("PATIENT"),
  getDoctorsBySpecialization
);

router.post("/appointments", authMiddleware("PATIENT"), createAppointment);
router.get("/appointments", authMiddleware("PATIENT"), getMyAppointments);
router.patch(
  "/appointments/cancel/:appointmentId",
  authMiddleware("PATIENT"),
  cancelAppointment
);

router.get("/medical-records", authMiddleware("PATIENT"), getMyMedicalRecords);

module.exports = router;
