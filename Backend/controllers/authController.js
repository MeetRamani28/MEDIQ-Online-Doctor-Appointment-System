const User = require("../model/user-model");
const Specialization = require("../model/specialization-model");
const { comparePass } = require("../utils/decryptPass");
const { hashPass } = require("../utils/encryptPass");
const { generateToken } = require("../utils/generateToken");

/**
 * @desc Register a new user (PATIENT, DOCTOR, or ADMIN)
 */
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      gender,
      dob,
      age,
      degree,
      experience,
      consultationFee,
      description,
      hospitalAddress,
      specialization,
      available,
      maxAppointmentsPerDay,
    } = req.body;

    if (!fullName || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });

    if (role === "ADMIN" && (await User.findOne({ role: "ADMIN" })))
      return res
        .status(403)
        .json({ success: false, message: "Admin already exists" });

    if (await User.findOne({ email }))
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await hashPass(password);

    const userData = {
      fullName,
      email,
      password: hashedPassword,
      role: role || "PATIENT",
      gender,
      dob,
      age,
    };

    if (role === "DOCTOR") {
      if (!specialization)
        return res
          .status(400)
          .json({ success: false, message: "Specialization required" });

      const spec = await Specialization.findOne({ name: specialization });
      if (!spec)
        return res
          .status(400)
          .json({ success: false, message: "Invalid specialization" });

      userData.doctorProfile = {
        degree,
        experience,
        consultationFee,
        description,
        hospitalAddress,
        specialization: spec._id,
        profileImage: req.file?.buffer,
        available: available ?? true,
        maxAppointmentsPerDay: maxAppointmentsPerDay || 10,
        isActive: true,
      };
    }

    const user = await User.create(userData);
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Login user (PATIENT, DOCTOR, ADMIN)
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await comparePass(password, user.password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

/**
 * @desc Logout user
 */
const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

/**
 * @desc Get logged-in user profile
 */
const getUserProfile = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("doctorProfile.specialization");

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Get User Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getUserProfile };
