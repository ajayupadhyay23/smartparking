/**
 * WalletPage.jsx (Page 8)
 *
 * Requirements:
 * - Current balance in INR
 * - Instant Top-Up with validation (₹100, ₹500, ₹1000 quick chips or custom)
 * - Complete transaction ledger with timestamps and credits/debits
 */
import React, { useState } from "react";
import {
  Wallet,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";

export default function WalletPage() {
  const { currentUser, updateWalletBalance } = useAuth();
  const { transactions, topUpWallet } = useBooking();

  const [topUpAmount, setTopUpAmount] = useState(500);
  const [paymentSource, setPaymentSource] = useState("UPI (Google Pay)");
  const [successMsg, setSuccessMsg] = useState("");

  const handleTopUpSubmit = (e) => {
    e.preventDefault();
    if (!topUpAmount || topUpAmount < 50) {
      alert("Minimum top-up amount is ₹50.");
      return;
    }

    topUpWallet(topUpAmount, paymentSource, (amt) => {
      updateWalletBalance(currentUser.walletBalance + amt);
    });

    setSuccessMsg(`Successfully added ₹${topUpAmount} to your wallet!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="container" style={{ paddingTop: "40px", paddingBottom: "70px", maxWidth: "860px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <span className="badge badge-blue">Prepaid Wallet</span>
        <h1 style={{ fontSize: "30px", fontWeight: "800", marginTop: "6px" }}>
          Digital Wallet & Credits
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Enjoy 1-click contactless payments at automated exit gates and EV superchargers.
        </p>
      </div>

      {/* Balance & Top-Up Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "28px",
          marginBottom: "36px"
        }}
        className="wallet-grid"
      >
        {/* Balance Card */}
        <div
          className="card"
          style={{
            padding: "32px",
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            color: "#FFF",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "220px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span className="badge" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", color: "#FFF" }}>
                ParkVolt Cash
              </span>
              <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: "12px" }}>Available Balance</div>
              <div style={{ fontSize: "42px", fontWeight: "800", fontFamily: "var(--font-mono)", color: "#38BDF8" }}>
                ₹{currentUser ? currentUser.walletBalance : 0}
              </div>
            </div>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "rgba(47, 107, 255, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={24} color="#38BDF8" />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#94A3B8" }}>
            <span>Account Holder: {currentUser ? currentUser.name : "Guest Driver"}</span>
            <span>Fast Auto-Debit Ready</span>
          </div>
        </div>

        {/* Top-Up Form Card */}
        <div className="card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "14px" }}>
            Top-Up Wallet Balance
          </h3>

          {successMsg && (
            <div style={{ padding: "12px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-green-light)", color: "var(--color-green)", fontSize: "13px", fontWeight: "600", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          <form onSubmit={handleTopUpSubmit}>
            <div className="form-group">
              <label className="form-label">Select Amount (INR ₹)</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                {[200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`btn btn-sm ${topUpAmount === amt ? "btn-primary" : "btn-outline"}`}
                    style={{ flex: 1, fontFamily: "var(--font-mono)" }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="50"
                step="50"
                className="form-input"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                placeholder="Custom amount (min ₹50)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Source</label>
              <select
                className="form-input"
                value={paymentSource}
                onChange={(e) => setPaymentSource(e.target.value)}
              >
                <option value="UPI (Google Pay)">UPI (Google Pay / PhonePe)</option>
                <option value="Debit Card (HDFC Visa)">Debit Card (HDFC Visa)</option>
                <option value="NetBanking (ICICI)">NetBanking</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              <PlusCircle size={16} /> Add ₹{topUpAmount} to Wallet
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "18px" }}>
          Transaction History
        </h3>

        {transactions.length === 0 ? (
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No transactions yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {transactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  fontSize: "13px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: tx.type === "credit" ? "var(--color-green-light)" : "var(--color-red-light)",
                      color: tx.type === "credit" ? "var(--color-green)" : "var(--color-red)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {tx.type === "credit" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700" }}>{tx.title}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {new Date(tx.date).toLocaleDateString()} at {new Date(tx.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: "800",
                    fontSize: "15px",
                    color: tx.type === "credit" ? "var(--color-green)" : "var(--color-red)"
                  }}
                >
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 820px) {
          .wallet-grid {
            grid-template-columns: 1fr 1.1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
