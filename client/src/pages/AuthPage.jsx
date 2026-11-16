/**
 * AuthPage.jsx (Page 9)
 *
 * Requirements:
 * - Tabs for Login and Register
 * - Strict client-side validation
 * - Browser-side password hashing with SHA-256 (Web Crypto API)
 * - Vehicle details input during registration
 * - Clear demo credentials hint
 */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  User,
  Phone,
  Car,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'

  // Login form state
  const [loginEmail, setLoginEmail] = useState("alex@parkvolt.com");
  const [loginPassword, setLoginPassword] = useState("password123");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regVehicleNumber, setRegVehicleNumber] = useState("");
  const [regVehicleModel, setRegVehicleModel] = useState("Tata Nexon EV Max");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      setLoading(false);
      navigate("/find-parking");
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!regName || !regEmail || !regPassword || !regVehicleNumber) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        vehicleNumber: regVehicleNumber,
        vehicleModel: regVehicleModel
      });
      setLoading(false);
      navigate("/find-parking");
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "50px", paddingBottom: "70px", maxWidth: "480px" }}>
      <div className="card" style={{ padding: "36px 30px", boxShadow: "var(--shadow-lg)" }}>
        {/* Brand Icon Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2F6BFF, #12B76A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              margin: "0 auto 12px"
            }}
          >
            <Zap size={26} fill="currentColor" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800" }}>
            {activeTab === "login" ? "Sign In to ParkVolt" : "Create Driver Account"}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
            {activeTab === "login"
              ? "Access your tickets, wallet, and favorite charging hubs."
              : "Register your vehicle to unlock automated gate barrier entry."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px",
            backgroundColor: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "4px",
            marginBottom: "24px"
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setErrorMsg("");
            }}
            className={`btn btn-sm ${activeTab === "login" ? "btn-primary" : "btn-outline"}`}
            style={{ border: "none" }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setErrorMsg("");
            }}
            className={`btn btn-sm ${activeTab === "register" ? "btn-primary" : "btn-outline"}`}
            style={{ border: "none" }}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: "12px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-red-light)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "var(--color-red)",
              fontSize: "13px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* =========================================================================
            LOGIN FORM
        ========================================================================= */}
        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px" }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="alex@parkvolt.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px" }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "10px", padding: "12px" }}
            >
              {loading ? "Authenticating with SHA-256..." : "Sign In to Account"}
            </button>

            {/* Demo Credentials Box */}
            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-subtle)",
                fontSize: "12px",
                color: "var(--text-secondary)",
                border: "1px dashed var(--border-subtle)"
              }}
            >
              <strong>Demo Credentials:</strong>
              <div>Email: <code>alex@parkvolt.com</code></div>
              <div>Password: <code>password123</code></div>
            </div>
          </form>
        ) : (
          /* =========================================================================
              REGISTER FORM
          ========================================================================= */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px" }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Priya Sharma"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px" }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="priya@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Phone size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px" }} />
                <input
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Registration Number</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Car size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px" }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                  value={regVehicleNumber}
                  onChange={(e) => setRegVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="DL 01 AB 1234"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px" }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-green"
              style={{ width: "100%", justifyContent: "center", marginTop: "10px", padding: "12px" }}
            >
              {loading ? "Creating Account..." : "Create Account & Get ₹500 Bonus"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
