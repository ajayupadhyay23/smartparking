const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

/**
 * @desc    Get user profile & registered vehicles
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const vehicles = await Vehicle.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      user,
      vehicles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new vehicle to user profile
 * @route   POST /api/users/vehicles
 * @access  Private
 */
const addVehicle = async (req, res, next) => {
  try {
    const { licensePlate, makeModel, isEV, batteryCapacityKwh, connectorType } = req.body;

    const vehicle = await Vehicle.create({
      user: req.user._id,
      licensePlate,
      makeModel,
      isEV: isEV !== undefined ? isEV : true,
      batteryCapacityKwh: batteryCapacityKwh || 40.5,
      connectorType: connectorType || "CCS-2"
    });

    res.status(201).json({
      success: true,
      message: "Vehicle registered successfully",
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of vehicles owned by current user
 * @route   GET /api/users/vehicles
 * @access  Private
 */
const getUserVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  addVehicle,
  getUserVehicles
};
