const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");

const {
  getAdminDashboard,
  getAllUsers,
  getAllDoctors,
  toggleDoctorStatus,
  deleteUserByAdmin,
  getAllAppointments,
} = require("../controllers/adminController");

router.get("/dashboard", authMiddleware("ADMIN"), getAdminDashboard);

router.get("/users", authMiddleware("ADMIN"), getAllUsers);
router.delete("/users/:userId", authMiddleware("ADMIN"), deleteUserByAdmin);

router.get("/doctors", authMiddleware("ADMIN"), getAllDoctors);
router.patch(
  "/doctors/toggle/:doctorId",
  authMiddleware("ADMIN"),
  toggleDoctorStatus
);

router.get("/appointments", authMiddleware("ADMIN"), getAllAppointments);

module.exports = router;
