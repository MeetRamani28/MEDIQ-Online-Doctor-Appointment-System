const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const authMiddleware = require("../middlewares/authMiddlewares");

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} = require("../controllers/authController");

/**
 * @route POST /api/auth/register
 * @desc Register a new user (PATIENT, DOCTOR, ADMIN)
 * @access Public (ADMIN requires middleware to protect route)
 */
router.post("/register", upload.single("profileImage"), registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post("/login", loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private (any logged-in user)
 */
router.post("/logout", authMiddleware(), logoutUser);

/**
 * @route GET /api/auth/me
 * @desc Get logged-in user's profile
 * @access Private
 */
router.get("/me", authMiddleware(), getUserProfile);

module.exports = router;
