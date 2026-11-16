const mongoose = require("mongoose");

const chargingSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    parkingSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSlot",
      required: true
    },
    startSoc: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    currentSoc: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    targetSoc: {
      type: Number,
      default: 100
    },
    energyDeliveredKwh: {
      type: Number,
      default: 0
    },
    currentPowerKw: {
      type: Number,
      default: 0
    },
    voltage: {
      type: Number,
      default: 440
    },
    currentAmperes: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "terminated"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ChargingSession", chargingSessionSchema);
