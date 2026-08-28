const mongoose = require("mongoose");

const HazardZoneSchema = new mongoose.Schema({
  zoneId: { type: String, required: true, unique: true },
  regionId: { type: String, required: true },
  name: { type: String, required: true },
  baseSlope: { type: Number, required: true },
  soilType: { type: String, required: true },
  soilThickness: { type: Number, default: 2.0 },
  drainageDistance: { type: Number, default: 50 },
  floodRisk: { type: Number, default: 50 },
  landslideRisk: { type: Number, default: 50 },
  cloudburstRisk: { type: Number, default: 50 },
  disasterHistoryScore: { type: Number, default: 50 },
  coordinates: { type: [[Number]], required: true },
  zoneCategory: { type: String, enum: ["RED_ZONE", "ORANGE_ZONE", "GREEN_ZONE"], default: "ORANGE_ZONE" },
  mhiScore: { type: Number, default: 0.5 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.HazardZone || mongoose.model("HazardZone", HazardZoneSchema);
