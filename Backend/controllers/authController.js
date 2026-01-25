const User = require("../model/user-model");
const Specialization = require("../model/specialization-model");
const { comparePass } = require("../utils/decryptPass");
const { hashPass } = require("../utils/encryptPass");
const { generateToken } = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const body = req.body || {};

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
    } = body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "FullName, Email And Password Are Required!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists!",
      });
    }

    const hasedPassword = await hashPass(password);

    const userData = {
      fullName,
      email,
      password: hasedPassword,
      role: role || "PATIENT",
      gender,
      dob,
      age,
    };

    if (role === "DOCTOR") {
      if (!specialization) {
        return res.status(400).json({
          success: false,
          message: "Specialization Is Required For Doctor!",
        });
      }

      const spec = await Specialization.findOne({ name: specialization });

      if (!spec) {
        return res.status(400).json({
          success: false,
          message: "Invalid Specialization Name!",
        });
      }

      userData.doctorProfile = {
        degree,
        experience,
        consultationFee,
        description,
        hospitalAddress,
        specialization: spec._id,
        profileImage: req.file ? req.file.buffer : undefined,
        available: available !== undefined ? available : true,
        maxAppointmentsPerDay: maxAppointmentsPerDay || 10,
      };
    }

    const user = await User.create(userData);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registration SuccessFull",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration Error!", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const body = req.body || {};

    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email And Password Are Required!",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Exists!",
      });
    }

    const isMatch = await comparePass(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password!",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login SuccessFull!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error: ", error);
    res.status(500).json({
      success: false,
      message: "Login Failed!",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout SuccessFully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout Failed!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
