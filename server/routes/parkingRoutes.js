const express = require("express");
const router = express.Router();
const {
  getLocations,
  getLocationById,
  getLocationSlots,
  updateSlotStatus
} = require("../controllers/parkingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getLocations);
router.get("/:id", getLocationById);
router.get("/:id/slots", getLocationSlots);
router.patch("/slots/:id/status", protect, authorize("admin", "operator"), updateSlotStatus);

module.exports = router;
