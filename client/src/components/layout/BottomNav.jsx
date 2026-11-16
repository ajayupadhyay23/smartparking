/**
 * BottomNav.jsx
 * Mobile bottom navigation bar for comfortable thumb-friendly mobile app navigation.
 */
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, Zap, BookmarkCheck, Wallet } from "lucide-react";
import { useBooking } from "../../context/BookingContext";

export default function BottomNav() {
  const { bookings } = useBooking();
  const activeCount = bookings.filter((b) => b.status === "active").length;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        display: "none",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 0 10px",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
        backdropFilter: "blur(12px)"
      }}
      className="mobile-bottom-nav"
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          fontSize: "11px",
          fontWeight: "600",
          color: isActive ? "var(--color-primary)" : "var(--text-muted)"
        })}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/find-parking"
        style={({ isActive }) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          fontSize: "11px",
          fontWeight: "600",
          color: isActive ? "var(--color-primary)" : "var(--text-muted)"
        })}
      >
        <Compass size={20} />
        <span>Parking</span>
      </NavLink>

      <NavLink
        to="/find-ev"
        style={({ isActive }) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          fontSize: "11px",
          fontWeight: "600",
          color: isActive ? "var(--color-green)" : "var(--text-muted)"
        })}
      >
        <Zap size={20} />
        <span>EV</span>
      </NavLink>

      <NavLink
        to="/my-bookings"
        style={({ isActive }) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          fontSize: "11px",
          fontWeight: "600",
          position: "relative",
          color: isActive ? "var(--color-primary)" : "var(--text-muted)"
        })}
      >
        <BookmarkCheck size={20} />
        <span>Tickets</span>
        {activeCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "4px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--color-green)"
            }}
          />
        )}
      </NavLink>

      <NavLink
        to="/wallet"
        style={({ isActive }) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          fontSize: "11px",
          fontWeight: "600",
          color: isActive ? "var(--color-primary)" : "var(--text-muted)"
        })}
      >
        <Wallet size={20} />
        <span>Wallet</span>
      </NavLink>

      <style>{`
        @media (max-width: 820px) {
          .mobile-bottom-nav { display: flex !important; }
          body { padding-bottom: 64px !important; }
        }
      `}</style>
    </nav>
  );
}
