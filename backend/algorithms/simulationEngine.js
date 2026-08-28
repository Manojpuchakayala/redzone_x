const { pilotRegions } = require("../data/disasterData");

function calculateSimulation({
  regionId = "wayanad",
  customLocationData = null,
  rainfallMm = 180,
  hazardType = "multi",
  hazardIntensity = 1.0,
  disabledShelterIds = [],
} = {}) {
  const data = customLocationData || pilotRegions[regionId] || pilotRegions.wayanad;
  const rain = Number(rainfallMm);

  const computedZones = data.zones.map((z) => {
    const slopeScore = Math.min(z.baseSlope / 45, 1.0);
    const rainFactor = Math.min((rain / 280) * 1.2 * hazardIntensity, 1.4);
    const floodScore = Math.min((z.floodRisk / 100) * rainFactor, 1.0);
    const landslideScore = Math.min((z.landslideRisk / 100) * rainFactor, 1.0);
    const cloudburstScore = Math.min((z.cloudburstRisk / 100) * (rain > 200 ? 1.3 : 0.8) * hazardIntensity, 1.0);
    const historyScore = z.disasterHistoryScore / 100;

    let mhi = Number(
      (landslideScore * 0.30 + floodScore * 0.30 + cloudburstScore * 0.15 + slopeScore * 0.15 + historyScore * 0.10).toFixed(2)
    );

    let zoneCategory = "GREEN_ZONE";
    let colorHex = "#10b981";

    if (mhi >= 0.68) {
      zoneCategory = "RED_ZONE";
      colorHex = "#ef4444";
    } else if (mhi >= 0.40) {
      zoneCategory = "ORANGE_ZONE";
      colorHex = "#f59e0b";
    }

    return { ...z, mhi, zoneCategory, colorHex };
  });

  const scoredHabitations = data.habitations.map((h) => {
    const pz = computedZones.find((z) => z.id === h.zoneId) || computedZones[0];
    const fp = h.fingerprint;

    const demographicRatio = (fp.elderly + fp.infants + (fp.women || 0)) / h.population;
    const disabilityRatio = fp.disabilities / h.population;
    const vfs = Number(
      (demographicRatio * 0.30 + disabilityRatio * 0.25 + fp.structuralFragility * 0.25 + fp.accessCutoffRisk * 0.20).toFixed(2)
    );

    const rui = Number(
      (pz.mhi * 0.45 + vfs * 0.35 + (pz.disasterHistoryScore / 100) * 0.20).toFixed(2)
    );

    let urgencyTier = rui >= 0.70 ? "IMMEDIATE" : rui >= 0.50 ? "SHORT_TERM" : "MEDIUM_TERM";

    return { ...h, vfs, rui, urgencyTier, relocationMandatory: urgencyTier === "IMMEDIATE" || urgencyTier === "SHORT_TERM" };
  }).sort((a, b) => b.rui - a.rui).map((h, i) => ({ ...h, priorityRank: i + 1 }));

  return {
    region: data,
    hazardZones: computedZones,
    relocationPriorities: scoredHabitations,
    shelters: data.shelters,
    summary: {
      redZonesCount: computedZones.filter(z => z.zoneCategory === "RED_ZONE").length,
      totalDisplacedPopulation: scoredHabitations.filter(h => h.relocationMandatory).reduce((sum, h) => sum + h.population, 0),
    },
    timestamp: new Date().toISOString(),
  };
}

module.exports = { calculateSimulation };
