import { create } from "zustand";

/**
 * Global Zustand Store for ParkVolt
 * Manages locations, search filters, selected location, active bookings,
 * EV charging sessions, and real-time slot state.
 */
export const useParkVoltStore = create((set, get) => ({
  // Active Navigation Tab: 'hero' | 'explore' | 'location-detail' | 'charging' | 'admin' | 'design-system'
  activeTab: "hero",
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Search & Filter State
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCity: "All Cities",
  setSelectedCity: (city) => set({ selectedCity: city }),
  filterEVOnly: false,
  setFilterEVOnly: (val) => set({ filterEVOnly: val }),
  filterFastChargeOnly: false,
  setFilterFastChargeOnly: (val) => set({ filterFastChargeOnly: val }),
  maxPricePerHour: 200,
  setMaxPricePerHour: (price) => set({ maxPricePerHour: price }),

  // Selected Parking Hub for Deep Inspection / Slot Grid
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),

  // Selected Slot inside a Hub
  selectedSlot: null,
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  // Active Floor inside Location Detail
  selectedFloor: "Ground",
  setSelectedFloor: (floor) => set({ selectedFloor: floor }),

  // User Authentication State
  user: {
    id: "usr_demo123",
    name: "Alex Rivera",
    email: "alex.rivera@parkvolt.io",
    vehicleNumber: "DL 01 EV 9876",
    vehicleModel: "Tata Nexon EV Max",
    role: "user",
    walletBalance: 1450
  },
  isAuthenticated: true,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),

  // Active Bookings
  userBookings: [
    {
      bookingId: "PV-78901",
      locationName: "Cyber City EV Hub & Parking",
      slotNumber: "EV-01",
      startTime: new Date().toISOString(),
      durationMinutes: 120,
      totalAmount: 240,
      status: "confirmed",
      chargerType: "150 kW CCS2 DC Fast"
    }
  ],
  addBooking: (booking) =>
    set((state) => ({ userBookings: [booking, ...state.userBookings] })),

  // Active EV Charging Telemetry Session
  activeChargingSession: {
    sessionId: "CS-9942",
    slotNumber: "EV-01",
    locationName: "Cyber City EV Hub",
    batteryPercentage: 42,
    chargingPowerKw: 142.5,
    energyDeliveredKwh: 18.6,
    elapsedSeconds: 840,
    estimatedMinutesRemaining: 18,
    costSoFar: 223.2,
    status: "charging" // 'charging' | 'paused' | 'completed'
  },
  updateChargingTelemetry: (updates) =>
    set((state) => ({
      activeChargingSession: state.activeChargingSession
        ? { ...state.activeChargingSession, ...updates }
        : null
    })),
  stopChargingSession: () =>
    set((state) => ({
      activeChargingSession: state.activeChargingSession
        ? { ...state.activeChargingSession, status: "completed" }
        : null
    })),

  // Live Slots cache for instantaneous UI reactive updates
  locationSlots: {},
  setLocationSlots: (locationId, slots) =>
    set((state) => ({
      locationSlots: { ...state.locationSlots, [locationId]: slots }
    })),
  updateSingleSlotStatus: (locationId, slotId, newStatus) =>
    set((state) => {
      const currentSlots = state.locationSlots[locationId] || [];
      const updated = currentSlots.map((s) =>
        s.id === slotId || s.slotNumber === slotId ? { ...s, status: newStatus } : s
      );
      return {
        locationSlots: { ...state.locationSlots, [locationId]: updated }
      };
    })
}));
