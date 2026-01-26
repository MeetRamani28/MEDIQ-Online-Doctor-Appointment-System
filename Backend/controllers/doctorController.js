const Appointment = require("../model/appointment-model");
const User = require("../model/user-model");

const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctorId,
    });
    const upcomingAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: "PENDING",
      appointmentDate: { $gte: new Date() },
    });
    const completedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: "COMPLETED",
    });
    const cancelledAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: "CANCELLED",
    });

    const todayAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: todayStart, $lte: todayEnd },
    })
      .populate("user", "fullName email")
      .sort({ appointmentTime: 1 });

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
        todayAppointments,
      },
    });
  } catch (error) {
    console.error("Doctor Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getDoctorMedicalRecords = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const records = await Appointment.find({
      doctor: doctorId,
      status: "COMPLETED",
    })
      .populate("user", "fullName email")
      .populate("medicalRecord")
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: records.length, records });
  } catch (error) {
    console.error("Doctor Medical Records Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id)
      .select("-password")
      .populate("doctorProfile.specialization");
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error("Get Doctor Profile Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const updates = req.body || {};
    const allowedUpdates = [
      "degree",
      "experience",
      "consultationFee",
      "description",
      "hospitalAddress",
      "available",
      "maxAppointmentsPerDay",
    ];
    const updateData = {};

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined)
        updateData[`doctorProfile.${field}`] = updates[field];
    });

    if (req.file) updateData["doctorProfile.profileImage"] = req.file.buffer;

    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");
    res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully", doctor });
  } catch (error) {
    console.error("Update Doctor Profile Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getDoctorDashboard,
  getDoctorMedicalRecords,
  getDoctorProfile,
  updateDoctorProfile,
};
