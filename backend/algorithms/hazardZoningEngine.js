const { HAZARD_THRESHOLDS, WEIGHTS } = require("../config/constants");

function computeHazardZoning(zones, simulationParams = {}) {
  const rainfallMm = simulationParams.rainfallMm || 140;
  const soilSaturation = simulationParams.soilSaturation || 0.70;
  const seismicTrigger = simulationParams.seismicTrigger || false;

  return zones.map((zone) => {
    const slopeScore = Math.min(zone.baseSlope / 45, 1.0);
    const rainScore = Math.min((rainfallMm / 280) * soilSaturation * 1.3, 1.0);
    const soilScore = Math.min(zone.soilThickness / 4.0, 1.0) * (1.1 - zone.forestCover * 0.4);
    const drainageScore = Math.max(0, 1.0 - zone.drainageDistance / 300);

    let susceptibilityIndex =
      slopeScore * WEIGHTS.SLOPE +
      rainScore * WEIGHTS.RAINFALL +
      soilScore * WEIGHTS.SOIL_MOISTURE +
      drainageScore * WEIGHTS.DRAINAGE_PROXIMITY;

    if (seismicTrigger && zone.baseSlope > 20) {
      susceptibilityIndex = Math.min(susceptibilityIndex * 1.25, 1.0);
    }

    susceptibilityIndex = Number(susceptibilityIndex.toFixed(3));

    let zoneCategory = "GREEN_ZONE";
    let colorHex = "#10b981";
    let severityLabel = "Low Risk / Safe Zone";
    let actionRecommendation = "Designated safe sanctuary for transit camps.";

    if (susceptibilityIndex >= HAZARD_THRESHOLDS.RED_ZONE) {
      zoneCategory = "RED_ZONE";
      colorHex = "#ef4444";
      severityLabel = "Critical Hazard Zone (Red Zone)";
      actionRecommendation = "Immediate habitation evacuation mandatory. Prohibit structural activity.";
    } else if (susceptibilityIndex >= HAZARD_THRESHOLDS.ORANGE_ZONE) {
      zoneCategory = "ORANGE_ZONE";
      colorHex = "#f59e0b";
      severityLabel = "Moderate Hazard Zone (Orange Zone)";
      actionRecommendation = "High alert. Pre-evacuate vulnerable citizens.";
    }

    return {
      ...zone,
      susceptibilityIndex,
      zoneCategory,
      colorHex,
      severityLabel,
      actionRecommendation,
    };
  });
}

module.exports = { computeHazardZoning };
