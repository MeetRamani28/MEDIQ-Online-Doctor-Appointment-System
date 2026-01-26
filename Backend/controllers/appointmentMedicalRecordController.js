const AppointmentMedicalRecord = require("../model/appointment-medical-record-model");
const Appointment = require("../model/appointment-model");

const createMedicalRecord = async (req, res) => {
  try {
    const { appointmentId, symptoms, diagnosis, prescription, doctorNotes } =
      req.body;

    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID required!" });
    }

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
        .json({ success: false, message: "Medical Record Already Exists!" });
    }

    const medicalRecord = await AppointmentMedicalRecord.create({
      appointment: appointmentId,
      symptoms,
      diagnosis,
      prescription,
      doctorNotes,
    });

    appointment.status = "COMPLETED";
    appointment.medicalRecord = medicalRecord._id;
    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Medical Record Created",
      medicalRecord,
    });
  } catch (error) {
    console.error("Create Medical Record Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    const medicalRecord = await AppointmentMedicalRecord.findById(recordId);
    if (!medicalRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Record Not Found!" });
    }

    const appointment = await Appointment.findOne({
      _id: medicalRecord.appointment,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res
        .status(403)
        .json({ success: false, message: "Access Denied!" });
    }

    const updatedRecord = await AppointmentMedicalRecord.findByIdAndUpdate(
      recordId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Medical Record Updated",
      medicalRecord: updatedRecord,
    });
  } catch (error) {
    console.error("Update Medical Record Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getMedicalRecordByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment Not Found!" });
    }

    if (
      req.user.role === "PATIENT" &&
      appointment.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access Denied!" });
    }
    if (
      req.user.role === "DOCTOR" &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access Denied!" });
    }

    const medicalRecord = await AppointmentMedicalRecord.findOne({
      appointment: appointmentId,
    });
    if (!medicalRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Medical Record Not Found!" });
    }

    res.status(200).json({ success: true, medicalRecord });
  } catch (error) {
    console.error("Fetch Medical Record Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createMedicalRecord,
  updateMedicalRecord,
  getMedicalRecordByAppointment,
};
