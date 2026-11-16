/**
 * App.jsx
 *
 * ParkVolt – Smart Parking & EV Charging Finder
 * React 18 + React Router + CSS Variables + Three.js
 *
 * Routes (All 10 Pages):
 * 1.  /             -> LandingPage (Hero, 3D Island, Search, Stats, How it works, Pricing, FAQ)
 * 2.  /find-parking -> FindParkingPage (Filters, Price slider, Image cards, Opening hours)
 * 3.  /parking/:id  -> ParkingDetailPage (3D Slot picker, time/duration picker, directions)
 * 4.  /find-ev      -> FindEvChargingPage (Connectors Type 2/CCS2/CHAdeMO, speeds, status)
 * 5.  /checkout     -> CheckoutPage (Summary, mock UPI/Card/Wallet, double-booking check)
 * 6.  /ticket/:id   -> BookingTicketPage (QR Code, countdown timer, extend, refund cancel)
 * 7.  /my-bookings  -> MyBookingsPage (Upcoming, active, and past tickets)
 * 8.  /wallet       -> WalletPage (Prepaid balance, top-up, transaction ledger)
 * 9.  /login        -> AuthPage (Login & Register with SHA-256 browser hashing)
 * 10. *             -> NotFoundPage (404 Error handler)
 */
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BottomNav from "./components/layout/BottomNav";
import ToastNotifications from "./components/common/ToastNotifications";

import LandingPage from "./pages/LandingPage";
import FindParkingPage from "./pages/FindParkingPage";
import ParkingDetailPage from "./pages/ParkingDetailPage";
import FindEvChargingPage from "./pages/FindEvChargingPage";
import CheckoutPage from "./pages/CheckoutPage";
import BookingTicketPage from "./pages/BookingTicketPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import WalletPage from "./pages/WalletPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ParkVolt App Error Boundary Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "80px auto", textAlign: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ fontSize: "24px", color: "#EF4444", marginBottom: "16px" }}>Something went wrong</h2>
          <p style={{ color: "#64748B", marginBottom: "24px" }}>
            {this.state.error?.message || "An unexpected error occurred while rendering the page."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px",
              backgroundColor: "#2F6BFF",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Reload ParkVolt
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              {/* Main Application Layout */}
              <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Navbar />

                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/find-parking" element={<FindParkingPage />} />
                    <Route path="/parking/:id" element={<ParkingDetailPage />} />
                    <Route path="/find-ev" element={<FindEvChargingPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/ticket/:id" element={<BookingTicketPage />} />
                    <Route path="/my-bookings" element={<MyBookingsPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/register" element={<AuthPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </main>

                <Footer />
                <BottomNav />
                <ToastNotifications />
              </div>
            </BrowserRouter>
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
