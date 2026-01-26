const User = require("../model/user-model");
const Appointment = require("../model/appointment-model");

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "PATIENT" });
    const totalDoctors = await User.countDocuments({ role: "DOCTOR" });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({
      status: "PENDING",
    });

    const latestAppointments = await Appointment.find()
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
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Users
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
      .populate("doctor", "fullName email")
      .populate("user", "fullName email")
      .populate("medicalRecord")
      .sort({ appointmentDate: -1 });

    res
      .status(200)
      .json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error("Fetch Appointments Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getAllDoctors,
  toggleDoctorStatus,
  deleteUserByAdmin,
  getAllAppointments,
};
