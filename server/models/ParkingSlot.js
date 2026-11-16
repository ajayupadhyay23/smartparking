const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingLocation",
      required: true,
      index: true
    },
    slotNumber: {
      type: String,
      required: true,
      trim: true
    },
    floor: {
      type: String,
      enum: ["Basement 1", "Ground", "Level 1", "Level 2"],
      default: "Ground"
    },
    type: {
      type: String,
      enum: ["standard", "ev-fast", "ev-ultra", "disabled"],
      default: "standard"
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "maintenance"],
      default: "available",
      index: true
    },
    powerKw: {
      type: Number,
      default: 0
    },
    pricePerHour: {
      type: Number,
      required: true
    },
    connectorType: {
      type: String,
      default: "None"
    },
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Ensure no duplicate slot numbers within the same facility
parkingSlotSchema.index({ location: 1, slotNumber: 1 }, { unique: true });

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
