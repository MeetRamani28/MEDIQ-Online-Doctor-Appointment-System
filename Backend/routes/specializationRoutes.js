const express = require("express");
const router = express.Router();

const {
  createSpecialization,
  getAllSpecializations,
  updateSpecialization,
  toggleSpecializationStatus,
} = require("../controllers/specializationController");

const authMiddleware = require("../middlewares/authMiddlewares");

router.post("/", authMiddleware("ADMIN"), createSpecialization);
router.put("/:id", authMiddleware("ADMIN"), updateSpecialization);
router.patch(
  "/toggle/:id",
  authMiddleware("ADMIN"),
  toggleSpecializationStatus
);

router.get("/", getAllSpecializations);

module.exports = router;
