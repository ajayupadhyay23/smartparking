/**
 * CheckoutPage.jsx (Page 5)
 *
 * Requirements:
 * - Booking summary: Location, Slot code, Start/End times, Duration, Rate, GST
 * - Mock payment methods: UPI (Google Pay, PhonePe), Card (Visa/Mastercard), ParkVolt Wallet
 * - Rigorous form validation for each method (e.g. valid VPA, card number length, CVV)
 * - Prominent "Demo payment" badge / label
 * - Success animation with confetti and countdown redirect to Booking Ticket
 * - Double-booking re-verification right before payment confirmation
 */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Wallet,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const { currentUser, updateWalletBalance } = useAuth();

  // Load pending checkout payload from sessionStorage
  const [checkoutData, setCheckoutData] = useState(() => {
    const saved = sessionStorage.getItem("parkvolt_pending_checkout");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi', 'card', 'wallet'
  const [upiId, setUpiId] = useState("alex@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 8921 7321 9012");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("892");
  const [vehicleNumber, setVehicleNumber] = useState(
    currentUser?.vehicleNumber || "DL 01 EV 9876"
  );

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);

  if (!checkoutData) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div className="card" style={{ maxWidth: "480px", margin: "0 auto", padding: "40px" }}>
          <AlertCircle size={40} color="var(--color-amber)" style={{ margin: "0 auto 12px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "700" }}>No pending reservation</h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px" }}>
            Please select a parking location and bay slot first.
          </p>
          <Link to="/find-parking" className="btn btn-primary" style={{ marginTop: "20px" }}>
            Explore Parking Hubs
          </Link>
        </div>
      </div>
    );
  }

  // Form validation
  const validateForm = () => {
    const errs = {};
    if (!vehicleNumber.trim()) {
      errs.vehicleNumber = "Vehicle license plate number is required";
    }

    if (paymentMethod === "upi") {
      if (!upiId || !upiId.includes("@")) {
        errs.upiId = "Enter a valid UPI ID (e.g. yourname@okhdfcbank)";
      }
    } else if (paymentMethod === "card") {
      const cleanNum = cardNumber.replace(/\s+/g, "");
      if (cleanNum.length < 16) {
        errs.cardNumber = "Enter a 16-digit card number";
      }
      if (!cardExpiry.includes("/") || cardExpiry.length < 5) {
        errs.cardExpiry = "Expiry must be in MM/YY format";
      }
      if (cardCvv.length < 3) {
        errs.cardCvv = "CVV must be 3 digits";
      }
    } else if (paymentMethod === "wallet") {
      if (currentUser.walletBalance < checkoutData.pricing.total) {
        errs.wallet = `Insufficient wallet balance (Available: ₹${currentUser.walletBalance}). Please top-up or use UPI.`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePayNow = () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    setTimeout(() => {
      try {
        // Double-booking check runs inside createBooking()
        const booking = createBooking({
          location: { id: checkoutData.locationId, name: checkoutData.locationName, address: checkoutData.locationAddress },
          slot: checkoutData.slot,
          startTime: checkoutData.startTime,
          durationMinutes: checkoutData.durationMinutes,
          pricing: checkoutData.pricing,
          paymentMethod:
            paymentMethod === "upi"
              ? `UPI (${upiId})`
              : paymentMethod === "card"
              ? `Card (ending in ${cardNumber.slice(-4)})`
              : "ParkVolt Prepaid Wallet",
          vehicleNumber: vehicleNumber.toUpperCase()
        });

        // If paid via wallet, deduct balance
        if (paymentMethod === "wallet") {
          updateWalletBalance(currentUser.walletBalance - checkoutData.pricing.total);
        }

        // Clean up pending session
        sessionStorage.removeItem("parkvolt_pending_checkout");
        setConfirmedBookingId(booking.id);
        setIsProcessing(false);
        setPaymentSuccess(true);
      } catch (err) {
        setIsProcessing(false);
        setErrors({ general: err.message });
      }
    }, 1200);
  };

  return (
    <div className="container" style={{ paddingTop: "40px", paddingBottom: "70px", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span className="badge badge-blue">Secure Checkout</span>
          <span className="badge badge-amber" style={{ fontWeight: "700" }}>
            🔒 Demo Payment Sandbox
          </span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: "800" }}>Review & Pay</h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Your bay is held for the next 10 minutes while you complete this reservation.
        </p>
      </div>

      {/* Main Grid: Summary & Payment Options */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "28px"
        }}
        className="checkout-grid"
      >
        {/* Success Modal / State */}
        {paymentSuccess ? (
          <div className="card" style={{ padding: "48px 32px", textAlign: "center" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "var(--color-green-light)",
                color: "var(--color-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px"
              }}
            >
              <CheckCircle2 size={44} />
            </div>

            <span className="badge badge-green" style={{ fontSize: "12px", marginBottom: "8px" }}>
              Payment Verified
            </span>
            <h2 style={{ fontSize: "26px", fontWeight: "800" }}>Reservation Confirmed!</h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "420px", margin: "6px auto 24px" }}>
              Slot <strong style={{ color: "var(--color-primary)" }}>{checkoutData.slot.code}</strong> at {checkoutData.locationName} is locked.
            </p>

            <button
              type="button"
              onClick={() => navigate(`/ticket/${confirmedBookingId}`)}
              className="btn btn-primary btn-lg"
              style={{ margin: "0 auto" }}
            >
              View Ticket & QR Pass <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <>
            {/* General Double-Booking or Conflict Error Alert */}
            {errors.general && (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-red-light)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "var(--color-red)",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <AlertCircle size={20} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Left Card: Summary */}
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "16px" }}>
                Reservation Particulars
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Facility:</span>
                  <span style={{ fontWeight: "700" }}>{checkoutData.locationName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Designated Bay:</span>
                  <span style={{ fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
                    {checkoutData.slot.code}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Duration:</span>
                  <span style={{ fontWeight: "600" }}>{checkoutData.durationMinutes} Minutes</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Start Time:</span>
                  <span style={{ fontWeight: "600" }}>{new Date(checkoutData.startTime).toLocaleString()}</span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border-subtle)",
                    paddingTop: "12px",
                    marginTop: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "17px",
                    fontWeight: "800"
                  }}
                >
                  <span>Total Amount (incl. 18% GST):</span>
                  <span style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
                    ₹{checkoutData.pricing.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Vehicle & Payment Options */}
            <div className="card" style={{ padding: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "18px" }}>
                Driver Details & Payment Method
              </h3>

              {/* Vehicle Number */}
              <div className="form-group">
                <label className="form-label">Vehicle Registration Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. DL 01 EV 9876"
                />
                {errors.vehicleNumber && <div className="form-error">{errors.vehicleNumber}</div>}
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label" style={{ display: "block", marginBottom: "8px" }}>
                  Select Payment Option (Mock Sandbox)
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`btn ${paymentMethod === "upi" ? "btn-primary" : "btn-outline"}`}
                    style={{ padding: "12px", fontSize: "13px" }}
                  >
                    <Smartphone size={16} /> UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`btn ${paymentMethod === "card" ? "btn-primary" : "btn-outline"}`}
                    style={{ padding: "12px", fontSize: "13px" }}
                  >
                    <CreditCard size={16} /> Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`btn ${paymentMethod === "wallet" ? "btn-primary" : "btn-outline"}`}
                    style={{ padding: "12px", fontSize: "13px" }}
                  >
                    <Wallet size={16} /> Wallet
                  </button>
                </div>
              </div>

              {/* Conditional Payment Fields */}
              {paymentMethod === "upi" && (
                <div className="form-group" style={{ padding: "14px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-subtle)" }}>
                  <label className="form-label">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                  />
                  {errors.upiId && <div className="form-error">{errors.upiId}</div>}
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                    Demo handles instant simulated approval for all Google Pay / PhonePe VPAs.
                  </p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div style={{ padding: "16px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-subtle)", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 8921 7321 9012"
                    />
                    {errors.cardNumber && <div className="form-error">{errors.cardNumber}</div>}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                      />
                      {errors.cardExpiry && <div className="form-error">{errors.cardExpiry}</div>}
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        className="form-input"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                      />
                      {errors.cardCvv && <div className="form-error">{errors.cardCvv}</div>}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div style={{ padding: "16px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600" }}>Current Wallet Balance:</span>
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>
                      ₹{currentUser.walletBalance}
                    </span>
                  </div>
                  {errors.wallet && <div className="form-error" style={{ marginTop: "8px" }}>{errors.wallet}</div>}
                </div>
              )}

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="btn btn-primary btn-lg"
                style={{ width: "100%", justifyContent: "center", marginTop: "24px" }}
              >
                {isProcessing ? "Verifying & Locking Bay..." : `Pay ₹${checkoutData.pricing.total} (Demo)`}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)", marginTop: "12px" }}>
                <Lock size={12} />
                <span>Simulated sandbox payment. No actual debit occurs.</span>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (min-width: 860px) {
          .checkout-grid {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
      `}</style>
    </div>
  );
}
