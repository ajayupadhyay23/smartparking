import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  Zap,
  Car,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Info,
  CreditCard,
  Navigation
} from "lucide-react";
import { useParkVoltStore } from "../store/useParkVoltStore";
import { api } from "../services/api";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { SlotIndicator } from "../components/ui/SlotIndicator";
import { Card, CardContent } from "../components/ui/Card";

export const LocationDetailView = ({ location, onBack, onOpenBookingModal }) => {
  const { selectedFloor, setSelectedFloor, user } = useParkVoltStore();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(2); // hours
  const [filterType, setFilterType] = useState("all"); // 'all' | 'ev' | 'available'

  // Fetch slot layout for current location and floor
  useEffect(() => {
    let isMounted = true;
    api.getLocationSlots(location.id, selectedFloor).then((data) => {
      if (isMounted) {
        setSlots(data);
        // Default select the first available EV slot
        const firstAvail = data.find((s) => s.status === "available");
        if (firstAvail) setSelectedSlot(firstAvail);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [location.id, selectedFloor]);

  // Filter slots
  const filteredSlots = slots.filter((s) => {
    if (filterType === "ev") return s.type.startsWith("ev");
    if (filterType === "available") return s.status === "available";
    return true;
  });

  // Calculate pricing breakdown
  const ratePerHour = selectedSlot ? selectedSlot.pricePerHour : location.hourlyRate;
  const subtotal = ratePerHour * selectedDuration;
  const serviceFee = 15;
  const totalAmount = subtotal + serviceFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
        >
          Back to Hubs
        </Button>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE HARDWARE SENSORS SYNCED</span>
        </div>
      </div>

      {/* Location Banner Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-slate-900/80 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Location Details */}
          <div className="lg:col-span-8 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald" size="sm">
                {location.city}
              </Badge>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 text-xs font-bold border border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{location.rating}</span>
                <span className="text-slate-400 font-normal">({location.reviewsCount} reviews)</span>
              </div>
              <Badge variant="cyan" size="sm">
                ⚡ Max {location.maxPowerKw} kW DC Supercharger
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {location.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{location.address}</span>
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{location.availableSlots} of {location.totalSlots} Bays Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>{location.evSlotsAvailable} of {location.evSlotsTotal} EV Chargers Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ANPR Automatic License Plate Entry</span>
              </div>
            </div>
          </div>

          {/* Quick Photo Thumbnail */}
          <div className="lg:col-span-4 relative h-48 lg:h-auto min-h-[200px]">
            <img
              src={location.image}
              alt={location.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Slot Grid + Reservation Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MULTI-FLOOR SELECTOR & VISUAL SLOT MATRIX */}
        <div className="lg:col-span-8 space-y-6">
          {/* Floor & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08]">
            {/* Floor Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
              {["Basement 1", "Ground", "Level 1"].map((floor) => (
                <button
                  key={floor}
                  type="button"
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedFloor === floor
                      ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>

            {/* Slot Type Filter Tabs */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded-lg border ${
                  filterType === "all"
                    ? "bg-slate-800 border-emerald-500/50 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                All ({slots.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("available")}
                className={`px-2.5 py-1 rounded-lg border ${
                  filterType === "available"
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Available ({slots.filter((s) => s.status === "available").length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("ev")}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                  filterType === "ev"
                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Zap className="w-3 h-3" /> EV Only ({slots.filter((s) => s.type.startsWith("ev")).length})
              </button>
            </div>
          </div>

          {/* Visual Parking & EV Slot Matrix Grid */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white uppercase font-mono">
                  Floor Layout: {selectedFloor}
                </span>
              </div>
              <span className="text-slate-400">Click any green bay to select</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredSlots.map((slot) => (
                <SlotIndicator
                  key={slot.id}
                  slotNumber={slot.slotNumber}
                  status={slot.status}
                  isEV={slot.type.startsWith("ev")}
                  powerKw={slot.powerKw}
                  pricePerHour={slot.pricePerHour}
                  isSelected={selectedSlot?.id === slot.id}
                  onClick={() => setSelectedSlot(slot)}
                />
              ))}
            </div>

            {/* Bay Status Legend */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Reserved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>EV Fast Charger</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY RESERVATION SUMMARY DRAWER */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <Card glow className="p-6 space-y-5">
            <div className="border-b border-white/[0.08] pb-4">
              <h3 className="font-bold text-lg text-white">Booking Summary</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant reservation with IoT slot hold lock
              </p>
            </div>

            {selectedSlot ? (
              <div className="space-y-4 text-xs">
                {/* Selected Slot Information */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Selected Bay:</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {selectedSlot.slotNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Floor Level:</span>
                    <span className="font-medium text-slate-200">{selectedSlot.floor}</span>
                  </div>
                  {selectedSlot.powerKw > 0 && (
                    <div className="flex justify-between items-center text-cyan-400">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Charger Power:
                      </span>
                      <span className="font-mono font-bold">{selectedSlot.powerKw} kW CCS-2</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tariff:</span>
                    <span className="font-mono font-bold text-white">
                      ₹{selectedSlot.pricePerHour}/hr
                    </span>
                  </div>
                </div>

                {/* Duration Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                    Reservation Duration
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 4, 8].map((hours) => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => setSelectedDuration(hours)}
                        className={`py-2 rounded-lg font-mono font-bold transition-all ${
                          selectedDuration === hours
                            ? "bg-emerald-500 text-slate-950 shadow-md"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {hours}h
                      </button>
                    ))}
                  </div>
                </div>

                {/* User Vehicle Information */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Registered Vehicle:</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {user.vehicleNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">{user.vehicleModel}</div>
                </div>

                {/* Price Breakdown Calculation */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Slot Rate ({selectedDuration} hrs × ₹{ratePerHour}):</span>
                    <span className="font-mono text-white">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>IoT Gateway & Convenience:</span>
                    <span className="font-mono text-white">₹{serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                    <span>Total Payable:</span>
                    <span className="font-mono text-emerald-400 text-lg">₹{totalAmount}</span>
                  </div>
                </div>

                {/* CTA Reservation Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center text-sm font-bold shadow-glow-emerald"
                  icon={<CreditCard className="w-4 h-4" />}
                  onClick={() =>
                    onOpenBookingModal({
                      location,
                      slot: selectedSlot,
                      duration: selectedDuration,
                      totalAmount
                    })
                  }
                >
                  Confirm & Reserve Bay
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Info className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs">Please click an available green bay on the grid to reserve.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
