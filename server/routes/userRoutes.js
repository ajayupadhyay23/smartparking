const express = require("express");
const router = express.Router();
const { getProfile, addVehicle, getUserVehicles } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, getProfile);
router.post("/vehicles", protect, addVehicle);
router.get("/vehicles", protect, getUserVehicles);

module.exports = router;
