const User = require("../model/user-model");
const Appointment = require("../model/appointment-model");
const Specialization = require("../model/specialization-model");
const mongoose = require("mongoose");
const { hashPass } = require("../utils/encryptPass");

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "PATIENT" });
    const totalDoctors = await User.countDocuments({ role: "DOCTOR" });
    const totalAppointments = await Appointment.countDocuments();

    const pendingAppointments = await Appointment.countDocuments({
      status: "PENDING",
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const latestAppointments = await Appointment.find({
      status: "PENDING",
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("doctor", "fullName email")
      .populate("user", "fullName email")
      .sort({ appointmentDate: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        latestAppointments,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "PATIENT" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "DOCTOR" })
      .select("-password")
      .populate("doctorProfile.specialization")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    console.error("Fetch Doctors Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addDoctorByAdmin = async (req, res) => {
  try {
    const payload = req.body || {};
    const file = req.file;

    const { fullName, email, degree, experience, specialization, password } =
      payload;

    if (!fullName || !email || !specialization) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Email and Specialization are required",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: "Email exists" });
    }

    const spec = await Specialization.findById(specialization);
    if (!spec) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Specialization" });
    }

    const rawPassword = password || "Doctor@123";
    const hashedPassword = await hashPass(rawPassword);

    const doctorProfile = {
      degree: degree || "",
      experience: Number(experience) || 0,
      specialization: spec._id,
      isActive: true,
    };

    if (file) doctorProfile.profileImage = file.buffer; // store file as buffer (or upload to storage)

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "DOCTOR",
      doctorProfile,
    });

    res.status(201).json({ success: true, doctor: user });
  } catch (error) {
    console.error("Add Doctor Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateDoctorByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const file = req.file; // multer file

    // Find doctor
    const doctor = await User.findOne({ _id: id, role: "DOCTOR" });
    if (!doctor)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });

    // Ensure doctorProfile exists
    if (!doctor.doctorProfile) {
      doctor.doctorProfile = {};
    }

    // Update top-level fields
    if (payload.fullName !== undefined) doctor.fullName = payload.fullName;
    if (payload.email !== undefined) doctor.email = payload.email;

    // Fields inside doctorProfile
    const profileFields = [
      "degree",
      "experience",
      "consultationFee",
      "description",
      "hospitalAddress",
      "available",
      "maxAppointmentsPerDay",
    ];

    profileFields.forEach((field) => {
      if (payload[field] !== undefined && payload[field] !== null) {
        if (
          ["experience", "consultationFee", "maxAppointmentsPerDay"].includes(
            field
          )
        ) {
          doctor.doctorProfile[field] = Number(payload[field]);
        } else if (field === "available") {
          doctor.doctorProfile[field] =
            payload[field] === "true" || payload[field] === true;
        } else {
          doctor.doctorProfile[field] = payload[field];
        }
      }
    });

    // Update specialization safely
    if (payload.specialization) {
      let spec;
      if (mongoose.Types.ObjectId.isValid(payload.specialization)) {
        spec = await Specialization.findById(payload.specialization);
      } else {
        spec = await Specialization.findOne({ name: payload.specialization });
      }
      if (!spec)
        return res
          .status(400)
          .json({ success: false, message: "Invalid specialization" });
      doctor.doctorProfile.specialization = spec._id;
    }

    // Update profile image if uploaded
    if (file) {
      doctor.doctorProfile.profileImage = file.buffer;
    }

    await doctor.save();

    // Populate specialization for response
    await doctor.populate("doctorProfile.specialization", "name");

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error("Update Doctor Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteDoctorByAdmin = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await User.findOneAndDelete({
      _id: doctorId,
      role: "DOCTOR",
    });

    if (!doctor)
      return res
        .status(404)
        .json({ success: false, message: "Doctor Not Found" });

    res
      .status(200)
      .json({ success: true, message: "Doctor Deleted", doctorId });
  } catch (error) {
    console.error("Delete Doctor Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const toggleDoctorStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await User.findOne({ _id: doctorId, role: "DOCTOR" });
    if (!doctor)
      return res
        .status(404)
        .json({ success: false, message: "Doctor Not Found!" });

    doctor.doctorProfile.isActive = !doctor.doctorProfile.isActive;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor Status Updated",
      doctorId: doctor._id,
      isActive: doctor.doctorProfile.isActive,
    });
  } catch (error) {
    console.error("Toggle Doctor Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found!" });

    res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "fullName email")
      .populate("doctor", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Fetch Appointments Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

const updateAppointmentStatusByAdmin = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["PENDING", "COMPLETED", "CANCELLED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("user", "fullName email")
      .populate("doctor", "fullName email");

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Allow all transitions to avoid blocking frontend updates
    appointment.status = status;

    // Track timestamps
    if (status === "COMPLETED") {
      appointment.completedAt = new Date();
      appointment.cancelledAt = undefined;
    } else if (status === "CANCELLED") {
      appointment.cancelledAt = new Date();
      appointment.completedAt = undefined;
    } else if (status === "PENDING") {
      appointment.completedAt = undefined;
      appointment.cancelledAt = undefined;
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Update Appointment Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addUserByAdmin = async (req, res) => {
  try {
    const { fullName, email, password, gender, dob, age } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await hashPass(password);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "PATIENT", // 🔒 force patient
      gender,
      dob,
      age,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Add User Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const user = await User.findOne({ _id: userId, role: "PATIENT" });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (payload.fullName !== undefined) user.fullName = payload.fullName;
    if (payload.email !== undefined) user.email = payload.email;
    if (payload.gender !== undefined) user.gender = payload.gender;
    if (payload.dob !== undefined) user.dob = payload.dob;
    if (payload.age !== undefined) user.age = payload.age;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAdminDashboard,
  addDoctorByAdmin,
  updateDoctorByAdmin,
  deleteDoctorByAdmin,
  getAllUsers,
  getAllDoctors,
  toggleDoctorStatus,
  deleteUserByAdmin,
  updateUserByAdmin,
  addUserByAdmin,
  getAllAppointments,
  updateAppointmentStatusByAdmin,
};
