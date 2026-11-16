const ChargingSession = require("../models/ChargingSession");
const ParkingSlot = require("../models/ParkingSlot");

/**
 * @desc    Start an EV Charging session
 * @route   POST /api/charging/start
 * @access  Private
 */
const startSession = async (req, res, next) => {
  try {
    const { parkingSlotId, startSoc = 25, targetSoc = 80 } = req.body;

    const slot = await ParkingSlot.findById(parkingSlotId);
    if (!slot || !slot.type.startsWith("ev")) {
      return res.status(400).json({
        success: false,
        message: "Specified slot is not an active EV charging bay."
      });
    }

    const sessionId = `CS-${Math.floor(1000 + Math.random() * 9000)}`;

    const session = await ChargingSession.create({
      sessionId,
      user: req.user._id || req.user.id,
      parkingSlot: parkingSlotId,
      startSoc,
      currentSoc: startSoc,
      targetSoc,
      currentPowerKw: slot.powerKw || 120,
      voltage: 440,
      currentAmperes: 270,
      status: "active"
    });

    res.status(201).json({
      success: true,
      message: "EV Fast Charging Session initiated",
      session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get real-time telemetry metrics for a charging session
 * @route   GET /api/charging/:id/telemetry
 * @access  Private
 */
const getSessionTelemetry = async (req, res, next) => {
  try {
    const session = await ChargingSession.findOne({ sessionId: req.params.id })
      .populate("parkingSlot", "slotNumber powerKw");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Charging session not found"
      });
    }

    res.status(200).json({
      success: true,
      telemetry: {
        sessionId: session.sessionId,
        currentSoc: session.currentSoc,
        powerKw: session.currentPowerKw,
        energyDeliveredKwh: session.energyDeliveredKwh,
        voltage: session.voltage,
        currentAmperes: session.currentAmperes,
        status: session.status,
        updatedAt: session.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Stop active charging session
 * @route   POST /api/charging/:id/stop
 * @access  Private
 */
const stopSession = async (req, res, next) => {
  try {
    const session = await ChargingSession.findOne({ sessionId: req.params.id });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Charging session not found"
      });
    }

    session.status = "completed";
    session.currentPowerKw = 0;
    session.currentAmperes = 0;
    await session.save();

    res.status(200).json({
      success: true,
      message: "Charging session concluded safely. Connector lock released.",
      session
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startSession,
  getSessionTelemetry,
  stopSession
};
