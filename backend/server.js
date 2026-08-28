const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, getStatus } = require("./config/db");
const { autoSeedDatabase } = require("./services/seedService");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

let PORT = parseInt(process.env.PORT, 10) || 5001;

async function bootstrap() {
  await connectDB();
  await autoSeedDatabase();

  const server = app.listen(PORT, () => {
    console.log(`🚀 RED-ZONE X Backend & Database Engine running at http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${PORT} is already in use. Retrying on port ${PORT + 1}...`);
      PORT += 1;
      server.listen(PORT);
    } else {
      console.error('Server error:', err);
    }
  });
}

bootstrap();
