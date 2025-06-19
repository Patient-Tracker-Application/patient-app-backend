const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    complaints: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    blood_pressure: {
      valuePre: {
        type: String,
      },
      arm: {
        type: String,
        enum: ["left", "right"],
      },
    },
    pulse: {
      valuePulse: {
        type: Number,
      },
     
      rhythm: {
        type: String,
        enum: ["regular", "irregular"],
      },
    },
    temperature: {
      unitsTemp: {
        type: String,
        enum: ["F", "C"],
        default: "C",
      },
      valueTemp: {
        type: Number,
      },
    },
    weight: {
      units: {
        type: String,
        enum: ["lbs", "kg"],
        default: "kg",
      },
      valueWg: {
        type: Number,
      },
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
