import { pilotRegions, synthesizeDynamicLocationModel } from '../data/disasterData';

export function runSimulation({
  regionId = 'wayanad',
  customLocationData = null,
  rainfallMm = 180,
  hazardType = 'multi',
  hazardIntensity = 1.0,
  disabledShelterIds = [],
} = {}) {
  const data = customLocationData || pilotRegions[regionId] || pilotRegions.wayanad;
  const rain = Number(rainfallMm);

  // 1. Multi-Hazard Red-Zone Index (MHI)
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

    if (hazardType === 'flood') mhi = Number((floodScore * 0.70 + slopeScore * 0.30).toFixed(2));
    if (hazardType === 'landslide') mhi = Number((landslideScore * 0.70 + slopeScore * 0.30).toFixed(2));

    let zoneCategory = "GREEN_ZONE";
    let colorHex = "#10b981";
    let severityLabel = "Low Risk / Safe Sanctuary";

    if (mhi >= 0.68) {
      zoneCategory = "RED_ZONE";
      colorHex = "#ef4444";
      severityLabel = "Critical Red Zone";
    } else if (mhi >= 0.40) {
      zoneCategory = "ORANGE_ZONE";
      colorHex = "#f59e0b";
      severityLabel = "Moderate Alert Zone";
    }

    return {
      ...z,
      mhi,
      zoneCategory,
      colorHex,
      severityLabel,
      actionRecommendation:
        mhi >= 0.68
          ? "Immediate habitation evacuation mandatory. Structural ban enforced."
          : mhi >= 0.40
          ? "High vigilance. Pre-evacuate vulnerable citizens."
          : "Designated multi-disaster safe sanctuary.",
    };
  });

  // 2. Vulnerability Fingerprint & Relocation Urgency Tiers
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

    let urgencyTier = "MONITOR";
    let tierColor = "#10b981";
    let isMandatory = false;

    if (rui >= 0.70 || pz.zoneCategory === "RED_ZONE") {
      urgencyTier = "IMMEDIATE";
      tierColor = "#ef4444";
      isMandatory = true;
    } else if (rui >= 0.50) {
      urgencyTier = "SHORT_TERM";
      tierColor = "#f59e0b";
      isMandatory = true;
    } else if (rui >= 0.35) {
      urgencyTier = "MEDIUM_TERM";
      tierColor = "#3b82f6";
    }

    return {
      ...h,
      vfs,
      rui,
      urgencyTier,
      tierColor,
      relocationMandatory: isMandatory,
      explainWhy: `${pz.name} is on a steep ${pz.baseSlope}° slope with ${Math.round(demographicRatio * 100)}% vulnerable population (${fp.elderly} elderly, ${fp.infants} infants, ${fp.disabilities} PwD) and ${Math.round(fp.accessCutoffRisk * 100)}% road cutoff risk.`,
      radarMetrics: {
        children: Math.round((fp.infants / h.population) * 100 * 3.5),
        elderly: Math.round((fp.elderly / h.population) * 100 * 3),
        women: Math.round(((fp.women || 100) / h.population) * 100 * 1.8),
        disability: Math.round((fp.disabilities / h.population) * 100 * 5),
        medical: fp.medicalDependency.includes("High") ? 92 : 45,
        fragility: Math.round(fp.structuralFragility * 100),
        cutoff: Math.round(fp.accessCutoffRisk * 100),
      },
    };
  }).sort((a, b) => b.rui - a.rui).map((h, i) => ({ ...h, priorityRank: i + 1 }));

  // 3. Carrying Capacity & Split Allocation
  let availableShelters = data.shelters.map((s) => ({
    ...s,
    isAvailable: !disabledShelterIds.includes(s.id),
    currentHeadroom: !disabledShelterIds.includes(s.id) ? (s.capacity - (s.occupied || 0)) : 0,
  }));

  const assignedHabitations = scoredHabitations.map((hab) => {
    if (!hab.relocationMandatory) {
      return { ...hab, allocationPlan: null };
    }

    let remainingNeeded = hab.population;
    const splits = [];

    for (const sh of availableShelters) {
      if (sh.isAvailable && sh.currentHeadroom > 0 && remainingNeeded > 0) {
        const canTake = Math.min(sh.currentHeadroom, remainingNeeded);
        sh.currentHeadroom -= canTake;
        remainingNeeded -= canTake;

        splits.push({
          shelterId: sh.id,
          shelterName: sh.name,
          allocatedCount: canTake,
          coordinates: sh.coordinates,
          safetyScore: sh.safetyScore,
        });
      }
    }

    const defaultRoute = (data.evacuationRoutes && data.evacuationRoutes.find((r) => r.fromHabitationId === hab.id)) || (data.evacuationRoutes && data.evacuationRoutes[0]) || null;

    return {
      ...hab,
      allocationPlan: {
        isSplit: splits.length > 1,
        splits,
        assignedRoute: defaultRoute,
        fleetLogistics: {
          buses: Math.ceil(hab.population / 40),
          ambulances: Math.ceil((hab.fingerprint.elderly + hab.fingerprint.disabilities) / 8),
        },
      },
    };
  });

  const redZonesCount = computedZones.filter((z) => z.zoneCategory === "RED_ZONE").length;
  const orangeZonesCount = computedZones.filter((z) => z.zoneCategory === "ORANGE_ZONE").length;
  const immediateEvacuees = assignedHabitations.filter((h) => h.urgencyTier === "IMMEDIATE").reduce((sum, h) => sum + h.population, 0);
  const totalEvacuees = assignedHabitations.filter((h) => h.relocationMandatory).reduce((sum, h) => sum + h.population, 0);
  const totalShelterCapacity = availableShelters.filter(s => s.isAvailable).reduce((sum, s) => sum + (s.capacity - (s.occupied || 0)), 0);

  // Dynamic Carrying Capacity Index (CCI) calculation
  const cci = totalShelterCapacity > 0 ? Number((totalEvacuees / totalShelterCapacity).toFixed(2)) : 1.0;
  const cciStrainPercent = Math.round(cci * 100);
  let cciBadge = "Headroom Safe";
  let cciColor = "emerald";

  if (cci >= 0.85) {
    cciBadge = "Critical Overload";
    cciColor = "red";
  } else if (cci >= 0.50) {
    cciBadge = "Moderate Strain";
    cciColor = "amber";
  }

  return {
    region: data,
    hazardZones: computedZones,
    shelters: availableShelters,
    reliefShelters: availableShelters,
    hospitals: data.hospitals || [],
    relocationPriorities: assignedHabitations,
    summary: {
      redZonesCount,
      orangeZonesCount,
      immediateEvacuees,
      totalDisplacedPopulation: totalEvacuees,
      totalShelterCapacity,
      cci,
      cciStrainPercent,
      cciBadge,
      cciColor,
      activeHazardsCount: 3,
    },
    timestamp: new Date().toISOString(),
  };
}
