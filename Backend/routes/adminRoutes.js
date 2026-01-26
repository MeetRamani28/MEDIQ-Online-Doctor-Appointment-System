const express = require("express");
const router = express.Router();

const {
  getAllAppointments,
  getAdminDashboard,
  getAllDoctors,
  getAllUsers,
  deleteUserByAdmin,
  toggleDoctorStatus,
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddlewares");

router.get("/dashboard", authMiddleware("ADMIN"), getAdminDashboard);

router.get("/users", authMiddleware("ADMIN"), getAllUsers);
router.delete("/user/:userId", authMiddleware("ADMIN"), deleteUserByAdmin);

router.get("/doctors", authMiddleware("ADMIN"), getAllDoctors);
router.patch(
  "/doctor/toggle/:doctorId",
  authMiddleware("ADMIN"),
  toggleDoctorStatus
);

router.get("/appointments", authMiddleware("ADMIN"), getAllAppointments);

module.exports = router;
