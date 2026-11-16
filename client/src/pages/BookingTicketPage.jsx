/**
 * BookingTicketPage.jsx (Page 6)
 *
 * Requirements:
 * - Dynamic QR code via qrcode.react
 * - Booking ID, assigned slot, vehicle registration
 * - Live countdown timer to reservation end
 * - "Extend by 30 minutes" action (+₹30 with simulated receipt)
 * - "Cancel with refund" action (with automatic refund to ParkVolt Wallet)
 * - Turn-by-turn navigation link
 */
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Navigation,
  ArrowLeft,
  XCircle,
  ShieldCheck,
  Zap,
  Car
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";

export default function BookingTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, extendBooking, cancelBooking } = useBooking();
  const { updateWalletBalance, currentUser } = useAuth();

  const booking = bookings.find((b) => b.id === id) || bookings[0];

  // Live countdown timer state (hours, minutes, seconds remaining)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!booking || booking.status === "cancelled") return;

    const calculateTime = () => {
      const now = Date.now();
      const end = new Date(booking.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [booking]);

  if (!booking) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Ticket not found</h2>
        <Link to="/my-bookings" className="btn btn-primary" style={{ marginTop: "16px" }}>
          View My Bookings
        </Link>
      </div>
    );
  }

  const handleExtend = () => {
    extendBooking(booking.id, 30);
  };

  const handleCancel = () => {
    if (window.confirm(`Are you sure you want to cancel this booking? ₹${booking.totalAmount} will be refunded to your ParkVolt wallet.`)) {
      cancelBooking(booking.id, booking.totalAmount, (refundAmt) => {
        updateWalletBalance(currentUser.walletBalance + refundAmt);
      });
      navigate("/my-bookings");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "36px", paddingBottom: "70px", maxWidth: "640px" }}>
      {/* Back Link */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/my-bookings" className="btn btn-outline btn-sm">
          <ArrowLeft size={14} /> Back to My Bookings
        </Link>
      </div>

      {/* Main Digital Ticket Card */}
      <div
        className="card"
        style={{
          padding: "36px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          boxShadow: "var(--shadow-lg)",
          position: "relative"
        }}
      >
        {/* Top Status Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className={`badge ${
                booking.status === "active"
                  ? "badge-green"
                  : booking.status === "cancelled"
                  ? "badge-red"
                  : "badge-blue"
              }`}
            >
              <span className="sim-dot" /> {booking.status.toUpperCase()} PASS
            </span>
            <span className="badge badge-subtle">{booking.id}</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", marginTop: "4px" }}>
            {booking.locationName}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {booking.locationAddress}
          </p>
        </div>

        {/* Dynamic QR Code Canvas */}
        <div
          style={{
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "#FFFFFF",
            boxShadow: "var(--shadow-md)",
            border: "2px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <QRCodeSVG
            value={booking.qrCodeValue || `PARKVOLT-${booking.id}`}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "-12px" }}>
          Scan at barrier scanner for automated gate lift
        </div>

        {/* Live Countdown Timer */}
        {booking.status === "active" && (
          <div
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "var(--radius-md)",
              backgroundColor: timeLeft.isExpired ? "var(--color-red-light)" : "var(--color-primary-light)",
              border: `1px solid ${timeLeft.isExpired ? "var(--color-red)" : "var(--color-primary)"}`,
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase" }}>
              {timeLeft.isExpired ? "Booking Time Expired" : "Time Remaining on Bay"}
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                fontFamily: "var(--font-mono)",
                color: timeLeft.isExpired ? "var(--color-red)" : "var(--color-primary)",
                marginTop: "4px"
              }}
            >
              {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
            </div>
          </div>
        )}

        {/* Key Info Grid */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            padding: "18px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--bg-subtle)"
          }}
        >
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Assigned Slot</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
              {booking.slotCode}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Vehicle Number</div>
            <div style={{ fontSize: "16px", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
              {booking.vehicleNumber}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Start Time</div>
            <div style={{ fontSize: "13px", fontWeight: "600" }}>
              {new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Valid Until</div>
            <div style={{ fontSize: "13px", fontWeight: "600" }}>
              {new Date(booking.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>

        {/* Action Buttons: Extend / Cancel */}
        {booking.status === "active" && (
          <div style={{ width: "100%", display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={handleExtend}
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: "center" }}
              title="Add 30 minutes for ₹30"
            >
              <PlusCircle size={16} /> Extend 30m (+₹30)
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: "center", color: "var(--color-red)", borderColor: "var(--color-red-light)" }}
            >
              <XCircle size={16} /> Cancel & Refund
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
