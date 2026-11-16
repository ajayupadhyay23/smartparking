/**
 * MyBookingsPage.jsx (Page 7)
 *
 * Requirements:
 * - Tabs: Upcoming / Active / Past (completed or cancelled)
 * - Booking cards with slot code, location, price, QR pass link, and directions
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookmarkCheck,
  Clock,
  MapPin,
  QrCode,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  Car
} from "lucide-react";
import { useBooking } from "../context/BookingContext";

export default function MyBookingsPage() {
  const { bookings } = useBooking();
  const [filterTab, setFilterTab] = useState("all"); // 'all', 'active', 'past'

  const filtered = bookings.filter((b) => {
    if (filterTab === "active") return b.status === "active";
    if (filterTab === "past") return b.status === "completed" || b.status === "cancelled";
    return true;
  });

  return (
    <div className="container" style={{ paddingTop: "40px", paddingBottom: "70px", maxWidth: "860px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <span className="badge badge-blue">Driver Hub</span>
        <h1 style={{ fontSize: "30px", fontWeight: "800", marginTop: "6px" }}>
          My Parking Passes
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Access active QR tickets, review past reservations, or extend parking sessions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "28px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "12px"
        }}
      >
        <button
          type="button"
          onClick={() => setFilterTab("all")}
          className={`btn btn-sm ${filterTab === "all" ? "btn-primary" : "btn-outline"}`}
        >
          All ({bookings.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab("active")}
          className={`btn btn-sm ${filterTab === "active" ? "btn-green" : "btn-outline"}`}
        >
          Active / Running ({bookings.filter((b) => b.status === "active").length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab("past")}
          className={`btn btn-sm ${filterTab === "past" ? "btn-primary" : "btn-outline"}`}
        >
          Past & Cancelled
        </button>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: "48px", textAlign: "center" }}>
          <BookmarkCheck size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>No bookings found</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px" }}>
            Reserve a parking bay or EV plug to see your active pass here.
          </p>
          <Link to="/find-parking" className="btn btn-primary" style={{ marginTop: "20px" }}>
            Find Parking Bays
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {filtered.map((b) => (
            <div key={b.id} className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span
                      className={`badge ${
                        b.status === "active"
                          ? "badge-green"
                          : b.status === "cancelled"
                          ? "badge-red"
                          : "badge-subtle"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                    <span className="badge badge-subtle">{b.id}</span>
                    {b.isEvSlot && <span className="badge badge-blue">⚡ EV Bay</span>}
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "800" }}>{b.locationName}</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <MapPin size={14} /> {b.locationAddress}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Assigned Bay</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
                    {b.slotCode}
                  </div>
                </div>
              </div>

              {/* Time Details & Vehicle */}
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "12px",
                  fontSize: "12px"
                }}
              >
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Vehicle:</span>
                  <div style={{ fontWeight: "700", fontFamily: "var(--font-mono)" }}>{b.vehicleNumber}</div>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Start Time:</span>
                  <div style={{ fontWeight: "600" }}>{new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>End Time:</span>
                  <div style={{ fontWeight: "600" }}>{new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Total Paid:</span>
                  <div style={{ fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>₹{b.totalAmount}</div>
                </div>
              </div>

              {/* Action Link to QR Ticket */}
              <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                <Link to={`/ticket/${b.id}`} className="btn btn-primary btn-sm">
                  <QrCode size={15} /> View QR Ticket <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
