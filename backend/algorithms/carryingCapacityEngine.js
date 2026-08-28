const { CAPACITY_LIMITS } = require("../config/constants");

function computeCarryingCapacity(zones, habitations) {
  return zones.map((zone) => {
    const zoneHabitations = habitations.filter((h) => h.zoneId === zone.id);
    const totalPopulation = zoneHabitations.reduce((sum, h) => sum + h.population, 0);
    const totalBuildings = zoneHabitations.reduce((sum, h) => sum + h.buildingCount, 0);

    const areaSqMeters = zone.totalAreaSqKm * 1000000;
    const safeLandFraction = Math.max(0.1, 1.0 - (zone.baseSlope / 50) * 0.85);
    const effectiveSafeLandSqMeters = areaSqMeters * safeLandFraction;

    const baseMaxSafeDensity = 0.012; // 120 persons per safe hectare
    const maxPermissiblePopulation = Math.floor(effectiveSafeLandSqMeters * baseMaxSafeDensity);
    const slopeStrainFactor = 1.0 + (zone.baseSlope > 25 ? (zone.baseSlope - 25) * 0.04 : 0);

    const effectiveLoad = Math.max(1, totalPopulation * slopeStrainFactor);
    let cci = Number((maxPermissiblePopulation / effectiveLoad).toFixed(2));

    let status = "SAFE";
    let statusLabel = "Within Ecological Capacity";
    let statusColor = "#10b981";

    if (cci < CAPACITY_LIMITS.CRITICAL_CCI || zone.zoneCategory === "RED_ZONE") {
      status = "OVERBURDENED";
      statusLabel = "Critically Overburdened (Capacity Exceeded)";
      statusColor = "#ef4444";
    } else if (cci < CAPACITY_LIMITS.WARNING_CCI || zone.zoneCategory === "ORANGE_ZONE") {
      status = "THRESHOLD";
      statusLabel = "Threshold Approaching (Freeze Expansion)";
      statusColor = "#f59e0b";
    }

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      totalPopulation,
      totalBuildings,
      maxPermissiblePopulation,
      carryingCapacityIndex: cci,
      status,
      statusLabel,
      statusColor,
      slopeStrainFactor: Number(slopeStrainFactor.toFixed(2)),
      safeHabitableLandPercent: Math.round(safeLandFraction * 100),
    };
  });
}

module.exports = { computeCarryingCapacity };
