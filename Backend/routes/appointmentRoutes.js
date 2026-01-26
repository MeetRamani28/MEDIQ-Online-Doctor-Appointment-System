const express = require("express");
const router = express.Router();

const {
  getMyAppointments,
  getDoctorAppointments,
  completeAppointment,
} = require("../controllers/appointmentController");

const authMiddleware = require("../middlewares/authMiddlewares");

router.patch(
  "/complete/:appointmentId",
  authMiddleware("DOCTOR"),
  completeAppointment
);

router.get("/doctor", authMiddleware("DOCTOR"), getDoctorAppointments);
router.get("/patient", authMiddleware("PATIENT"), getMyAppointments);

module.exports = router;
