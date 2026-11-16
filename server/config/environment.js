const dotenv = require("dotenv");
const path = require("path");

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, "../.env") });

/**
 * Environment Configuration
 * Centralized, validated environment configuration for ParkVolt.
 */
module.exports = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/parkvolt_db",
  JWT_SECRET: process.env.JWT_SECRET || "parkvolt_fallback_jwt_secret_key_2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_test_parkvolt_key",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_parkvolt_key",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000"
};
