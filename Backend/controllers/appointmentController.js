const Appointment = require("../model/appointment-model");
const User = require("../model/user-model");
const AppointmentMedicalRecord = require("../model/appointment-medical-record-model");

const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Doctor, Date, and Time are required!",
      });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: "DOCTOR",
      "doctorProfile.isActive": true,
    });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor Not Available!" });
    }

    const appointment = await Appointment.create({
      doctor: doctorId,
      user: req.user._id,
      appointmentDate,
      appointmentTime,
      status: "PENDING",
    });

    res
      .status(201)
      .json({ success: true, message: "Appointment Booked", appointment });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user: req.user._id,
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment Not Found!" });
    }

    appointment.status = "CANCELLED";
    await appointment.save();

    res.status(200).json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { symptoms, diagnosis, prescription, doctorNotes } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment Not Found!" });
    }
    if (appointment.status === "COMPLETED") {
      return res
        .status(400)
        .json({ success: false, message: "Appointment Already Completed!" });
    }

    const medicalRecord = await AppointmentMedicalRecord.create({
      appointment: appointment._id,
      symptoms,
      diagnosis,
      prescription,
      doctorNotes,
    });

    appointment.status = "COMPLETED";
    appointment.medicalRecord = medicalRecord._id;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment Completed",
      medicalRecord,
    });
  } catch (error) {
    console.error("Complete Appointment Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("doctor", "fullName email doctorProfile")
      .populate("medicalRecord")
      .sort({ appointmentDate: -1 });

    res
      .status(200)
      .json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error("Get My Appointments Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Doctor's Appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate("user", "fullName email")
      .populate("medicalRecord")
      .sort({ appointmentDate: -1 });

    res
      .status(200)
      .json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error("Get Doctor Appointments Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createAppointment,
  cancelAppointment,
  completeAppointment,
  getMyAppointments,
  getDoctorAppointments,
};
