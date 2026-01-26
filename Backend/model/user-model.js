const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "DOCTOR", "PATIENT"],
      default: "PATIENT",
      required: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    dob: {
      type: Date,
    },
    age: {
      type: Number,
      min: 0,
    },

    doctorProfile: {
      type: new mongoose.Schema(
        {
          degree: {
            type: String,
          },
          experience: {
            type: Number,
          },
          consultationFee: {
            type: Number,
          },
          description: {
            type: String,
          },
          hospitalAddress: {
            type: String,
          },
          specialization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Specialization",
          },
          profileImage: {
            type: Buffer,
          },
          available: {
            type: Boolean,
            default: true,
          },
          maxAppointmentsPerDay: {
            type: Number,
            default: 10,
          },
          isActive: {
            type: Boolean,
            default: true,
          },
        },
        { _id: false }
      ),
      required: function () {
        return this.role === "DOCTOR";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
