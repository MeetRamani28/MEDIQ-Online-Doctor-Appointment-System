const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");

const {
  createAppointment,
  cancelAppointment,
  completeAppointment,
  getMyAppointments,
  getDoctorAppointments,
} = require("../controllers/appointmentController");

router.post("/", authMiddleware("PATIENT"), createAppointment); // Book Appointment
router.get("/patient", authMiddleware("PATIENT"), getMyAppointments); // Patient's Appointments
router.patch(
  "/cancel/:appointmentId",
  authMiddleware("PATIENT"),
  cancelAppointment
);

router.get("/doctor", authMiddleware("DOCTOR"), getDoctorAppointments); // Doctor's Appointments
router.patch(
  "/complete/:appointmentId",
  authMiddleware("DOCTOR"),
  completeAppointment
);

module.exports = router;
