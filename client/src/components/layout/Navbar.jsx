/**
 * Navbar.jsx
 * Responsive navigation bar with brand logo, links, Theme Toggle (Light/Dark/Auto),
 * live simulated status badge, and user auth state.
 */
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Zap,
  Car,
  BookmarkCheck,
  Wallet,
  User,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Sparkles,
  LogOut
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";

export default function Navbar() {
  const { themePreference, changeTheme, isDark } = useTheme();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { bookings } = useBooking();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBookingsCount = bookings.filter((b) => b.status === "active").length;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        backdropFilter: "blur(12px)",
        transition: "var(--transition)"
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2F6BFF 0%, #7C5CFF 50%, #12B76A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              boxShadow: "0 4px 14px rgba(47, 107, 255, 0.35)"
            }}
          >
            <Zap size={22} fill="currentColor" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>
                Park<span style={{ color: "var(--color-primary)" }}>Volt</span>
              </span>
              <span className="badge badge-green" style={{ fontSize: "10px", padding: "2px 6px" }}>
                v2.0
              </span>
            </div>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "500" }}>
              Smart Parking & EV Finder
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              fontWeight: "600",
              color: isActive ? "var(--color-primary)" : "var(--text-secondary)",
              background: isActive ? "var(--color-primary-light)" : "transparent"
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/find-parking"
            style={({ isActive }) => ({
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              fontWeight: "600",
              color: isActive ? "var(--color-primary)" : "var(--text-secondary)",
              background: isActive ? "var(--color-primary-light)" : "transparent"
            })}
          >
            Find Parking
          </NavLink>
          <NavLink
            to="/find-ev"
            style={({ isActive }) => ({
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: isActive ? "var(--color-green)" : "var(--text-secondary)",
              background: isActive ? "var(--color-green-light)" : "transparent"
            })}
          >
            <Zap size={14} /> EV Charging
          </NavLink>
          <NavLink
            to="/my-bookings"
            style={({ isActive }) => ({
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: isActive ? "var(--color-primary)" : "var(--text-secondary)",
              background: isActive ? "var(--color-primary-light)" : "transparent"
            })}
          >
            <BookmarkCheck size={14} /> Bookings
            {activeBookingsCount > 0 && (
              <span className="badge badge-green" style={{ padding: "1px 6px", fontSize: "10px" }}>
                {activeBookingsCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/wallet"
            style={({ isActive }) => ({
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: isActive ? "var(--color-primary)" : "var(--text-secondary)",
              background: isActive ? "var(--color-primary-light)" : "transparent"
            })}
          >
            <Wallet size={14} /> Wallet
          </NavLink>
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Simulated Data Badge */}
          <div className="simulated-pill" title="Live availability simulated for demonstration purposes">
            <span className="sim-dot" />
            <span className="desktop-only">Simulated Data</span>
          </div>

          {/* Theme Selector (Light / Dark / Auto) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--bg-subtle)",
              borderRadius: "var(--radius-full)",
              padding: "3px",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <button
              type="button"
              onClick={() => changeTheme("light")}
              title="Light theme"
              style={{
                padding: "6px",
                borderRadius: "50%",
                color: themePreference === "light" ? "var(--color-primary)" : "var(--text-muted)",
                backgroundColor: themePreference === "light" ? "var(--bg-surface)" : "transparent",
                boxShadow: themePreference === "light" ? "var(--shadow-sm)" : "none",
                display: "flex"
              }}
            >
              <Sun size={15} />
            </button>
            <button
              type="button"
              onClick={() => changeTheme("auto")}
              title="Auto: follow device theme live"
              style={{
                padding: "6px",
                borderRadius: "50%",
                color: themePreference === "auto" ? "var(--color-primary)" : "var(--text-muted)",
                backgroundColor: themePreference === "auto" ? "var(--bg-surface)" : "transparent",
                boxShadow: themePreference === "auto" ? "var(--shadow-sm)" : "none",
                display: "flex"
              }}
            >
              <Monitor size={15} />
            </button>
            <button
              type="button"
              onClick={() => changeTheme("dark")}
              title="Dark theme"
              style={{
                padding: "6px",
                borderRadius: "50%",
                color: themePreference === "dark" ? "var(--color-primary)" : "var(--text-muted)",
                backgroundColor: themePreference === "dark" ? "var(--bg-surface)" : "transparent",
                boxShadow: themePreference === "dark" ? "var(--shadow-sm)" : "none",
                display: "flex"
              }}
            >
              <Moon size={15} />
            </button>
          </div>

          {/* User Account Button */}
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="desktop-only">
              <Link
                to="/wallet"
                className="btn btn-outline btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <User size={14} />
                <span>{currentUser.name.split(" ")[0]}</span>
                <span className="badge badge-blue" style={{ padding: "1px 6px" }}>
                  ₹{currentUser.walletBalance}
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Log out"
                style={{
                  padding: "8px",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-muted)",
                  display: "flex"
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm desktop-only">
              Sign In
            </Link>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-only"
            style={{
              padding: "8px",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-main)",
              display: "none"
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: "16px 20px 24px",
            backgroundColor: "var(--bg-surface)",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: "10px 14px", fontWeight: "600" }}
          >
            Home
          </Link>
          <Link
            to="/find-parking"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: "10px 14px", fontWeight: "600" }}
          >
            Find Parking
          </Link>
          <Link
            to="/find-ev"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: "10px 14px", fontWeight: "600" }}
          >
            Find EV Charging
          </Link>
          <Link
            to="/my-bookings"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: "10px 14px", fontWeight: "600" }}
          >
            My Bookings ({bookings.length})
          </Link>
          <Link
            to="/wallet"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: "10px 14px", fontWeight: "600" }}
          >
            Wallet (₹{currentUser ? currentUser.walletBalance : 0})
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="btn btn-outline"
              style={{ marginTop: "10px" }}
            >
              Sign Out ({currentUser.name})
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ marginTop: "10px" }}
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}

      {/* Mobile CSS Inline rules */}
      <style>{`
        @media (max-width: 820px) {
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
