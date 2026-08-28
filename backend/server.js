const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, getStatus } = require("./config/db");
const { autoSeedDatabase } = require("./services/seedService");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health & diagnostic check for Render port scanner
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ONLINE",
    service: "RED-ZONE X Emergency Backend API",
    version: "2.5.0",
    docs: "/api/health"
  });
});

app.use("/api", apiRoutes);

// Health Endpoint with Database Telemetry
app.get("/api/health", (req, res) => {
  const dbStatus = getStatus();
  res.status(200).json({
    status: "ONLINE",
    platform: "RED-ZONE X : Intelligent Multi-Hazard Risk & Relocation Platform",
    version: "2.5.0",
    engine: "Node.js / Express Client-Sync AI Engine",
    database: {
      connected: dbStatus.isConnected,
      mode: dbStatus.dbMode,
    },
    jurisdictions: [
      "Wayanad (Meppadi - Chooralmala Basin), Kerala",
      "Joshimath (Subsidence Core), Uttarakhand",
      "Visakhapatnam (Coastal Lowlands), Andhra Pradesh",
      "Mandi (Beas Flood Basin), Himachal Pradesh"
    ],
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5001;

// Start server immediately on 0.0.0.0 so Render detects port binding in <1s
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 RED-ZONE X Backend running on 0.0.0.0:${PORT}`);
});

// Connect to MongoDB Atlas asynchronously
(async () => {
  try {
    await connectDB();
    await autoSeedDatabase();
  } catch (err) {
    console.warn("Async DB Init Warning:", err.message);
  }
})();

module.exports = app;
