/**
 * LandingPage.jsx (Page 1)
 *
 * Requirements:
 * - Navbar (rendered in Layout)
 * - 3D Hero scene (low-poly floating island with walking pedestrians, looping cars, EV charging, clickable slots)
 * - Heading: "Find Parking. Charge Smart. Move Freely."
 * - Search box with city / facility suggestions
 * - "Find Parking" and "Find EV Charging" primary action buttons
 * - Live stats counters with smooth simulated change indicator
 * - Featured places cards (with real images, price in INR, peak badges)
 * - How it works (4 steps with clean icons)
 * - Key features grid
 * - Pricing in INR section
 * - FAQ accordion
 * - Footer (rendered in Layout)
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Zap,
  Car,
  Compass,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Smartphone,
  CreditCard,
  QrCode,
  Sliders,
  HelpCircle,
  Sparkles
} from "lucide-react";
import FloatingCityScene from "../components/3d/FloatingCityScene";
import { useBooking } from "../context/BookingContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { locations, favorites, toggleFavorite } = useBooking();
  const [heroSearch, setHeroSearch] = useState("");
  const [selectedHeroSlot, setSelectedHeroSlot] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/find-parking?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/find-parking");
    }
  };

  const handleHeroSlotSelect = (slot) => {
    setSelectedHeroSlot(slot);
    // Directly navigate to booking detail for CyberHub with this slot
    navigate(`/parking/loc-1?slot=${slot.code}`);
  };

  const faqs = [
    {
      q: "How does the real-time slot availability work?",
      a: "Our system runs simulated live sensor feeds updating bay occupancy every 4 seconds. In a live production deployment, this connects to ultrasonic bay sensors and camera ANPR feeds."
    },
    {
      q: "How is double-booking prevented?",
      a: "When you proceed to checkout, ParkVolt locks your selected slot across that exact time window and re-verifies before confirming payment. No overlapping reservations can ever be confirmed for the same slot."
    },
    {
      q: "What payment methods are supported?",
      a: "We support UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and instant 1-click ParkVolt Prepaid Wallet with 100% demo safety."
    },
    {
      q: "Can I extend or cancel my booking?",
      a: "Yes! Active tickets can be extended in 30-minute intervals directly from your booking screen. Cancellations made before start time receive an instant 100% refund into your ParkVolt wallet."
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "80px", overflowX: "hidden" }}>
      {/* =========================================================================
          HERO SECTION (With 3D WebGL Miniature City)
      ========================================================================= */}
      <section style={{ position: "relative", paddingTop: "40px", paddingBottom: "20px" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "40px",
              alignItems: "center"
            }}
            className="hero-grid"
          >
            {/* Left Column: Headline, search, and CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", zIndex: 2 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span className="badge badge-blue">
                  <Sparkles size={14} /> 3D Digital Twin City
                </span>
                <span className="simulated-pill">
                  <span className="sim-dot" /> Live Bay Telemetry
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(36px, 5.5vw, 56px)",
                  fontWeight: "800",
                  lineHeight: "1.12",
                  letterSpacing: "-1.5px"
                }}
              >
                Find Parking. <br />
                <span style={{ color: "var(--color-primary)" }}>Charge Smart.</span> <br />
                Move Freely.
              </h1>

              <p style={{ fontSize: "17px", color: "var(--text-secondary)", maxWidth: "520px", lineHeight: "1.6" }}>
                Discover verified parking bays and ultra-fast EV superchargers across India.
                Interact with our 3D digital-twin city, pick your exact slot, and reserve with zero friction.
              </p>

              {/* Search Bar Input Box */}
              <form onSubmit={handleSearchSubmit} style={{ maxWidth: "520px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "var(--bg-surface)",
                    border: "2px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                    padding: "6px 8px 6px 16px",
                    boxShadow: "var(--shadow-md)"
                  }}
                >
                  <Search size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Enter city, metro station, or mall..."
                    style={{
                      border: "none",
                      outline: "none",
                      padding: "10px 12px",
                      width: "100%",
                      fontSize: "15px",
                      background: "transparent"
                    }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: "10px 22px" }}>
                    Search
                  </button>
                </div>
              </form>

              {/* Primary Dual Action Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", paddingTop: "6px" }}>
                <Link to="/find-parking" className="btn btn-primary btn-lg">
                  <Car size={18} /> Find Parking
                </Link>
                <Link to="/find-ev" className="btn btn-green btn-lg">
                  <Zap size={18} /> Find EV Charging
                </Link>
              </div>

              {/* Micro Tip for the 3D scene */}
              <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--color-primary)", fontWeight: "700" }}>Tip:</span>
                Drag the 3D island with your mouse. Click any green slot to reserve directly!
              </div>
            </div>

            {/* Right Column: 3D Miniature City Canvas */}
            <div
              style={{
                width: "100%",
                height: "560px",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-lg)",
                position: "relative",
                background: "var(--bg-surface)"
              }}
              className="hero-3d-box"
            >
              <FloatingCityScene
                selectedSlotId={selectedHeroSlot ? selectedHeroSlot.id : null}
                onSelectSlot={handleHeroSlotSelect}
                height="100%"
              />

              {/* 3D Scene Controls HUD pill */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  zIndex: 10,
                  pointerEvents: "none",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-full)",
                  padding: "6px 14px",
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span className="sim-dot" style={{ backgroundColor: "var(--color-green)" }} />
                <span>Green = Free • Red = Taken • Click to Pick</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 960px) {
            .hero-grid {
              grid-template-columns: 1fr 1.15fr !important;
            }
          }
          @media (max-width: 959px) {
            .hero-3d-box {
              height: 420px !important;
            }
          }
        `}</style>
      </section>

      {/* =========================================================================
          LIVE STATS COUNTERS
      ========================================================================= */}
      <section className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px"
          }}
        >
          <div className="card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
              4,820+
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "4px" }}>Verified Parking Bays</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Across 12 Major Cities</div>
          </div>

          <div className="card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--color-green)", fontFamily: "var(--font-mono)" }}>
              1,240+
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "4px" }}>EV Fast Superchargers</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Up to 150 kW DC Speed</div>
          </div>

          <div className="card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--color-violet)", fontFamily: "var(--font-mono)" }}>
              99.8%
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "4px" }}>Availability Accuracy</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Simulated 4s Synced Feed</div>
          </div>

          <div className="card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--color-amber)", fontFamily: "var(--font-mono)" }}>
              0 mins
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "4px" }}>Queuing Time</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Pre-Reserved Gate Pass</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED PLACES (Tesla / Airbnb Card Aesthetic)
      ========================================================================= */}
      <section className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <span className="badge badge-blue">Popular Destinations</span>
            <h2 style={{ fontSize: "30px", fontWeight: "800", marginTop: "8px", letterSpacing: "-0.5px" }}>
              Featured Parking & Supercharge Hubs
            </h2>
          </div>
          <Link to="/find-parking" className="btn btn-outline" style={{ display: "inline-flex" }}>
            View All ({locations.length}) <ArrowRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "28px"
          }}
        >
          {locations.slice(0, 3).map((loc) => (
            <div key={loc.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              {/* Image Container with Peak Badge */}
              <div style={{ position: "relative", height: "210px", width: "100%", overflow: "hidden" }}>
                <img
                  src={loc.image}
                  alt={loc.altText}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  <span className="badge" style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", color: "#FFF", backdropFilter: "blur(6px)" }}>
                    {loc.city}
                  </span>
                  {loc.isPeakNow && (
                    <span className="badge badge-amber" title="Peak hours apply">
                      🔥 Peak Demand
                    </span>
                  )}
                </div>

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
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700" }}>{loc.name}</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <MapPin size={14} /> {loc.area}
                  </p>
                </div>

                {/* Free slots & EV badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="badge badge-green">
                    <CheckCircle2 size={13} /> {loc.baseAvailableSlots} free bays
                  </span>
                  {loc.hasEvCharging && (
                    <span className="badge badge-blue">
                      <Zap size={13} /> {loc.evMaxKw} kW Fast Charge
                    </span>
                  )}
                </div>

                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  {loc.description.slice(0, 95)}...
                </p>

                {/* Price & Action */}
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
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tariff from</div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>
                      ₹{loc.pricePerHour}
                      <span style={{ fontSize: "12px", fontWeight: "500", color: "var(--text-muted)" }}>/hour</span>
                    </div>
                  </div>

                  <Link to={`/parking/${loc.id}`} className="btn btn-primary btn-sm">
                    Select Slot <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS (4 Simple Steps)
      ========================================================================= */}
      <section style={{ backgroundColor: "var(--bg-subtle)", padding: "70px 0", transition: "var(--transition)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 50px" }}>
            <span className="badge badge-blue">Simple 4-Step Process</span>
            <h2 style={{ fontSize: "32px", fontWeight: "800", marginTop: "10px", letterSpacing: "-0.5px" }}>
              How ParkVolt Works
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "6px" }}>
              From digital search to reserved bay in under 60 seconds.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "28px"
            }}
          >
            <div className="card" style={{ padding: "28px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Search size={26} />
              </div>
              <span className="badge badge-blue" style={{ fontSize: "11px" }}>Step 1</span>
              <h3 style={{ fontSize: "17px", fontWeight: "700" }}>Search & Filter</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Find verified parking lots and EV charging plugs by city, rate, or connector type.
              </p>
            </div>

            <div className="card" style={{ padding: "28px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--color-violet-light)", color: "var(--color-violet)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Compass size={26} />
              </div>
              <span className="badge" style={{ backgroundColor: "var(--color-violet-light)", color: "var(--color-violet)", fontSize: "11px" }}>Step 2</span>
              <h3 style={{ fontSize: "17px", fontWeight: "700" }}>Pick on 3D Map</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                View the 3D digital-twin bay grid. Select your exact slot (Ground, Basement, or EV fast).
              </p>
            </div>

            <div className="card" style={{ padding: "28px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--color-green-light)", color: "var(--color-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CreditCard size={26} />
              </div>
              <span className="badge badge-green" style={{ fontSize: "11px" }}>Step 3</span>
              <h3 style={{ fontSize: "17px", fontWeight: "700" }}>Demo Pay & Lock</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Confirm with demo UPI, Card, or Wallet. Collision prevention locks your bay instantly.
              </p>
            </div>

            <div className="card" style={{ padding: "28px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--color-amber-light)", color: "var(--color-amber)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <QrCode size={26} />
              </div>
              <span className="badge badge-amber" style={{ fontSize: "11px" }}>Step 4</span>
              <h3 style={{ fontSize: "17px", fontWeight: "700" }}>Scan & Park</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Drive in and flash your instant QR ticket at the barrier gate. Park with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRICING IN INR SECTION
      ========================================================================= */}
      <section className="container">
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 50px" }}>
          <span className="badge badge-blue">Transparent Rates in INR</span>
          <h2 style={{ fontSize: "32px", fontWeight: "800", marginTop: "10px", letterSpacing: "-0.5px" }}>
            Simple, Fair Pricing
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "6px" }}>
            Pay only for the time and energy you use. No hidden fees.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px"
          }}
        >
          {/* Plan 1 */}
          <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <span className="badge badge-subtle">Standard Parking</span>
              <h3 style={{ fontSize: "22px", fontWeight: "800", marginTop: "10px" }}>Hourly Parking</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Ideal for city shopping & meetings</p>
            </div>
            <div style={{ fontSize: "36px", fontWeight: "800", fontFamily: "var(--font-mono)" }}>
              ₹40 - ₹60<span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-muted)" }}> / hour</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> 15-Minute Free Grace Period</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> QR Gate Access Pass</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> CCTV Guarded Covered Bays</li>
            </ul>
            <Link to="/find-parking" className="btn btn-outline" style={{ marginTop: "auto" }}>
              Explore Locations
            </Link>
          </div>

          {/* Plan 2: Highlighted */}
          <div
            className="card"
            style={{
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              border: "2px solid var(--color-primary)",
              boxShadow: "var(--shadow-glow-blue)"
            }}
          >
            <div>
              <span className="badge badge-green">Recommended</span>
              <h3 style={{ fontSize: "22px", fontWeight: "800", marginTop: "10px" }}>EV Fast Charging</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>High-voltage DC fast charging</p>
            </div>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
              ₹12 - ₹16<span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-muted)" }}> / kWh</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> Up to 150 kW Liquid-Cooled Guns</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> Zero Idle Parking Surcharge</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> Automated BMS Tapering & Safety</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> CCS2, Type 2 & CHAdeMO</li>
            </ul>
            <Link to="/find-ev" className="btn btn-green" style={{ marginTop: "auto" }}>
              Find Chargers Now
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <span className="badge badge-subtle">Monthly Pass</span>
              <h3 style={{ fontSize: "22px", fontWeight: "800", marginTop: "10px" }}>Commuter Pass</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Unlimited office parking</p>
            </div>
            <div style={{ fontSize: "36px", fontWeight: "800", fontFamily: "var(--font-mono)" }}>
              ₹2,499<span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-muted)" }}> / month</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> Dedicated Reserved Bay</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> 20% Discount on EV Units</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--color-green)" /> Priority ANPR Entry</li>
            </ul>
            <Link to="/find-parking" className="btn btn-outline" style={{ marginTop: "auto" }}>
              Check Eligibility
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION
      ========================================================================= */}
      <section className="container" style={{ maxWidth: "800px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="badge badge-blue">Got Questions?</span>
          <h2 style={{ fontSize: "30px", fontWeight: "800", marginTop: "8px" }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="card" style={{ padding: "20px 24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <HelpCircle size={18} color="var(--color-primary)" /> {faq.q}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px", lineHeight: "1.6" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
