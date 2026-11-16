/**
 * ParkVolt API Service Layer
 * Connects frontend state and UI with backend Express REST APIs.
 * Supports transparent fallback to simulated IoT nodes for offline demonstration.
 */

const API_BASE_URL = "http://localhost:5001/api";

// Initial Seed Locations used across Explore and Search
export const MOCK_PARKING_LOCATIONS = [
  {
    id: "loc_01",
    name: "Cyber City EV Hub & Multi-Level Parking",
    city: "Gurugram",
    address: "DLF Cyber City, Sector 24, Rapid Metro Pillar 42",
    coordinates: { lat: 28.4986, lng: 77.0894 },
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
    id: "loc_02",
    name: "Connaught Place Radial Smart Bay",
    city: "New Delhi",
    address: "Inner Circle, Block C, Near Rajiv Chowk Gate 4",
    coordinates: { lat: 28.6315, lng: 77.2167 },
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
    id: "loc_03",
    name: "Bandra Kurla Complex (BKC) EV Supergrid",
    city: "Mumbai",
    address: "G Block, Near Diamond Bourse, Bandra East",
    coordinates: { lat: 19.0657, lng: 72.8687 },
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
    id: "loc_04",
    name: "Indiranagar 100 Feet Road Automated Bays",
    city: "Bengaluru",
    address: "100 Feet Rd, HAL 2nd Stage, Indiranagar",
    coordinates: { lat: 12.9716, lng: 77.6412 },
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

// Mock Multi-Floor Slots Generator
export const generateMockSlots = (locationId, floor = "Ground") => {
  const prefix = floor === "Basement 1" ? "B1" : floor === "Level 1" ? "L1" : "G";
  const slots = [];

  for (let i = 1; i <= 16; i++) {
    const isEV = i <= 6;
    const slotNumber = `${prefix}-${isEV ? "EV" : "PK"}-${i < 10 ? "0" + i : i}`;
    let status = "available";
    if (i === 2 || i === 7 || i === 11) status = "occupied";
    if (i === 4 || i === 14) status = "reserved";

    slots.push({
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

export const api = {
  // 1. Fetch Parking Locations with filtering
  getParkingLocations: async (filters = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking?${new URLSearchParams(filters)}`);
      if (response.ok) {
        const data = await response.json();
        return data.locations || data;
      }
    } catch (err) {
      // Fallback to local mock data if backend server is starting up
    }

    let results = [...MOCK_PARKING_LOCATIONS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q)
      );
    }

    if (filters.city && filters.city !== "All Cities") {
      results = results.filter((l) => l.city === filters.city);
    }

    if (filters.evOnly) {
      results = results.filter((l) => l.evSlotsAvailable > 0);
    }

    if (filters.fastChargeOnly) {
      results = results.filter((l) => l.hasFastCharger && l.maxPowerKw >= 100);
    }

    if (filters.maxPrice) {
      results = results.filter((l) => l.hourlyRate <= filters.maxPrice);
    }

    return results;
  },

  // 2. Fetch specific location details
  getLocationById: async (id) => {
    return MOCK_PARKING_LOCATIONS.find((l) => l.id === id) || MOCK_PARKING_LOCATIONS[0];
  },

  // 3. Fetch slot layout for a location and floor
  getLocationSlots: async (locationId, floor = "Ground") => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking/${locationId}/slots?floor=${floor}`);
      if (response.ok) {
        const data = await response.json();
        return data.slots;
      }
    } catch (err) {
      // Return procedural floor slots
    }
    return generateMockSlots(locationId, floor);
  },

  // 4. Create Booking
  createBooking: async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      // Mock successful response
    }

    return {
      success: true,
      booking: {
        bookingId: `PV-${Math.floor(10000 + Math.random() * 90000)}`,
        status: "confirmed",
        ...bookingData,
        createdAt: new Date().toISOString()
      }
    };
  }
};
