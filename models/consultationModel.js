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
      sitting: {
        type: Number,
      },
      standing: {
        type: Number,
      },
      lying: {
        type: Number,
      },
      arm: {
        type: String,
        enum: ["left", "right"],
      },
    },
    pulse: {
      rate: {
        type: Number,
      },
      amplitude: {
        type: Number,
      },
      rhythm: {
        type: String,
        enum: ["regular", "irregular"],
      },
    },
    temperature: {
      units: {
        type: String,
        enum: ["F", "C"],
        default: "C",
      },
      value: {
        type: Number,
      },
      areas: {
        type: [String],
        enum: ["oral", "rectal", "AX", "TMP"],
      },
    },
    weight: {
      units: {
        type: String,
        enum: ["lbs", "kg"],
        default: "kg",
      },
      value: {
        type: Number,
      },
      is_shoes: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
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
