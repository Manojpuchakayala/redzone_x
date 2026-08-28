const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organization: { type: String, default: "National Disaster Management Authority (NDMA)" },
  role: {
    type: String,
    enum: ["Emergency Operator", "Disaster Management Officer", "Administrator", "Field Responder"],
    default: "Emergency Operator",
  },
  badgeId: { type: String, default: () => `NDMA-${Math.floor(1000 + Math.random() * 9000)}` },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
