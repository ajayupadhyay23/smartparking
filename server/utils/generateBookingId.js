const crypto = require("crypto");

/**
 * Generate Unique Human-Readable Booking Reference ID
 * Format: PV-XXXXX (e.g. PV-72819)
 */
const generateBookingId = () => {
  const randomNum = crypto.randomInt(10000, 99999);
  return `PV-${randomNum}`;
};

module.exports = generateBookingId;
