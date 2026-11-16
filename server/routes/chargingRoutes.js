const express = require("express");
const router = express.Router();
const {
  startSession,
  getSessionTelemetry,
  stopSession
} = require("../controllers/chargingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/start", protect, startSession);
router.get("/:id/telemetry", protect, getSessionTelemetry);
router.post("/:id/stop", protect, stopSession);

module.exports = router;
