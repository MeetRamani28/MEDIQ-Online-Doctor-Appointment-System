const express = require("express");
const router = express.Router();

const {
  getDoctorDashboard,
  getDoctorMedicalRecords,
  getDoctorProfile,
  updateDoctorProfile,
} = require("../controllers/doctorController");
const upload = require("../config/multer-config");
const {
  getDoctorAppointments,
} = require("../controllers/appointmentController");

const authMiddleware = require("../middlewares/authMiddlewares");

router.get("/dashboard", authMiddleware("DOCTOR"), getDoctorDashboard);

// Profile
router.get("/profile", authMiddleware("DOCTOR"), getDoctorProfile);
router.put(
  "/profile",
  upload.single("profileImage"),
  authMiddleware("DOCTOR"),
  updateDoctorProfile
);

// Appointments
router.get("/appointments", authMiddleware("DOCTOR"), getDoctorAppointments);

// Medical Records
router.get(
  "/medical-records",
  authMiddleware("DOCTOR"),
  getDoctorMedicalRecords
);

module.exports = router;
