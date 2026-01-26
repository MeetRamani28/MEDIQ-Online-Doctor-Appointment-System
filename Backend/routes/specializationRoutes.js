const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");

const {
  createSpecialization,
  updateSpecialization,
  toggleSpecializationStatus,
  getAllSpecializations,
} = require("../controllers/specializationController");

router.post("/", authMiddleware("ADMIN"), createSpecialization);
router.put("/:id", authMiddleware("ADMIN"), updateSpecialization);
router.patch(
  "/toggle/:id",
  authMiddleware("ADMIN"),
  toggleSpecializationStatus
);

router.get("/", getAllSpecializations);

module.exports = router;
