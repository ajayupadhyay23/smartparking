/**
 * Dynamic Pricing Calculator for ParkVolt
 * Computes slot base tariff, EV power fee, duration multiplier, convenience fee, and GST.
 *
 * @param {number} ratePerHour - Base hourly tariff of the parking slot
 * @param {number} durationMinutes - Duration of booking in minutes
 * @param {number} powerKw - EV Charger power rating (0 for standard parking)
 * @returns {object} - Price breakdown and total amount
 */
const calculatePrice = (ratePerHour, durationMinutes, powerKw = 0) => {
  const durationHours = Math.max(1, Math.ceil(durationMinutes / 60));
  const baseSlotCost = ratePerHour * durationHours;

  // EV charging surcharge based on power kW
  let evPowerFee = 0;
  if (powerKw >= 100) {
    evPowerFee = 40 * durationHours; // Ultra-fast charging premium
  } else if (powerKw > 0) {
    evPowerFee = 20 * durationHours; // Standard fast charging
  }

  const convenienceFee = 15;
  const subtotal = baseSlotCost + evPowerFee + convenienceFee;
  const gstAmount = Number((subtotal * 0.18).toFixed(2));
  const totalAmount = Math.round(subtotal + gstAmount);

  return {
    durationHours,
    baseSlotCost,
    evPowerFee,
    convenienceFee,
    gstAmount,
    totalAmount
  };
};

module.exports = calculatePrice;
