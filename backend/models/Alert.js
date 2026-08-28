const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  alertId: { type: String, default: () => `ALT-${Date.now().toString().slice(-6)}` },
  severity: { type: String, enum: ["CRITICAL", "HIGH", "MODERATE", "ADVISORY"], default: "HIGH" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  actionRequired: { type: String, required: true },
  active: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
