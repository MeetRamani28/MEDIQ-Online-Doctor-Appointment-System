const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const authMiddleware = require("../middlewares/authMiddlewares");

const {
  getDoctorDashboard,
  getDoctorMedicalRecords,
  getDoctorProfile,
  updateDoctorProfile,
} = require("../controllers/doctorController");

const {
  getDoctorAppointments,
} = require("../controllers/appointmentController");

router.get("/dashboard", authMiddleware("DOCTOR"), getDoctorDashboard);

router.get("/profile", authMiddleware("DOCTOR"), getDoctorProfile);
router.put(
  "/profile",
  authMiddleware("DOCTOR"),
  upload.single("profileImage"),
  updateDoctorProfile
);

router.get("/appointments", authMiddleware("DOCTOR"), getDoctorAppointments);

router.get(
  "/medical-records",
  authMiddleware("DOCTOR"),
  getDoctorMedicalRecords
);

module.exports = router;
