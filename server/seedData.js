const mongoose = require("mongoose");
const env = require("./config/environment");
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
const ParkingLocation = require("./models/ParkingLocation");
const ParkingSlot = require("./models/ParkingSlot");

const seedDatabase = async () => {
  try {
    console.log("[Seeder] Connecting to MongoDB...");
    await mongoose.connect(env.MONGO_URI);
    console.log("[Seeder] Connected successfully. Flushing old data...");

    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await ParkingLocation.deleteMany({});
    await ParkingSlot.deleteMany({});

    // 1. Create Demo Users
    const demoUser = await User.create({
      name: "Alex Rivera",
      email: "alex.rivera@parkvolt.io",
      password: "password123",
      phone: "+91 98765 43210",
      role: "user",
      walletBalance: 1500
    });

    const adminUser = await User.create({
      name: "Admin Operator",
      email: "admin@parkvolt.io",
      password: "adminpassword123",
      phone: "+91 99999 11111",
      role: "admin",
      walletBalance: 10000
    });

    console.log("[Seeder] Created Users (Alex Rivera & Admin Operator)");

    // 2. Create Registered Vehicle
    await Vehicle.create({
      user: demoUser._id,
      licensePlate: "DL 01 EV 9876",
      makeModel: "Tata Nexon EV Max",
      isEV: true,
      batteryCapacityKwh: 40.5,
      connectorType: "CCS-2"
    });

    // 3. Create Parking Locations
    const locationsData = [
      {
        name: "Cyber City EV Hub & Multi-Level Parking",
        city: "Gurugram",
        address: "DLF Cyber City, Sector 24, Rapid Metro Pillar 42",
        location: { type: "Point", coordinates: [77.0894, 28.4986] },
        totalSlots: 120,
        availableSlots: 46,
        evSlotsTotal: 30,
        evSlotsAvailable: 14,
        hasFastCharger: true,
        maxPowerKw: 150,
        hourlyRate: 80,
        rating: 4.9,
        reviewsCount: 384,
        image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a",
        amenities: ["24/7 Security", "CCTV", "Valet Service", "Cafe", "Car Wash"]
      },
      {
        name: "Connaught Place Radial Smart Bay",
        city: "New Delhi",
        address: "Inner Circle, Block C, Near Rajiv Chowk Gate 4",
        location: { type: "Point", coordinates: [77.2167, 28.6315] },
        totalSlots: 85,
        availableSlots: 18,
        evSlotsTotal: 20,
        evSlotsAvailable: 5,
        hasFastCharger: true,
        maxPowerKw: 120,
        hourlyRate: 100,
        rating: 4.8,
        reviewsCount: 512,
        image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe",
        amenities: ["Covered Parking", "Security", "EV Fast Charging"]
      },
      {
        name: "Bandra Kurla Complex (BKC) EV Supergrid",
        city: "Mumbai",
        address: "G Block, Near Diamond Bourse, Bandra East",
        location: { type: "Point", coordinates: [72.8687, 19.0657] },
        totalSlots: 150,
        availableSlots: 62,
        evSlotsTotal: 50,
        evSlotsAvailable: 24,
        hasFastCharger: true,
        maxPowerKw: 250,
        hourlyRate: 120,
        rating: 4.9,
        reviewsCount: 620,
        image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98",
        amenities: ["Ultra-Fast 250kW DC", "Solar Canopy", "Lounge", "Automated Barrier"]
      }
    ];

    for (const loc of locationsData) {
      const createdLoc = await ParkingLocation.create(loc);

      // Create Slots for this location
      const floors = ["Basement 1", "Ground", "Level 1"];
      for (const floor of floors) {
        const prefix = floor === "Basement 1" ? "B1" : floor === "Level 1" ? "L1" : "G";
        for (let i = 1; i <= 8; i++) {
          const isEV = i <= 4;
          await ParkingSlot.create({
            location: createdLoc._id,
            slotNumber: `${prefix}-${isEV ? "EV" : "PK"}-${i < 10 ? "0" + i : i}`,
            floor,
            type: isEV ? (i <= 2 ? "ev-ultra" : "ev-fast") : "standard",
            status: i === 2 ? "occupied" : i === 4 ? "reserved" : "available",
            powerKw: isEV ? (i <= 2 ? createdLoc.maxPowerKw : 60) : 0,
            pricePerHour: isEV ? createdLoc.hourlyRate + 40 : createdLoc.hourlyRate,
            connectorType: isEV ? "CCS-2 Dual Gun" : "None"
          });
        }
      }
    }

    console.log("[Seeder] Successfully seeded Locations and Multi-Floor Slots!");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder Error]", error.message);
    process.exit(1);
  }
};

seedDatabase();
