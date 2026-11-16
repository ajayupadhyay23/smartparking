const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    licensePlate: {
      type: String,
      required: [true, "Vehicle registration number is required"],
      uppercase: true,
      trim: true
    },
    makeModel: {
      type: String,
      required: [true, "Vehicle make and model is required"],
      trim: true
    },
    isEV: {
      type: Boolean,
      default: true
    },
    batteryCapacityKwh: {
      type: Number,
      default: 40.5
    },
    connectorType: {
      type: String,
      enum: ["CCS-2", "Type 2", "CHAdeMO", "GB/T", "None"],
      default: "CCS-2"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
