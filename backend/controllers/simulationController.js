const { pilotRegions, synthesizeDynamicLocationModel } = require("../data/disasterData");
const { calculateSimulation } = require("../algorithms/simulationEngine");
const Alert = require("../models/Alert");

// High-Speed In-Memory Micro-Cache for Concurrency Protection
let alertsCache = { data: null, lastFetched: 0, TTL: 2000 }; // 2s TTL
let simCache = new Map();

exports.getRegions = (req, res) => {
  try {
    const list = Object.keys(pilotRegions).map(key => ({
      id: key,
      name: pilotRegions[key].name,
      state: pilotRegions[key].state,
      hazardPrimary: pilotRegions[key].hazardPrimary,
      center: pilotRegions[key].center,
    }));
    res.status(200).json({ success: true, count: list.length, regions: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSimulation = (req, res) => {
  try {
    const regionId = req.query.region || "wayanad";
    const rain = Number(req.query.rain || 180);
    const cacheKey = `${regionId}_${rain}`;

    const now = Date.now();
    if (simCache.has(cacheKey) && (now - simCache.get(cacheKey).time < 5000)) {
      return res.status(200).json({ success: true, cached: true, data: simCache.get(cacheKey).data });
    }

    const result = calculateSimulation({ regionId, rainfallMm: rain });
    simCache.set(cacheKey, { time: now, data: result });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.postSimulation = (req, res) => {
  try {
    const { regionId, rainfallMm, hazardType, hazardIntensity, disabledShelterIds, customLocationData } = req.body;
    const result = calculateSimulation({
      regionId,
      customLocationData,
      rainfallMm: Number(rainfallMm || 180),
      hazardType: hazardType || "multi",
      hazardIntensity: Number(hazardIntensity || 1.0),
      disabledShelterIds: disabledShelterIds || [],
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Permanent MongoDB Alert Getter with Micro-Cache Protection
exports.getAlerts = async (req, res) => {
  try {
    const now = Date.now();
    if (alertsCache.data && (now - alertsCache.lastFetched < alertsCache.TTL)) {
      return res.status(200).json({
        success: true,
        source: "MongoDB-MicroCache",
        alerts: alertsCache.data,
      });
    }

    let dbAlerts = [];
    try {
      dbAlerts = await Alert.find().sort({ timestamp: -1 }).limit(100);
    } catch (dbErr) {
      console.warn("DB query error", dbErr.message);
    }

    const formatted = dbAlerts.map(a => ({
      id: a._id.toString(),
      severity: a.severity,
      title: a.title,
      desc: a.description,
      location: a.location,
      channel: "DEOC Master Broadcast (LoRa + Web)",
      timestamp: new Date(a.timestamp).toLocaleTimeString(),
      active: a.active,
      isOfficial: a.title.startsWith('🚨') || a.title.includes('OFFICIAL') || a.severity === 'CRITICAL',
    }));

    alertsCache.data = formatted;
    alertsCache.lastFetched = now;

    return res.status(200).json({
      success: true,
      source: "MongoDB",
      alerts: formatted,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Permanent MongoDB Alert Poster (Invalidates micro-cache instantly)
exports.postAlert = async (req, res) => {
  try {
    const { title, description, location, severity, actionRequired } = req.body;
    if (!title || !location) {
      return res.status(400).json({ success: false, error: "Title and location are required." });
    }

    const newAlert = new Alert({
      title,
      description: description || "Immediate emergency directive issued by incident commander.",
      location,
      severity: severity || "CRITICAL",
      actionRequired: actionRequired || "Follow safe evacuation corridor.",
      active: true,
      timestamp: new Date(),
    });
    const savedAlert = await newAlert.save();

    // Invalidate Cache
    alertsCache.data = null;

    res.status(201).json({
      success: true,
      message: "Alert permanently stored in MongoDB database",
      alert: {
        id: savedAlert._id.toString(),
        severity: savedAlert.severity,
        title: savedAlert.title,
        desc: savedAlert.description,
        location: savedAlert.location,
        channel: "DEOC Master Broadcast (LoRa + Web)",
        timestamp: "Just now (MongoDB Synced)",
        active: savedAlert.active,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Alert
exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Alert.findByIdAndDelete(id);
    } catch (e) {}
    alertsCache.data = null;
    res.status(200).json({ success: true, message: "Alert permanently removed from database" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Clear All Alerts
exports.clearAllAlerts = async (req, res) => {
  try {
    await Alert.deleteMany({});
    alertsCache.data = null;
    res.status(200).json({ success: true, message: "All alerts cleared from database." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.synthesizeLocation = (req, res) => {
  try {
    const { latitude, longitude, locationName } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, error: "Latitude and longitude required" });
    }
    const model = synthesizeDynamicLocationModel(latitude, longitude, locationName || "Custom Incident Zone");
    const result = calculateSimulation({ customLocationData: model });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
