const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    assignDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    dose: {
      morning: {
        type: Boolean,
        default: false,
      },
      afternoon: {
        type: Boolean,
        default: false,
      },
      night: {
        type: Boolean,
        default: false,
      },
    },
    duration: {
      type: Number,
      required: true,
      comment: "Duration in days",
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
