/**
 * Footer.jsx
 * Professional modern footer with brand identity, quick links, INR pricing note, and viva credits.
 */
import React from "react";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Heart, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        padding: "60px 0 30px",
        marginTop: "60px",
        transition: "var(--transition)"
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            marginBottom: "40px"
          }}
        >
          {/* Brand info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #2F6BFF, #12B76A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFF"
                }}
              >
                <Zap size={18} fill="currentColor" />
              </div>
              <span style={{ fontSize: "18px", fontWeight: "800" }}>
                Park<span style={{ color: "var(--color-primary)" }}>Volt</span>
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Next-generation smart parking and EV fast-charging finder built with React, Three.js,
              and low-latency local storage architecture.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
              <span className="simulated-pill" style={{ fontSize: "10px" }}>
                <span className="sim-dot" /> Real-time simulation
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Explore
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <Link to="/find-parking" style={{ transition: "var(--transition)" }}>Find Parking Bays</Link>
              <Link to="/find-ev" style={{ transition: "var(--transition)" }}>Fast EV Superchargers</Link>
              <Link to="/my-bookings" style={{ transition: "var(--transition)" }}>Active Parking Tickets</Link>
              <Link to="/wallet" style={{ transition: "var(--transition)" }}>Digital Prepaid Wallet</Link>
            </div>
          </div>

          {/* Supported standards */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              EV Standards Supported
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <span>CCS2 DC Ultra-Fast (up to 150 kW)</span>
              <span>Type 2 AC Fast Charging (22 kW)</span>
              <span>CHAdeMO DC Fast Charging</span>
              <span>Bharat AC001 & DC001 Specs</span>
            </div>
          </div>

          {/* Academic & Viva details */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              BTech Project Viva
            </h4>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Demonstrates 3D WebGL digital twin, client-side cryptographic hashing (SHA-256),
              concurrency collision prevention, and instant dynamic QR tickets.
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "10px" }}>
              Currency: Indian Rupee (INR ₹)
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            fontSize: "12px",
            color: "var(--text-muted)"
          }}
        >
          <div>
            © {new Date().getFullYear()} ParkVolt. All simulated data and mock transactions are for academic demonstration.
          </div>
          <div>
            Photos from Unsplash (credits listed in README). Built with React 18 & Three.js.
          </div>
        </div>
      </div>
    </footer>
  );
}
