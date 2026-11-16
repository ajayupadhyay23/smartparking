const parkingService = require("../services/parkingService");

/**
 * @desc    Get all parking hubs with filters
 * @route   GET /api/parking
 * @access  Public
 */
const getLocations = async (req, res, next) => {
  try {
    const locations = await parkingService.searchLocations(req.query);
    res.status(200).json({
      success: true,
      count: locations.length,
      locations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single parking hub details by ID
 * @route   GET /api/parking/:id
 * @access  Public
 */
const getLocationById = async (req, res, next) => {
  try {
    const location = await parkingService.getLocationById(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Parking location not found"
      });
    }

    res.status(200).json({
      success: true,
      location
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get slots for a specific location & floor
 * @route   GET /api/parking/:id/slots
 * @access  Public
 */
const getLocationSlots = async (req, res, next) => {
  try {
    const { floor } = req.query;
    const slots = await parkingService.getLocationSlots(req.params.id, floor);
    res.status(200).json({
      success: true,
      count: slots.length,
      slots
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update slot status (IoT / Admin override)
 * @route   PATCH /api/parking/slots/:id/status
 * @access  Private (Admin / Operator)
 */
const updateSlotStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updatedSlot = await parkingService.updateSlotStatus(req.params.id, status);

    if (!updatedSlot) {
      return res.status(404).json({
        success: false,
        message: "Parking slot not found"
      });
    }

    // Broadcast change via Socket.IO if available
    const io = req.app.get("io");
    if (io) {
      io.to(updatedSlot.location.toString()).emit("slot:status_changed", {
        slotId: updatedSlot._id,
        slotNumber: updatedSlot.slotNumber,
        status: updatedSlot.status
      });
    }

    res.status(200).json({
      success: true,
      message: "Slot status updated successfully",
      slot: updatedSlot
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLocations,
  getLocationById,
  getLocationSlots,
  updateSlotStatus
};
