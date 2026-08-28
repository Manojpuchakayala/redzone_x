const mongoose = require("mongoose");

const RelocationSiteSchema = new mongoose.Schema({
  siteId: { type: String, required: true, unique: true },
  regionId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: "Primary Transit Hub" },
  coordinates: { type: [Number], required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  safetyScore: { type: Number, default: 90 },
  facilities: {
    medical: { type: Boolean, default: true },
    food: { type: Boolean, default: true },
    water: { type: Boolean, default: true },
    beds: { type: Number, default: 1000 },
    powerBackup: { type: Boolean, default: true },
    accessible: { type: Boolean, default: true },
  },
  address: { type: String, default: "Central Safe Zone" },
  contact: { type: String, default: "+91 11 26701700" },
  status: { type: String, enum: ["ACTIVE", "OVERBURDENED", "OFFLINE"], default: "ACTIVE" },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.RelocationSite || mongoose.model("RelocationSite", RelocationSiteSchema);
