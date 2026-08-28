const { pilotRegions } = require("../data/disasterData");
const User = require("../models/User");
const HazardZone = require("../models/HazardZone");
const Habitation = require("../models/Habitation");
const RelocationSite = require("../models/RelocationSite");
const Alert = require("../models/Alert");

async function autoSeedDatabase() {
  try {
    // 1. Seed Demo Admin & Operator Users if not existing
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        {
          name: "Commander R. Sharma",
          email: "ops.ndrf@gov.in",
          password: "password123",
          role: "Emergency Operator",
          organization: "National Disaster Response Force (NDRF)",
        },
        {
          name: "Dr. A. Verma",
          email: "director@ndma.gov.in",
          password: "password123",
          role: "Disaster Management Officer",
          organization: "National Disaster Management Authority (NDMA)",
        },
      ]);
      console.log("🌱 Database seeded with initial emergency responders.");
    }

    // 2. Seed Pilot Jurisdictions Data
    const zoneCount = await HazardZone.countDocuments();
    if (zoneCount === 0) {
      for (const regKey of Object.keys(pilotRegions)) {
        const reg = pilotRegions[regKey];

        // Seed Zones
        for (const z of reg.zones || []) {
          await HazardZone.create({
            zoneId: z.id,
            regionId: reg.id,
            name: z.name,
            baseSlope: z.baseSlope,
            soilType: z.soilType,
            soilThickness: z.soilThickness || 2.0,
            drainageDistance: z.drainageDistance || 50,
            floodRisk: z.floodRisk || 50,
            landslideRisk: z.landslideRisk || 50,
            cloudburstRisk: z.cloudburstRisk || 50,
            disasterHistoryScore: z.disasterHistoryScore || 50,
            coordinates: z.coordinates,
          });
        }

        // Seed Habitations
        for (const h of reg.habitations || []) {
          await Habitation.create({
            habitationId: h.id,
            regionId: reg.id,
            zoneId: h.zoneId,
            name: h.name,
            population: h.population,
            coordinates: h.coordinates,
            fingerprint: h.fingerprint,
          });
        }

        // Seed Shelters
        for (const s of reg.shelters || []) {
          await RelocationSite.create({
            siteId: s.id,
            regionId: reg.id,
            name: s.name,
            type: s.type,
            coordinates: s.coordinates,
            capacity: s.capacity,
            occupied: s.occupied || 0,
            safetyScore: s.safetyScore || 90,
            facilities: s.facilities,
            address: s.address,
            contact: s.contact,
          });
        }
      }
      console.log("🌱 Database seeded with pilot regional hazard data.");
    }

    // 3. Seed Alerts
    const alertCount = await Alert.countDocuments();
    if (alertCount === 0) {
      await Alert.create([
        {
          severity: "CRITICAL",
          title: "Pore-Water Saturation Exceeded in Chooralmala Upper Sector",
          description: "Slope instability sensors indicate high probability of debris failure.",
          location: "Chooralmala (WZ-01), Wayanad",
          actionRequired: "Immediate Evacuation mandatory (0-6 hours)",
        },
        {
          severity: "HIGH",
          title: "Meppadi Transit Hub Approaching 85% Carrying Capacity Threshold",
          description: "Relocation allocation engine activated secondary split redirection.",
          location: "Meppadi Sector, Kerala",
          actionRequired: "Divert convoy to Kalpetta Sanctuary",
        },
      ]);
    }
  } catch (err) {
    console.warn("Seeding bypassed in local memory mode:", err.message);
  }
}

module.exports = { autoSeedDatabase };
