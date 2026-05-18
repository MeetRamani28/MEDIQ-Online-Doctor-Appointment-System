const User = require("../model/user-model");
const Specialization = require("../model/specialization-model");
const { comparePass } = require("../utils/decryptPass");
const { hashPass } = require("../utils/encryptPass");
const { generateToken } = require("../utils/generateToken");
const { pdfToPng } = require("pdf-to-png-converter");
const Tesseract = require("tesseract.js");

/**
 * @desc 1. Pre-verification API for Doctor's License (Supports PDF & Images)
 */
const verifyLicense = async (req, res) => {
  try {
    const { licenseNumber } = req.body;
    const licenseDocFile = req.files?.["licenseDocument"]
      ? req.files["licenseDocument"][0]
      : null;

    if (!licenseDocFile || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message:
          "License number and document are required.",
      });
    }

    let imageBuffer = licenseDocFile.buffer;

    // --- Handling PDF Conversion (If uploaded file is PDF) ---
    if (licenseDocFile.mimetype === "application/pdf") {
      try {
        // pdf-to-png-converter નો ઉપયોગ કરીને PDF ને PNG માં ફેરવો
        const pngPages = await pdfToPng(licenseDocFile.buffer, {
          viewportScale: 2.0, // સારી ક્વોલિટી માટે (OCR માટે જરૂરી છે)
          pagesArray: [1], // માત્ર પહેલું પેજ
        });

        if (pngPages.length > 0) {
          imageBuffer = pngPages[0].content; // PNG બફર મેળવો
        } else {
          throw new Error("Could not extract pages from PDF.");
        }
      } catch (pdfErr) {
        console.error("PDF Conversion Error:", pdfErr);
        return res.status(400).json({
          success: false,
          message:
            "Unable to process PDF. Please upload a clear image instead.)",
        });
      }
    }

    // --- OCR Process using Tesseract ---
    const {
      data: { text },
    } = await Tesseract.recognize(imageBuffer, "eng");

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Document is not clear. OCR failed to read text. )",
      });
    }

    const extractedText = text.toUpperCase();
    const isLicenseValid = extractedText.includes(licenseNumber.toUpperCase());

    // Medical keywords to ensure it's a valid certificate
    const hasMedicalKeywords =
      /MEDICAL|COUNCIL|CERTIFICATE|REGISTRATION|DOCTOR|HEALTH|MBBS|SURGEON|PRACTITIONER/i.test(
        extractedText,
      );

    if (!isLicenseValid) {
      return res.status(400).json({
        success: false,
        message:
          "Verification Failed: License number not found in the document.)",
      });
    }

    if (!hasMedicalKeywords) {
      return res.status(400).json({
        success: false,
        message:
          "Verification Failed: The uploaded file does not appear to be a valid medical certificate.)",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Document verified successfully! You can now proceed with registration.)",
    });
  } catch (ocrErr) {
    console.error("OCR Error:", ocrErr);
    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error during verification. Please try again. )",
    });
  }
};

/**
 * @desc Register a new user (PATIENT, DOCTOR, or ADMIN)
 * Includes strict OCR verification for Doctors
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
      licenseNumber,
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

      const profileImgFile = req.files?.["profileImage"]
        ? req.files["profileImage"][0]
        : null;
      const licenseDocFile = req.files?.["licenseDocument"]
        ? req.files["licenseDocument"][0]
        : null;

      userData.doctorProfile = {
        degree,
        experience,
        consultationFee,
        description,
        hospitalAddress,
        licenseNumber,
        specialization: spec._id,
        profileImage: req.file?.buffer,
        licenseDocument: licenseDocFile
          ? {
              data: licenseDocFile.buffer,
              contentType: licenseDocFile.mimetype,
            }
          : null,
        isVerified: false,
        available: available ?? true,
        maxAppointmentsPerDay: maxAppointmentsPerDay || 10,
        isActive: true,
      };
    }

    const user = await User.create(userData);
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(201).json({
      success: true,
      message:
        role === "DOCTOR"
          ? "Registration successful. Waiting for admin review."
          : "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Register error" });
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
      sameSite: "none",
      secure: true,
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  verifyLicense,
};
