/**
 * FindParkingPage.jsx (Page 2)
 *
 * Requirements:
 * - Search by keyword and city
 * - Filters: Price slider, distance/city, availability, EV charging only
 * - Cards with real images, free slots, price per hour, amenities, opening hours
 * - Peak-hour price badges
 * - Favorite button (saves to localStorage)
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Zap,
  Heart,
  SlidersHorizontal,
  ChevronRight,
  Filter
} from "lucide-react";
import { useBooking } from "../context/BookingContext";

export default function FindParkingPage() {
  const { locations, favorites, toggleFavorite } = useBooking();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [maxPrice, setMaxPrice] = useState(120);
  const [evOnly, setEvOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  // Filter logic
  const filtered = locations.filter((loc) => {
    if (selectedCity !== "All" && loc.city !== selectedCity) return false;
    if (loc.pricePerHour > maxPrice) return false;
    if (evOnly && !loc.hasEvCharging) return false;
    if (availableOnly && loc.baseAvailableSlots <= 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = loc.name.toLowerCase().includes(q);
      const matchArea = loc.area.toLowerCase().includes(q);
      const matchCity = loc.city.toLowerCase().includes(q);
      if (!matchName && !matchArea && !matchCity) return false;
    }
    return true;
  });

  return (
    <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span className="badge badge-blue">Interactive Finder</span>
          <span className="simulated-pill">
            <span className="sim-dot" /> Live Availability
          </span>
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Find Parking Bays
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Compare rates, check live free slots, and reserve your designated bay in advance.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ padding: "24px", marginBottom: "36px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
            alignItems: "flex-end"
          }}
        >
          {/* Keyword Search */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Location or Landmark</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px" }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "36px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. CyberHub, CP, BKC..."
              />
            </div>
          </div>

          {/* City Selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Select City</label>
            <select
              className="form-input"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="All">All Cities (NCR, BOM, BLR)</option>
              <option value="Gurugram">Gurugram</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600" }}>
              <span>Max Hourly Tariff:</span>
              <span style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>₹{maxPrice}/h</span>
            </div>
            <input
              type="range"
              min="40"
              max="120"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--color-primary)", marginTop: "10px" }}
            />
          </div>
        </div>

        {/* Quick Toggles Strip */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-subtle)",
            alignItems: "center"
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Filters:</span>
          <button
            type="button"
            onClick={() => setEvOnly(!evOnly)}
            className={`btn btn-sm ${evOnly ? "btn-green" : "btn-outline"}`}
          >
            <Zap size={14} /> EV Charging Available
          </button>
          <button
            type="button"
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`btn btn-sm ${availableOnly ? "btn-primary" : "btn-outline"}`}
          >
            <CheckCircle2 size={14} /> Slots Free Right Now
          </button>
          {(searchQuery || selectedCity !== "All" || maxPrice < 120 || evOnly || availableOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("All");
                setMaxPrice(120);
                setEvOnly(false);
                setAvailableOnly(false);
              }}
              className="btn btn-sm btn-outline"
              style={{ marginLeft: "auto", color: "var(--color-red)", borderColor: "var(--color-red-light)" }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>
          Showing <span style={{ color: "var(--text-main)", fontWeight: "800" }}>{filtered.length}</span> parking locations
        </p>
      </div>

      {/* Location Cards Grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: "48px", textAlign: "center" }}>
          <Search size={36} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>No matching parking bays found</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px" }}>
            Try increasing the maximum price slider or changing the city filter.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "28px"
          }}
        >
          {filtered.map((loc) => {
            const isFav = favorites.includes(loc.id);

            return (
              <div key={loc.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                {/* Photo Header */}
                <div style={{ position: "relative", height: "220px", width: "100%", overflow: "hidden" }}>
                  <img
                    src={loc.image}
                    alt={loc.altText}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* City Badge & Peak Hours */}
                  <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                    <span className="badge" style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", color: "#FFF" }}>
                      {loc.city}
                    </span>
                    {loc.isPeakNow && (
                      <span className="badge badge-amber" title={`Peak multiplier ${loc.peakMultiplier}x`}>
                        🔥 Peak Tariff
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(loc.id)}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(15, 23, 42, 0.75)",
                      color: isFav ? "#EF4444" : "#FFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      backdropFilter: "blur(6px)"
                    }}
                    title={isFav ? "Remove favorite" : "Save favorite"}
                  >
                    <Heart size={18} fill={isFav ? "#EF4444" : "none"} />
                  </button>

                  {/* Rating Pill */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      backgroundColor: "rgba(15, 23, 42, 0.8)",
                      color: "#FFF",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "12px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <span>{loc.rating}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>({loc.reviewsCount})</span>
                  </div>
                </div>

                {/* Card Info */}
                <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700" }}>{loc.name}</h3>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                      <MapPin size={14} /> {loc.address}
                    </p>
                  </div>

                  {/* Availability Pill & Hours */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                    <span className="badge badge-green">
                      <CheckCircle2 size={13} /> {loc.baseAvailableSlots} of {loc.totalSlots} Bays Free
                    </span>
                    <span className="badge badge-subtle">
                      <Clock size={12} /> {loc.openingHours}
                    </span>
                  </div>

                  {/* EV Specs if available */}
                  {loc.hasEvCharging && (
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--color-green-light)",
                        color: "var(--color-green)",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Zap size={14} /> {loc.evMaxKw} kW Fast DC
                      </span>
                      <span>{loc.evConnectors.join(" • ")}</span>
                    </div>
                  )}

                  {/* Amenities Chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: "11px" }}>
                    {loc.amenities.slice(0, 4).map((amenity, i) => (
                      <span key={i} className="badge badge-subtle" style={{ padding: "3px 8px" }}>
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Price & Select CTA */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Rate per hour</div>
                      <div style={{ fontSize: "20px", fontWeight: "800", fontFamily: "var(--font-mono)" }}>
                        ₹{loc.pricePerHour}
                        <span style={{ fontSize: "12px", fontWeight: "500", color: "var(--text-muted)" }}>/h</span>
                      </div>
                    </div>

                    <Link to={`/parking/${loc.id}`} className="btn btn-primary btn-sm">
                      Select Bay <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
