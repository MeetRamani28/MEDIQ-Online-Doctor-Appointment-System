const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const upload = require("../config/multer-config");

const {
  getAdminDashboard,
  getAllUsers,
  getAllDoctors,
  toggleDoctorStatus,
  deleteUserByAdmin,
  getAllAppointments,
  updateDoctorByAdmin,
  addDoctorByAdmin,
  deleteDoctorByAdmin,
  updateAppointmentStatusByAdmin,
  updateUserByAdmin,
  addUserByAdmin,
} = require("../controllers/adminController");

router.get("/dashboard", authMiddleware("ADMIN"), getAdminDashboard);

router.get("/users", authMiddleware("ADMIN"), getAllUsers);
router.post("/users", authMiddleware("ADMIN"), addUserByAdmin);
router.put("/users/:userId", authMiddleware("ADMIN"), updateUserByAdmin);
router.delete("/users/:userId", authMiddleware("ADMIN"), deleteUserByAdmin);

router.get("/doctors", authMiddleware("ADMIN"), getAllDoctors);
router.post(
  "/doctors",
  upload.single("profileImage"),
  authMiddleware("ADMIN"),
  addDoctorByAdmin
); // Add
router.put(
  "/doctors/:id",
  upload.single("profileImage"),
  authMiddleware("ADMIN"),
  updateDoctorByAdmin
);
router.patch(
  "/doctors/toggle/:doctorId",
  authMiddleware("ADMIN"),
  toggleDoctorStatus
);
router.delete(
  "/doctors/:doctorId",
  authMiddleware("ADMIN"),
  deleteDoctorByAdmin
);
router.patch(
  "/appointments/:appointmentId/status",
  authMiddleware("ADMIN"),
  updateAppointmentStatusByAdmin
);

router.get("/appointments", authMiddleware("ADMIN"), getAllAppointments);

module.exports = router;
