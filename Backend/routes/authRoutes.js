const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const upload = require("../config/multer-config");
const authMiddleware = require("../middlewares/authMiddlewares");

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware("ADMIN", "DOCTOR", "USER"), logoutUser);

module.exports = router;
