import { wayanadData } from "../data/wayanadData.js";
import { joshimathData } from "../data/joshimathData.js";

const datasets = {
  wayanad: wayanadData,
  joshimath: joshimathData,
};

export async function runSimulationApi(params = {}) {
  const regionId = params.region || "wayanad";
  const rawData = datasets[regionId] || datasets.wayanad;
  const rain = Number(params.rainfallMm || 180);

  // 1. Dynamic Hazard Re-Zoning Algorithm
  const computedZones = rawData.zones.map((z) => {
    const slopeScore = Math.min(z.baseSlope / 45, 1.0);
    const rainScore = Math.min((rain / 280) * 0.75 * 1.3, 1.0);
    const soilScore = Math.min(z.soilThickness / 4.0, 1.0);
    const drainageScore = Math.max(0, 1.0 - z.drainageDistance / 300);

    const risk = Number(
      (slopeScore * 0.35 + rainScore * 0.30 + soilScore * 0.20 + drainageScore * 0.15).toFixed(2)
    );

    let zoneCategory = "GREEN_ZONE";
    let colorHex = "#10b981";
    let severityLabel = "Low Risk / Safe Zone";

    if (risk >= 0.65) {
      zoneCategory = "RED_ZONE";
      colorHex = "#ef4444";
      severityLabel = "Critical Hazard Zone (Red Zone)";
    } else if (risk >= 0.38) {
      zoneCategory = "ORANGE_ZONE";
      colorHex = "#f59e0b";
      severityLabel = "Moderate Hazard Zone (Orange Zone)";
    }

    return {
      ...z,
      susceptibilityIndex: risk,
      zoneCategory,
      colorHex,
      severityLabel,
    };
  });

  // 2. Carrying Capacity Index (CCI)
  const computedCapacity = computedZones.map((z) => {
    const cci = Number(
      Math.max(0.2, (z.zoneCategory === "RED_ZONE" ? 0.42 : z.zoneCategory === "ORANGE_ZONE" ? 0.85 : 1.65) * (1.2 - (rain / 400))).toFixed(2)
    );
    const isOverburdened = cci < 0.8 || z.zoneCategory === "RED_ZONE";

    return {
      zoneId: z.id,
      zoneName: z.name,
      carryingCapacityIndex: cci,
      status: isOverburdened ? "OVERBURDENED" : cci < 1.1 ? "THRESHOLD" : "SAFE",
      statusLabel: isOverburdened ? "Critically Overburdened" : cci < 1.1 ? "Threshold Approaching" : "Sustainable Sanctuary",
      totalPopulation: 1400,
      maxPermissiblePopulation: 2800,
    };
  });

  // 3. Vulnerability Priority Relocation Scoring (VPS)
  const scoredHabitations = rawData.habitations.map((h, i) => {
    const pz = computedZones.find((z) => z.id === h.zoneId) || computedZones[0];
    const isRed = pz.zoneCategory === "RED_ZONE";
    const vps = Number(
      ((pz.susceptibilityIndex * 0.40) + (h.structuralFragility * 0.30) + (h.vulnerablePopRatio * 0.20) + (rain / 3500)).toFixed(2)
    );

    const assignedRoute = rawData.evacuationRoutes.find((r) => r.fromHabitationId === h.id);
    const assignedShelter = rawData.reliefShelters.find((s) => s.id === assignedRoute?.toShelterId) || rawData.reliefShelters[0];

    return {
      ...h,
      priorityRank: i + 1,
      vulnerabilityPriorityScore: vps,
      relocationMandatory: isRed || vps >= 0.65,
      urgencyLevel: isRed || vps >= 0.65 ? "CRITICAL (PRIORITY 1)" : vps >= 0.45 ? "HIGH (PRIORITY 2)" : "MODERATE",
      assignedRoute,
      assignedShelter,
      evacuationLogistics: {
        busesRequired: Math.ceil(h.population / 40),
        ambulancesRequired: Math.ceil((h.population * h.vulnerablePopRatio) / 8),
      },
      explainWhy: `${pz.name} has a steep ${pz.baseSlope}° slope with ${Math.round(h.vulnerablePopRatio * 100)}% elderly/infants. Fragility: ${Math.round(h.structuralFragility * 100)}%.`,
    };
  }).sort((a, b) => b.vulnerabilityPriorityScore - a.vulnerabilityPriorityScore);

  const redCount = computedZones.filter((z) => z.zoneCategory === "RED_ZONE").length;
  const orangeCount = computedZones.filter((z) => z.zoneCategory === "ORANGE_ZONE").length;
  const evacList = scoredHabitations.filter((h) => h.relocationMandatory);
  const totalDisplaced = evacList.reduce((s, h) => s + h.population, 0);
  const totalShelter = rawData.reliefShelters.reduce((s, sh) => s + (sh.capacity - (sh.currentOccupancy || 200)), 0);

  return {
    success: true,
    region: {
      id: rawData.regionId,
      name: rawData.regionName,
      center: rawData.center,
      zoom: rawData.zoom,
      geologicalContext: rawData.geologicalContext,
    },
    summary: {
      totalHabitations: rawData.habitations.length,
      redZonesCount: redCount,
      orangeZonesCount: orangeCount,
      criticalEvacuations: evacList.length,
      totalDisplacedPopulation: totalDisplaced,
      totalShelterCapacity: totalShelter,
    },
    hazardZones: computedZones,
    carryingCapacity: computedCapacity,
    relocationPriorities: scoredHabitations,
    reliefShelters: rawData.reliefShelters,
    evacuationRoutes: rawData.evacuationRoutes,
    timestamp: new Date().toISOString(),
  };
}
