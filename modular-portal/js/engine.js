/**
 * GeoResilience AI - Master Algorithmic Engine
 * Features:
 * 1. Multi-Hazard Red-Zone Index (MHI)
 * 2. Vulnerability Fingerprint Score (VFS)
 * 3. Relocation Urgency Tiers (IMMEDIATE, SHORT_TERM, MEDIUM_TERM, MONITOR)
 * 4. Destination Carrying Capacity & Split Allocation Algorithm
 */
import { disasterData } from './data.js';

export function calculateSimulation(regionId, rainMm, disabledSiteIds = []) {
  const data = disasterData[regionId] || disasterData.wayanad;
  const rain = Number(rainMm);

  // 1. Multi-Hazard Red-Zone Index (MHI)
  const computedZones = data.zones.map((z) => {
    const slopeScore = Math.min(z.baseSlope / 45, 1.0);
    const rainFactor = Math.min((rain / 280) * 1.2, 1.3);
    const floodScore = Math.min((z.floodRisk / 100) * rainFactor, 1.0);
    const landslideScore = Math.min((z.landslideRisk / 100) * rainFactor, 1.0);
    const cloudburstScore = Math.min((z.cloudburstRisk / 100) * (rain > 200 ? 1.3 : 0.8), 1.0);
    const historyScore = z.disasterHistoryScore / 100;

    const mhi = Number(
      (landslideScore * 0.30 + floodScore * 0.30 + cloudburstScore * 0.15 + slopeScore * 0.15 + historyScore * 0.10).toFixed(2)
    );

    let zoneCategory = "GREEN_ZONE";
    let colorHex = "#10b981";
    let statusLabel = "Safe Sanctuary";

    if (mhi >= 0.68) {
      zoneCategory = "RED_ZONE";
      colorHex = "#ef4444";
      statusLabel = "Critical Multi-Hazard Red Zone";
    } else if (mhi >= 0.40) {
      zoneCategory = "ORANGE_ZONE";
      colorHex = "#f59e0b";
      statusLabel = "Moderate Hazard Orange Alert";
    }

    return {
      ...z,
      mhi,
      zoneCategory,
      colorHex,
      statusLabel,
    };
  });

  // 2. Vulnerability Fingerprint & Relocation Urgency Tiers (VFS & RUI)
  const scoredHabitations = data.habitations.map((h) => {
    const parentZone = computedZones.find((z) => z.id === h.zoneId) || computedZones[0];
    const fp = h.fingerprint;

    // Vulnerability Fingerprint Calculation
    const demographicRatio = (fp.elderly + fp.infants) / h.population;
    const disabilityRatio = fp.disabilities / h.population;
    const vfs = Number(
      (demographicRatio * 0.30 + disabilityRatio * 0.25 + fp.structuralFragility * 0.25 + fp.accessCutoffRisk * 0.20).toFixed(2)
    );

    // Relocation Urgency Index (RUI)
    const rui = Number(
      (parentZone.mhi * 0.45 + vfs * 0.35 + (parentZone.disasterHistoryScore / 100) * 0.20).toFixed(2)
    );

    let urgencyTier = "MONITOR";
    let tierColor = "#10b981";
    let tierTimeframe = "Seasonal Surveillance";
    let isMandatory = false;

    if (rui >= 0.72 || parentZone.zoneCategory === "RED_ZONE") {
      urgencyTier = "IMMEDIATE";
      tierColor = "#ef4444";
      tierTimeframe = "0 - 48 Hours (Emergency Evac)";
      isMandatory = true;
    } else if (rui >= 0.52) {
      urgencyTier = "SHORT_TERM";
      tierColor = "#f59e0b";
      tierTimeframe = "1 - 4 Weeks (Pre-Monsoon Move)";
      isMandatory = true;
    } else if (rui >= 0.35) {
      urgencyTier = "MEDIUM_TERM";
      tierColor = "#3b82f6";
      tierTimeframe = "1 - 6 Months (Planned Relocation)";
    }

    return {
      ...h,
      vfs,
      rui,
      urgencyTier,
      tierColor,
      tierTimeframe,
      relocationMandatory: isMandatory,
      explainWhy: `Hazard MHI: ${Math.round(parentZone.mhi * 100)}% | Demographics: ${Math.round(demographicRatio * 100)}% vulnerable (${fp.elderly} elderly, ${fp.infants} infants, ${fp.disabilities} PwD) | Road Cutoff Risk: ${Math.round(fp.accessCutoffRisk * 100)}%.`,
      aiContribution: {
        hazardContribution: Math.round((parentZone.mhi * 0.45 / rui) * 100),
        vulnerabilityContribution: Math.round((vfs * 0.35 / rui) * 100),
        historyContribution: Math.round(((parentZone.disasterHistoryScore / 100) * 0.20 / rui) * 100),
      },
    };
  }).sort((a, b) => b.rui - a.rui).map((h, idx) => ({ ...h, priorityRank: idx + 1 }));

  // 3. Multi-Destination Carrying Capacity & Split Allocation
  // Filter out any disabled / collapsed sites from What-If simulation
  let availableSites = data.relocationSites.map((s) => ({
    ...s,
    isAvailable: !disabledSiteIds.includes(s.id),
    currentHeadroom: !disabledSiteIds.includes(s.id) ? (s.maxCapacity - s.currentOccupancy) : 0,
  }));

  const destinationAllocations = [];
  const assignedHabitations = scoredHabitations.map((hab) => {
    if (!hab.relocationMandatory) {
      return { ...hab, allocationPlan: null };
    }

    let remainingNeeded = hab.population;
    const splits = [];

    // Find best matching sites with available headroom
    for (const site of availableSites) {
      if (site.isAvailable && site.currentHeadroom > 0 && remainingNeeded > 0) {
        const canTake = Math.min(site.currentHeadroom, remainingNeeded);
        site.currentHeadroom -= canTake;
        remainingNeeded -= canTake;

        splits.push({
          siteId: site.id,
          siteName: site.name,
          allocatedCount: canTake,
          coordinates: site.coordinates,
          suitabilityScore: site.suitability.overallScore,
        });
      }
    }

    const defaultRoute = data.evacuationRoutes.find((r) => r.fromHabitationId === hab.id) || data.evacuationRoutes[0];

    return {
      ...hab,
      allocationPlan: {
        isSplit: splits.length > 1,
        splits,
        unallocatedCount: remainingNeeded,
        assignedRoute: defaultRoute,
        fleetLogistics: {
          buses: Math.ceil(hab.population / 40),
          ambulances: Math.ceil((hab.fingerprint.elderly + hab.fingerprint.disabilities) / 8),
        },
      },
    };
  });

  const redZonesCount = computedZones.filter((z) => z.zoneCategory === "RED_ZONE").length;
  const immediateCount = assignedHabitations.filter((h) => h.urgencyTier === "IMMEDIATE").length;
  const shortTermCount = assignedHabitations.filter((h) => h.urgencyTier === "SHORT_TERM").length;
  const totalEvacuees = assignedHabitations.filter((h) => h.relocationMandatory).reduce((sum, h) => sum + h.population, 0);
  const totalShelterCapacity = availableSites.filter(s => s.isAvailable).reduce((sum, s) => sum + (s.maxCapacity - s.currentOccupancy), 0);

  return {
    region: data,
    hazardZones: computedZones,
    relocationSites: availableSites,
    relocationPriorities: assignedHabitations,
    summary: {
      redZonesCount,
      immediateCount,
      shortTermCount,
      totalDisplacedPopulation: totalEvacuees,
      totalShelterCapacity,
    },
  };
}
