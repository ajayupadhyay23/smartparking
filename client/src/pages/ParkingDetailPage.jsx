/**
 * ParkingDetailPage.jsx (Page 3)
 *
 * Requirements:
 * - Photo Gallery
 * - Facility details, opening hours, amenities
 * - 3D Slot Picker (green = free, red = taken, blue = selected)
 * - Start time picker & duration picker (30 min to 24 h)
 * - Real-time cost estimate with 18% GST calculation
 * - "Reserve Slot" CTA button navigating to Checkout
 * - External Google Maps directions link with real lat/lng
 */
import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  Zap,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Car
} from "lucide-react";
import FloatingCityScene from "../components/3d/FloatingCityScene";
import { useBooking } from "../context/BookingContext";

export default function ParkingDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { locations } = useBooking();

  // Find location by URL parameter ID (defaults to first if not found)
  const location = locations.find((l) => l.id === id) || locations[0];

  // Selected slot state (seeded from query param e.g. ?slot=G-EV-01 if provided)
  const initialSlotCode = searchParams.get("slot") || "G-EV-01";
  const [selectedSlot, setSelectedSlot] = useState({
    id: initialSlotCode.includes("01") ? "S-1" : "S-3",
    code: initialSlotCode,
    isEv: initialSlotCode.includes("EV"),
    evSpeed: "120 kW CCS2",
    status: "free",
    price: location.pricePerHour
  });

  // Start time (defaults to next rounded 15 mins)
  const [startTime, setStartTime] = useState(() => {
    const d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
    d.setSeconds(0);
    // Format YYYY-MM-DDTHH:MM for input
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  });

  // Duration in minutes (options from 30 min to 24 h / 1440 min)
  const [durationMinutes, setDurationMinutes] = useState(120);

  // Pricing calculations
  const durationHours = durationMinutes / 60;
  const hourlyRate = location.pricePerHour * (location.isPeakNow ? location.peakMultiplier : 1.0);
  const subtotal = Math.round(hourlyRate * durationHours);
  const tax = Number((subtotal * 0.18).toFixed(2)); // 18% GST
  const totalAmount = Math.round(subtotal + tax);

  // Google Maps navigation URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleProceedToCheckout = () => {
    // Stash checkout payload into sessionStorage for the checkout screen
    const checkoutData = {
      locationId: location.id,
      locationName: location.name,
      locationAddress: location.address,
      slot: selectedSlot,
      startTime,
      durationMinutes,
      pricing: {
        ratePerHour: Math.round(hourlyRate),
        subtotal,
        tax,
        total: totalAmount
      }
    };
    sessionStorage.setItem("parkvolt_pending_checkout", JSON.stringify(checkoutData));
    navigate("/checkout");
  };

  return (
    <div className="container" style={{ paddingTop: "32px", paddingBottom: "70px" }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
        <Link to="/find-parking" style={{ color: "var(--color-primary)" }}>Find Parking</Link>
        <span>/</span>
        <span>{location.city}</span>
        <span>/</span>
        <span style={{ color: "var(--text-main)", fontWeight: "600" }}>{location.name}</span>
      </div>

      {/* Main Layout Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "36px",
          alignItems: "flex-start"
        }}
        className="detail-grid"
      >
        {/* Left Column: Photos, 3D Slot Picker & Facility Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Header Title with Directions Button */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span className="badge badge-blue">{location.type}</span>
                <span className="badge badge-green">
                  <CheckCircle2 size={13} /> {location.baseAvailableSlots} Bays Open
                </span>
                {location.isPeakNow && (
                  <span className="badge badge-amber">🔥 Peak Demand</span>
                )}
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>
                {location.name}
              </h1>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                <MapPin size={16} color="var(--color-primary)" /> {location.address}
              </p>
            </div>

            {/* External Google Maps Link */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              title="Open turn-by-turn directions in Google Maps"
            >
              <Navigation size={16} /> Open in Google Maps
            </a>
          </div>

          {/* Photo Showcase */}
          <div
            style={{
              height: "300px",
              width: "100%",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
              position: "relative"
            }}
          >
            <img
              src={location.image}
              alt={location.altText}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                color: "#FFF",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "13px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(8px)"
              }}
            >
              <Star size={14} fill="#F59E0B" color="#F59E0B" />
              <span>{location.rating}</span>
              <span style={{ opacity: 0.7 }}>({location.reviewsCount} customer reviews)</span>
            </div>
          </div>

          {/* =========================================================================
              3D SLOT PICKER VIEWPORT
          ========================================================================= */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span className="badge badge-blue">Interactive 3D Bay Matrix</span>
                <h2 style={{ fontSize: "20px", fontWeight: "800", marginTop: "4px" }}>
                  Pick Your Exact Parking Slot
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Click any green bay to assign your ticket. Orbit and zoom with mouse.
                </p>
              </div>

              {selectedSlot && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Active Selection</div>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
                    {selectedSlot.code}
                  </div>
                </div>
              )}
            </div>

            {/* 3D Canvas Box */}
            <div
              style={{
                height: "440px",
                width: "100%",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid var(--border-subtle)",
                position: "relative",
                background: "var(--bg-surface)"
              }}
            >
              <FloatingCityScene
                selectedSlotId={selectedSlot ? selectedSlot.id : null}
                onSelectSlot={handleSlotClick}
                height="100%"
              />
            </div>

            {/* Bay Legend */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "18px",
                marginTop: "16px",
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)"
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#12B76A" }} />
                Green = Free to Reserve
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#EF4444" }} />
                Red = Currently Occupied
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#2F6BFF" }} />
                Blue = Selected by You
              </span>
            </div>
          </div>

          {/* Description & Amenities */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "12px" }}>About this facility</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.7" }}>
              {location.description}
            </p>

            <h4 style={{ fontSize: "15px", fontWeight: "700", marginTop: "24px", marginBottom: "12px" }}>
              Available Amenities
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {location.amenities.map((amenity, idx) => (
                <span key={idx} className="badge badge-subtle" style={{ padding: "6px 12px", fontSize: "12px" }}>
                  <ShieldCheck size={14} color="var(--color-primary)" /> {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Reservation & Pricing Calculator */}
        <div style={{ position: "sticky", top: "96px" }}>
          <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <span className="badge badge-blue">Booking Summary</span>
              <h3 style={{ fontSize: "22px", fontWeight: "800", marginTop: "6px" }}>
                Reserve Parking
              </h3>
            </div>

            {/* Selected Slot Indicator */}
            <div
              style={{
                padding: "14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-subtle)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Bay Assigned</div>
                <div style={{ fontSize: "17px", fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
                  {selectedSlot.code}
                </div>
              </div>
              <span className="badge badge-green">Lock Ready</span>
            </div>

            {/* Start Time Selector */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                <Clock size={14} /> Start Time
              </label>
              <input
                type="datetime-local"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            {/* Duration Selector (30 min to 24 h) */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Reservation Duration</label>
              <select
                className="form-input"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              >
                <option value={30}>30 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={120}>2 Hours (Standard)</option>
                <option value={180}>3 Hours</option>
                <option value={240}>4 Hours</option>
                <option value={360}>6 Hours</option>
                <option value={480}>8 Hours (Full Working Day)</option>
                <option value={720}>12 Hours</option>
                <option value={1440}>24 Hours (Full Day)</option>
              </select>
            </div>

            {/* Cost Breakdown with GST */}
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "13px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Rate ({durationHours}h × ₹{Math.round(hourlyRate)}/h):</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600" }}>₹{subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Goods & Services Tax (18% GST):</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600" }}>₹{tax}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  fontWeight: "800",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border-subtle)"
                }}
              >
                <span>Total Payable:</span>
                <span style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>₹{totalAmount}</span>
              </div>
            </div>

            {/* Reserve CTA Button */}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Proceed to Reserve <ArrowRight size={18} />
            </button>

            <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
              ✓ Free cancellation up to 15 minutes before booking start time.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .detail-grid {
            grid-template-columns: 1fr 380px !important;
          }
        }
      `}</style>
    </div>
  );
}
