const mongoose = require("mongoose");

const appointmentMedicalRecordSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

    symptoms: {
      type: String,
      maxlength: 2000,
    },

    diagnosis: {
      type: String,
      maxlength: 2000,
    },

    prescription: {
      type: String,
      maxlength: 3000,
    },

    doctorNotes: {
      type: String,
      maxlength: 3000,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model(
  "AppointmentMedicalRecord",
  appointmentMedicalRecordSchema
);
