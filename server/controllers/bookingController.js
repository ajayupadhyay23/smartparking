const bookingService = require("../services/bookingService");
const notificationService = require("../services/notificationService");

/**
 * @desc    Create a new slot booking
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = async (req, res, next) => {
  try {
    const { parkingLocationId, parkingSlotId, vehicleNumber, startTime, duration } = req.body;

    const booking = await bookingService.createReservation({
      userId: req.user._id || req.user.id,
      locationId: parkingLocationId,
      slotId: parkingSlotId,
      vehicleNumber,
      startTime,
      durationMinutes: duration || 120
    });

    // Broadcast real-time slot update to facility room
    const io = req.app.get("io");
    if (io) {
      io.to(parkingLocationId.toString()).emit("slot:status_changed", {
        slotId: parkingSlotId,
        status: "reserved"
      });
    }

    // Dispatch async notification
    notificationService.sendBookingConfirmation(req.user, booking);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings for current user
 * @route   GET /api/bookings/my
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user._id || req.user.id);
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booking
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelReservation(
      req.params.id,
      req.user._id || req.user.id
    );

    // Broadcast slot release to room
    const io = req.app.get("io");
    if (io && booking.parkingLocation) {
      io.to(booking.parkingLocation.toString()).emit("slot:status_changed", {
        slotId: booking.parkingSlot,
        status: "available"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking successfully cancelled and slot released",
      booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking
};
