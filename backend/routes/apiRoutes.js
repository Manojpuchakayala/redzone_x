const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/authController");
const {
  getRegions,
  getSimulation,
  postSimulation,
  getAlerts,
  postAlert,
  deleteAlert,
  clearAllAlerts,
  synthesizeLocation
} = require("../controllers/simulationController");

// Auth Endpoints
router.post("/auth/login", login);
router.post("/auth/signup", signup);

// Disaster Core Endpoints
router.get("/regions", getRegions);
router.get("/simulate", getSimulation);
router.post("/simulate", postSimulation);
router.get("/alerts", getAlerts);
router.post("/alerts", postAlert);
router.delete("/alerts/clear-all", clearAllAlerts);
router.delete("/alerts/:id", deleteAlert);
router.post("/location/synthesize", synthesizeLocation);

module.exports = router;
