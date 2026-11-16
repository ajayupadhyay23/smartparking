const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const env = require("./config/environment");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Import Route Handlers
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chargingRoutes = require("./routes/chargingRoutes");

const app = express();

// Global Middlewares
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// System Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    system: "ParkVolt Real-Time Backend API Engine",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Mount Domain Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/charging", chargingRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
