/**
 * Booking, Wallet & Favorites Context for ParkVolt
 * Features:
 * - Real-time simulated availability ticker with smooth number animations
 * - Double-booking collision prevention across overlapping time intervals
 * - Seed default bookings, top-ups and wallet transactions
 * - Toast notification banner queue
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import initialLocations from "../data/parkingLocations.json";
import initialEvStations from "../data/evStations.json";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // 1. Locations state (availability simulated every 4 seconds)
  const [locations, setLocations] = useState(initialLocations);
  const [evStations, setEvStations] = useState(initialEvStations);
  const [simTick, setSimTick] = useState(0);

  // 2. Simulated real-time availability changes
  useEffect(() => {
    const timer = setInterval(() => {
      setSimTick((t) => t + 1);
      setLocations((prev) =>
        prev.map((loc) => {
          // Gently jitter available slots by -1, 0, or +1 within bounds
          const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.4 ? 1 : 0);
          const next = Math.max(2, Math.min(loc.totalSlots - 5, loc.baseAvailableSlots + delta));
          return { ...loc, baseAvailableSlots: next };
        })
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // 3. User bookings stored in localStorage
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("parkvolt_bookings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    // Default seeded sample booking for demonstration
    const now = new Date();
    const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    return [
      {
        id: "PV-10842",
        locationId: "loc-1",
        locationName: "DLF CyberHub Multi-Storey",
        locationAddress: "Sector 24, Cyber City, Gurugram",
        slotId: "S-1",
        slotCode: "G-EV-01",
        isEvSlot: true,
        evSpeed: "120 kW CCS2",
        startTime: now.toISOString(),
        endTime: end.toISOString(),
        durationMinutes: 120,
        subtotal: 120,
        tax: 21.6,
        totalAmount: 141.6,
        paymentMethod: "UPI (Google Pay)",
        vehicleNumber: "DL 01 EV 9876",
        status: "active", // 'active', 'upcoming', 'completed', 'cancelled'
        createdAt: now.toISOString(),
        qrCodeValue: "PARKVOLT-BOOKING-PV-10842-VALID"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("parkvolt_bookings", JSON.stringify(bookings));
  }, [bookings]);

  // 4. Wallet transaction history stored in localStorage
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("parkvolt_transactions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "TX-901",
        type: "credit",
        title: "Wallet Welcome Top-up",
        amount: 1500,
        date: new Date(Date.now() - 86400000).toISOString(),
        method: "UPI Deposit"
      },
      {
        id: "TX-902",
        type: "debit",
        title: "Booking: DLF CyberHub G-EV-01",
        amount: 141.6,
        date: new Date().toISOString(),
        bookingId: "PV-10842"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("parkvolt_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // 5. Favorites saved in localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("parkvolt_favorites");
    return saved ? JSON.parse(saved) : ["loc-1", "loc-3"];
  });

  useEffect(() => {
    localStorage.setItem("parkvolt_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (locId) => {
    setFavorites((prev) =>
      prev.includes(locId) ? prev.filter((id) => id !== locId) : [...prev, locId]
    );
  };

  // 6. Toast Notification Queue
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "Active Booking",
      message: "Slot G-EV-01 at DLF CyberHub is active. Auto-locks in place.",
      type: "info",
      time: "Just now"
    }
  ]);

  const addNotification = (title, message, type = "success") => {
    const newNote = {
      id: `note-${Date.now()}`,
      title,
      message,
      type,
      time: "Just now"
    };
    setNotifications((prev) => [newNote, ...prev]);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNote.id));
    }, 6000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /**
   * Double-Booking Prevention Check (BTech Viva Essential)
   * Before confirming, checks all existing non-cancelled bookings for the exact same location + slot
   * and verifies whether the requested time window overlaps with an already booked window.
   */
  const checkDoubleBooking = (locationId, slotCode, requestedStart, requestedEnd) => {
    const startMs = new Date(requestedStart).getTime();
    const endMs = new Date(requestedEnd).getTime();

    // Find any conflicting booking
    const conflict = bookings.find((b) => {
      if (b.status === "cancelled") return false;
      if (b.locationId !== locationId || b.slotCode !== slotCode) return false;

      const existingStartMs = new Date(b.startTime).getTime();
      const existingEndMs = new Date(b.endTime).getTime();

      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      const hasOverlap = startMs < existingEndMs && endMs > existingStartMs;
      return hasOverlap;
    });

    return Boolean(conflict);
  };

  /**
   * Create Booking Handler
   */
  const createBooking = ({
    location,
    slot,
    startTime,
    durationMinutes,
    pricing,
    paymentMethod,
    vehicleNumber
  }) => {
    const startObj = new Date(startTime);
    const endObj = new Date(startObj.getTime() + durationMinutes * 60 * 1000);

    // Double-booking check guard
    const isConflict = checkDoubleBooking(location.id, slot.code, startObj, endObj);
    if (isConflict) {
      throw new Error(
        `Slot ${slot.code} was just booked by another driver for this time window. Please select another slot.`
      );
    }

    const bookingId = `PV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      id: bookingId,
      locationId: location.id,
      locationName: location.name,
      locationAddress: location.address,
      slotId: slot.id,
      slotCode: slot.code,
      isEvSlot: slot.isEv,
      evSpeed: slot.evSpeed || "Standard",
      startTime: startObj.toISOString(),
      endTime: endObj.toISOString(),
      durationMinutes,
      subtotal: pricing.subtotal,
      tax: pricing.tax,
      totalAmount: pricing.total,
      paymentMethod,
      vehicleNumber,
      status: "active",
      createdAt: new Date().toISOString(),
      qrCodeValue: `PARKVOLT-TICKET-${bookingId}-${slot.code}`
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Record wallet transaction if paid via wallet
    if (paymentMethod.includes("Wallet")) {
      const tx = {
        id: `TX-${Date.now()}`,
        type: "debit",
        title: `Booking: ${location.name} (${slot.code})`,
        amount: pricing.total,
        date: new Date().toISOString(),
        bookingId
      };
      setTransactions((prev) => [tx, ...prev]);
    }

    addNotification("Booking Confirmed!", `Reserved ${slot.code} at ${location.name}.`, "success");
    return newBooking;
  };

  /**
   * Cancel booking with automatic simulated refund
   */
  const cancelBooking = (bookingId, refundAmount, refundToWalletCallback) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
    );

    if (refundAmount > 0) {
      const refundTx = {
        id: `TX-REFUND-${Date.now()}`,
        type: "credit",
        title: `Refund for Cancelled Booking ${bookingId}`,
        amount: refundAmount,
        date: new Date().toISOString(),
        bookingId
      };
      setTransactions((prev) => [refundTx, ...prev]);

      if (refundToWalletCallback) {
        refundToWalletCallback(refundAmount);
      }
    }

    addNotification("Booking Cancelled", `Refund of ₹${refundAmount} processed to your wallet.`, "info");
  };

  /**
   * Extend booking by 30 minutes
   */
  const extendBooking = (bookingId, additionalCost = 30) => {
    let extended = null;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const currentEnd = new Date(b.endTime);
          const newEnd = new Date(currentEnd.getTime() + 30 * 60 * 1000);
          extended = {
            ...b,
            endTime: newEnd.toISOString(),
            durationMinutes: b.durationMinutes + 30,
            totalAmount: b.totalAmount + additionalCost
          };
          return extended;
        }
        return b;
      })
    );

    const extTx = {
      id: `TX-EXT-${Date.now()}`,
      type: "debit",
      title: `30-Min Extension for ${bookingId}`,
      amount: additionalCost,
      date: new Date().toISOString(),
      bookingId
    };
    setTransactions((prev) => [extTx, ...prev]);

    addNotification("Booking Extended", `Added 30 minutes to ticket ${bookingId}.`, "success");
    return extended;
  };

  /**
   * Top-up user wallet balance
   */
  const topUpWallet = (amount, paymentSource, updateBalanceCallback) => {
    const tx = {
      id: `TX-TOPUP-${Date.now()}`,
      type: "credit",
      title: `Wallet Deposit via ${paymentSource}`,
      amount: Number(amount),
      date: new Date().toISOString()
    };
    setTransactions((prev) => [tx, ...prev]);

    if (updateBalanceCallback) {
      updateBalanceCallback(Number(amount));
    }

    addNotification("Wallet Top-Up Successful", `Added ₹${amount} to your ParkVolt balance.`, "success");
  };

  return (
    <BookingContext.Provider
      value={{
        locations,
        evStations,
        simTick,
        bookings,
        transactions,
        favorites,
        toggleFavorite,
        notifications,
        addNotification,
        removeNotification,
        checkDoubleBooking,
        createBooking,
        cancelBooking,
        extendBooking,
        topUpWallet
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
