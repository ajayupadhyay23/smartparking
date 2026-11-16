const mongoose = require("mongoose");

const parkingLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Parking facility name is required"],
      trim: true
    },
    city: {
      type: String,
      required: true,
      index: true
    },
    address: {
      type: String,
      required: true
    },
    // GeoJSON Point for geospatial queries ($near, $geoWithin)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    totalSlots: {
      type: Number,
      required: true,
      default: 50
    },
    availableSlots: {
      type: Number,
      default: 50
    },
    evSlotsTotal: {
      type: Number,
      default: 15
    },
    evSlotsAvailable: {
      type: Number,
      default: 15
    },
    hasFastCharger: {
      type: Boolean,
      default: false
    },
    maxPowerKw: {
      type: Number,
      default: 0
    },
    hourlyRate: {
      type: Number,
      required: true,
      default: 40
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 120
    },
    amenities: [
      {
        type: String
      }
    ],
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a"
    }
  },
  {
    timestamps: true
  }
);

// 2dsphere index for high-speed geospatial proximity searches
parkingLocationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("ParkingLocation", parkingLocationSchema);
