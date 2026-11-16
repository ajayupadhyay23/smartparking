/**
 * NotFoundPage.jsx (Page 10)
 *
 * Requirements:
 * - Clean 404 page with navigation to Home and Find Parking
 */
import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="container" style={{ paddingTop: "80px", paddingBottom: "100px", textAlign: "center", maxWidth: "540px" }}>
      <div className="card" style={{ padding: "50px 30px", boxShadow: "var(--shadow-lg)" }}>
        <div
          style={{
            fontSize: "72px",
            fontWeight: "800",
            fontFamily: "var(--font-mono)",
            color: "var(--color-primary)",
            lineHeight: "1"
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", marginTop: "12px" }}>
          Bay Not Found
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px", lineHeight: "1.6" }}>
          The parking page or charger coordinates you are looking for do not exist or have been relocated.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "28px" }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return Home
          </Link>
          <Link to="/find-parking" className="btn btn-outline">
            <Search size={16} /> Find Parking
          </Link>
        </div>
      </div>
    </div>
  );
}
