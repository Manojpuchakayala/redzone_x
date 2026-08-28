const mongoose = require("mongoose");

const HabitationSchema = new mongoose.Schema({
  habitationId: { type: String, required: true, unique: true },
  regionId: { type: String, required: true },
  zoneId: { type: String, required: true },
  name: { type: String, required: true },
  population: { type: Number, required: true },
  coordinates: { type: [Number], required: true },
  fingerprint: {
    elderly: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
    women: { type: Number, default: 0 },
    disabilities: { type: Number, default: 0 },
    medicalDependency: { type: String, default: "Low" },
    structuralFragility: { type: Number, default: 0.5 },
    accessCutoffRisk: { type: Number, default: 0.5 },
    disasterHistory: { type: String, default: "Moderate" },
    criticalInfrastructure: { type: String, default: "Local Access Road" },
  },
  calculatedVfs: { type: Number, default: 0.5 },
  calculatedRui: { type: Number, default: 0.5 },
  urgencyTier: { type: String, enum: ["IMMEDIATE", "SHORT_TERM", "MEDIUM_TERM", "MONITOR"], default: "SHORT_TERM" },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Habitation || mongoose.model("Habitation", HabitationSchema);
