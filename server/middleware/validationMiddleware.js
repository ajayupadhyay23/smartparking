/**
 * Request Validation Middleware
 * Checks required fields before controllers execute
 */
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields: name, email, and password."
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password to authenticate."
    });
  }
  next();
};

const validateBooking = (req, res, next) => {
  const { parkingLocationId, parkingSlotId, startTime, duration } = req.body;
  if (!parkingLocationId || !parkingSlotId) {
    return res.status(400).json({
      success: false,
      message: "parkingLocationId and parkingSlotId are required to reserve a bay."
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateBooking
};
