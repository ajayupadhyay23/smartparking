/**
 * FindEvChargingPage.jsx (Page 4)
 *
 * Requirements:
 * - Filters for EV connectors: Type 2, CCS2, CHAdeMO, Bharat AC001, Bharat DC001
 * - Filter for charging speed (Standard AC vs DC Fast vs Ultra-Fast 100kW+)
 * - Price slider and status toggle (Available vs In Use)
 * - Cards show kW speed, price per kWh, live status, and connector pinouts
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  BatteryCharging,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Search
} from "lucide-react";
import { useBooking } from "../context/BookingContext";

export default function FindEvChargingPage() {
  const { evStations } = useBooking();

  const [selectedConnector, setSelectedConnector] = useState("All");
  const [selectedSpeed, setSelectedSpeed] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPricePerKwh, setMaxPricePerKwh] = useState(18);

  const connectorList = ["All", "CCS2", "Type 2", "CHAdeMO", "Bharat AC001", "Bharat DC001"];

  const filtered = evStations.filter((st) => {
    if (selectedConnector !== "All" && st.connector !== selectedConnector) return false;
    if (selectedSpeed === "DC" && !st.speedType.includes("DC")) return false;
    if (selectedSpeed === "AC" && !st.speedType.includes("AC")) return false;
    if (selectedSpeed === "Ultra" && st.powerKw < 100) return false;
    if (onlyAvailable && st.status !== "Available") return false;
    if (st.pricePerKwh > maxPricePerKwh) return false;
    return true;
  });

  return (
    <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span className="badge badge-green">High-Voltage Superchargers</span>
          <span className="simulated-pill">
            <span className="sim-dot" /> Live BMS Telemetry
          </span>
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Find EV Charging Stations
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Plug into fast, reliable liquid-cooled DC fast chargers and Type 2 wallboxes across India.
        </p>
      </div>

      {/* Filters Box */}
      <div className="card" style={{ padding: "24px", marginBottom: "36px" }}>
        {/* Connector Pills */}
        <div style={{ marginBottom: "20px" }}>
          <label className="form-label" style={{ display: "block", marginBottom: "8px" }}>
            Filter by Connector Standard
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {connectorList.map((con) => (
              <button
                key={con}
                type="button"
                onClick={() => setSelectedConnector(con)}
                className={`btn btn-sm ${selectedConnector === con ? "btn-green" : "btn-outline"}`}
              >
                <Zap size={13} /> {con}
              </button>
            ))}
          </div>
        </div>

        {/* Speed, Availability, and Price */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
            alignItems: "flex-end",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-subtle)"
          }}
        >
          {/* Speed Selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Speed Tier</label>
            <select
              className="form-input"
              value={selectedSpeed}
              onChange={(e) => setSelectedSpeed(e.target.value)}
            >
              <option value="All">All Speeds</option>
              <option value="Ultra">Ultra-Fast (100+ kW DC)</option>
              <option value="DC">All DC Fast Chargers</option>
              <option value="AC">AC Destination Chargers</option>
            </select>
          </div>

          {/* Price Per kWh */}
          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600" }}>
              <span>Max Tariff / kWh:</span>
              <span style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)" }}>₹{maxPricePerKwh}/kWh</span>
            </div>
            <input
              type="range"
              min="10"
              max="20"
              step="1"
              value={maxPricePerKwh}
              onChange={(e) => setMaxPricePerKwh(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--color-green)", marginTop: "10px" }}
            />
          </div>

          {/* Availability Toggle */}
          <div style={{ marginBottom: "2px" }}>
            <button
              type="button"
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`btn btn-sm ${onlyAvailable ? "btn-green" : "btn-outline"}`}
              style={{ width: "100%", padding: "11px 16px" }}
            >
              <CheckCircle2 size={14} /> Available Guns Only
            </button>
          </div>
        </div>
      </div>

      {/* Grid of EV Charging Station Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "28px"
        }}
      >
        {filtered.map((station) => (
          <div key={station.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
            {/* Image */}
            <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
              <img
                src={station.image}
                alt={station.altText}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                <span className="badge" style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", color: "#FFF" }}>
                  {station.connector}
                </span>
                <span
                  className={`badge ${station.status === "Available" ? "badge-green" : "badge-amber"}`}
                >
                  <span className="sim-dot" style={{ backgroundColor: station.status === "Available" ? "var(--color-green)" : "var(--color-amber)" }} />
                  {station.status}
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "700" }}>{station.name}</h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {station.locationName}
                </p>
              </div>

              {/* Power and Specs */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  padding: "10px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-subtle)"
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Output Power</div>
                  <div style={{ fontSize: "17px", fontWeight: "800", color: "var(--color-green)", fontFamily: "var(--font-mono)" }}>
                    {station.powerKw} kW
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Energy Rate</div>
                  <div style={{ fontSize: "17px", fontWeight: "800", fontFamily: "var(--font-mono)" }}>
                    ₹{station.pricePerKwh}
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>/kWh</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                <Link
                  to={`/parking/${station.locationId}`}
                  className="btn btn-green btn-sm"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Plug In & Reserve <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
