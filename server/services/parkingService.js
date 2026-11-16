const mongoose = require("mongoose");
const ParkingLocation = require("../models/ParkingLocation");
const ParkingSlot = require("../models/ParkingSlot");

// Fallback in-memory dataset when MongoDB daemon is not running locally
const FALLBACK_LOCATIONS = [
  {
    _id: "loc_01",
    id: "loc_01",
    name: "Cyber City EV Hub & Multi-Level Parking",
    city: "Gurugram",
    address: "DLF Cyber City, Sector 24, Rapid Metro Pillar 42",
    totalSlots: 120,
    availableSlots: 46,
    evSlotsTotal: 30,
    evSlotsAvailable: 14,
    hasFastCharger: true,
    maxPowerKw: 150,
    hourlyRate: 80,
    rating: 4.9,
    reviewsCount: 384,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
    amenities: ["24/7 Security", "CCTV Surveillance", "Valet Service", "Restrooms", "Cafe", "Car Wash"]
  },
  {
    _id: "loc_02",
    id: "loc_02",
    name: "Connaught Place Radial Smart Bay",
    city: "New Delhi",
    address: "Inner Circle, Block C, Near Rajiv Chowk Gate 4",
    totalSlots: 85,
    availableSlots: 18,
    evSlotsTotal: 20,
    evSlotsAvailable: 5,
    hasFastCharger: true,
    maxPowerKw: 120,
    hourlyRate: 100,
    rating: 4.8,
    reviewsCount: 512,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80",
    amenities: ["Covered Parking", "Security Guard", "Wheelchair Accessible", "EV Fast Charging"]
  },
  {
    _id: "loc_03",
    id: "loc_03",
    name: "Bandra Kurla Complex (BKC) EV Supergrid",
    city: "Mumbai",
    address: "G Block, Near Diamond Bourse, Bandra East",
    totalSlots: 150,
    availableSlots: 62,
    evSlotsTotal: 50,
    evSlotsAvailable: 24,
    hasFastCharger: true,
    maxPowerKw: 250,
    hourlyRate: 120,
    rating: 4.9,
    reviewsCount: 620,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80",
    amenities: ["Ultra-Fast 250kW DC", "Solar Canopy", "Lounge", "Automated Boom Barrier", "CCTV"]
  },
  {
    _id: "loc_04",
    id: "loc_04",
    name: "Indiranagar 100 Feet Road Automated Bays",
    city: "Bengaluru",
    address: "100 Feet Rd, HAL 2nd Stage, Indiranagar",
    totalSlots: 60,
    availableSlots: 12,
    evSlotsTotal: 15,
    evSlotsAvailable: 3,
    hasFastCharger: true,
    maxPowerKw: 60,
    hourlyRate: 70,
    rating: 4.7,
    reviewsCount: 290,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    amenities: ["ANPR License Plate Camera", "Mobile Payment", "EV Charging", "Lighting Sensors"]
  }
];

const generateFallbackSlots = (locationId, floor = "Ground") => {
  const prefix = floor === "Basement 1" ? "B1" : floor === "Level 1" ? "L1" : "G";
  const slots = [];

  for (let i = 1; i <= 16; i++) {
    const isEV = i <= 6;
    const slotNumber = `${prefix}-${isEV ? "EV" : "PK"}-${i < 10 ? "0" + i : i}`;
    let status = "available";
    if (i === 2 || i === 7 || i === 11) status = "occupied";
    if (i === 4 || i === 14) status = "reserved";

    slots.push({
      _id: `${locationId}_${slotNumber}`,
      id: `${locationId}_${slotNumber}`,
      slotNumber,
      floor,
      type: isEV ? (i <= 2 ? "ev-ultra" : "ev-fast") : "standard",
      status,
      powerKw: isEV ? (i <= 2 ? 150 : 60) : 0,
      pricePerHour: isEV ? (i <= 2 ? 120 : 80) : 40,
      connectorType: isEV ? (i <= 2 ? "CCS-2 Dual Gun" : "Type 2 AC") : "None"
    });
  }

  return slots;
};

class ParkingService {
  /**
   * Search parking locations with filters
   */
  async searchLocations(query = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const filter = {};

        if (query.city && query.city !== "All Cities") {
          filter.city = query.city;
        }

        if (query.search) {
          filter.$or = [
            { name: { $regex: query.search, $options: "i" } },
            { address: { $regex: query.search, $options: "i" } }
          ];
        }

        if (query.evOnly === "true" || query.evOnly === true) {
          filter.evSlotsAvailable = { $gt: 0 };
        }

        if (query.fastChargeOnly === "true" || query.fastChargeOnly === true) {
          filter.hasFastCharger = true;
          filter.maxPowerKw = { $gte: 100 };
        }

        if (query.maxPrice) {
          filter.hourlyRate = { $lte: Number(query.maxPrice) };
        }

        const dbResults = await ParkingLocation.find(filter).sort({ rating: -1 });
        if (dbResults && dbResults.length > 0) {
          return dbResults;
        }
      } catch (err) {
        // Fall back to memory
      }
    }

    // In-Memory Fast Path
    let results = [...FALLBACK_LOCATIONS];

    if (query.search) {
      const q = query.search.toLowerCase();
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q)
      );
    }

    if (query.city && query.city !== "All Cities") {
      results = results.filter((l) => l.city === query.city);
    }

    if (query.evOnly === "true" || query.evOnly === true) {
      results = results.filter((l) => l.evSlotsAvailable > 0);
    }

    if (query.fastChargeOnly === "true" || query.fastChargeOnly === true) {
      results = results.filter((l) => l.hasFastCharger && l.maxPowerKw >= 100);
    }

    if (query.maxPrice) {
      results = results.filter((l) => l.hourlyRate <= Number(query.maxPrice));
    }

    return results;
  }

  /**
   * Get location details by ID
   */
  async getLocationById(id) {
    if (mongoose.connection.readyState === 1) {
      try {
        const loc = await ParkingLocation.findById(id);
        if (loc) return loc;
      } catch (err) {}
    }
    return FALLBACK_LOCATIONS.find((l) => l.id === id || l._id === id) || FALLBACK_LOCATIONS[0];
  }

  /**
   * Get all slots for a facility, optionally filtered by floor
   */
  async getLocationSlots(locationId, floor = "Ground") {
    if (mongoose.connection.readyState === 1) {
      try {
        const filter = { location: locationId };
        if (floor) filter.floor = floor;
        const slots = await ParkingSlot.find(filter).sort({ slotNumber: 1 });
        if (slots && slots.length > 0) return slots;
      } catch (err) {}
    }
    return generateFallbackSlots(locationId, floor);
  }

  /**
   * Update slot status (e.g. from IoT sensor or Admin)
   */
  async updateSlotStatus(slotId, status) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await ParkingSlot.findByIdAndUpdate(
          slotId,
          { status },
          { new: true, runValidators: true }
        );
      } catch (err) {}
    }
    return { id: slotId, status, updatedAt: new Date().toISOString() };
  }
}

module.exports = new ParkingService();
