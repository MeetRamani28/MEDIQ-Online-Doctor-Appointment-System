const User = require("../model/user-model");
const Specialization = require("../model/specialization-model");
const Appointment = require("../model/appointment-model");
const mongoose = require("mongoose");

const getAllSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: specializations.length,
      specializations,
    });
  } catch (error) {
    console.error("Fetch Specializations Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specializationId } = req.params;

    if (specializationId === "All") {
      const doctors = await User.find({
        role: "DOCTOR",
        "doctorProfile.isActive": true,
      })
        .select("-password")
        .populate("doctorProfile.specialization");

      return res.status(200).json({
        success: true,
        count: doctors.length,
        doctors,
      });
    }

    let specializationObjectId = specializationId;

    if (!mongoose.Types.ObjectId.isValid(specializationId)) {
      const specialization = await Specialization.findOne({
        name: specializationId,
        isActive: true,
      });

      if (!specialization) {
        return res.status(404).json({
          success: false,
          message: "Specialization not found",
        });
      }

      specializationObjectId = specialization._id;
    }

    const doctors = await User.find({
      role: "DOCTOR",
      "doctorProfile.specialization": specializationObjectId,
      "doctorProfile.isActive": true,
    })
      .select("-password")
      .populate("doctorProfile.specialization");

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getMyMedicalRecords = async (req, res) => {
  try {
    const records = await Appointment.find({
      user: req.user._id,
      status: "COMPLETED",
    })
      .populate("doctor", "fullName email")
      .populate("medicalRecord")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    console.error("Fetch My Records Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAllSpecializations,
  getDoctorsBySpecialization,
  getMyMedicalRecords,
};
