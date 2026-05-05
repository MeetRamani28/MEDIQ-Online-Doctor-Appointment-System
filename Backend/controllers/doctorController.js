const Appointment = require("../model/appointment-model");
const User = require("../model/user-model");

const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // 1️⃣ Fetch pending appointments from today onwards
    const pendingAppointments = await Appointment.find({
      doctor: doctorId,
      status: "PENDING",
      appointmentDate: { $gte: todayStart },
    })
      .populate("user", "fullName email")
      .sort({ appointmentDate: 1 });

    // 2️⃣ Convert "07:00 PM" → Date & filter upcoming
    const upcomingAppointments = pendingAppointments.filter((appt) => {
      if (!appt.appointmentTime) return false;

      // "07:00 PM"
      const [time, modifier] = appt.appointmentTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const apptDateTime = new Date(appt.appointmentDate);
      apptDateTime.setHours(hours, minutes, 0, 0);

      return apptDateTime > now;
    });

    // 3️⃣ Today upcoming appointments only
    const todayAppointments = upcomingAppointments.filter((appt) => {
      const apptDate = new Date(appt.appointmentDate);
      return apptDate >= todayStart && apptDate <= todayEnd;
    });

    // 4️⃣ Counts
    const completedAppointmentsCount = await Appointment.countDocuments({
      doctor: doctorId,
      status: "COMPLETED",
    });

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctorId,
    });

    // 5️⃣ Recent records
    const recentRecords = await Appointment.find({
      doctor: doctorId,
      status: "COMPLETED",
      updatedAt: { $gte: todayStart },
    })
      .populate("user", "fullName email")
      .populate("medicalRecord")
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalPatients: totalAppointments,
        upcomingAppointments, // ✅ 7 & 8 PM WILL SHOW
        todayAppointments,
        completedAppointments: completedAppointmentsCount,
        pendingReports: 0,
        recentRecords,
      },
    });
  } catch (error) {
    console.error("Doctor Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
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
    // .select("-password") નો અર્થ છે પાસવર્ડ સિવાયનું બધું જ
    const doctor = await User.findById(req.user._id)
      .select("-password")
      .populate("doctorProfile.specialization");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Get Doctor Profile Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const updates = req.body || {};
    const allowedFields = [
      "degree",
      "experience",
      "consultationFee",
      "description",
      "hospitalAddress",
      "available",
      "maxAppointmentsPerDay",
    ];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        updateData[`doctorProfile.${field}`] = updates[field];
      }
    });

    if (req.file) updateData["doctorProfile.profileImage"] = req.file.buffer;

    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true },
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
