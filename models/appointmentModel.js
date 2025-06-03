const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    reason: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    followUp: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
