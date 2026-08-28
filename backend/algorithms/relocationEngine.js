function computeRelocationNeeds(habitations, computedZones, reliefShelters) {
  const zoneMap = new Map(computedZones.map((z) => [z.id, z]));

  const scoredHabitations = habitations.map((hab) => {
    const parentZone = zoneMap.get(hab.zoneId) || { susceptibilityIndex: 0.5, zoneCategory: "ORANGE_ZONE" };

    const hazardFactor = parentZone.susceptibilityIndex;
    const fragilityFactor = hab.structuralFragility;
    const demographicFactor = hab.vulnerablePopRatio;
    const isolationFactor = hab.accessRoadQuality.includes("Cutoff") || hab.accessRoadQuality.includes("Footpath") ? 0.90 : 0.40;

    let vps = Number(
      (hazardFactor * 0.40 + fragilityFactor * 0.30 + demographicFactor * 0.20 + isolationFactor * 0.10).toFixed(3)
    );

    let urgencyLevel = "MODERATE";
    let urgencyColor = "#f59e0b";
    let actionRequired = "Monitor settlement stability";
    let relocationMandatory = false;

    if (vps >= 0.65 || parentZone.zoneCategory === "RED_ZONE") {
      urgencyLevel = "CRITICAL (PRIORITY 1)";
      urgencyColor = "#ef4444";
      actionRequired = "Immediate evacuation & permanent relocation mandatory";
      relocationMandatory = true;
    } else if (vps >= 0.45) {
      urgencyLevel = "HIGH (PRIORITY 2)";
      urgencyColor = "#ea580c";
      actionRequired = "Pre-evacuate vulnerable citizens (elderly, infants)";
      relocationMandatory = true;
    }

    const availableShelters = reliefShelters.filter((s) => {
      const shelterZone = zoneMap.get(s.zoneId);
      return shelterZone ? shelterZone.zoneCategory === "GREEN_ZONE" : true;
    });

    const assignedShelter = availableShelters.find((s) => s.capacity - s.currentOccupancy >= hab.population) || availableShelters[0];

    const busesRequired = Math.ceil(hab.population / 40);
    const ambulancesRequired = Math.ceil((hab.population * hab.vulnerablePopRatio) / 8);

    return {
      ...hab,
      parentZoneName: parentZone.name,
      zoneCategory: parentZone.zoneCategory,
      vulnerabilityPriorityScore: vps,
      urgencyLevel,
      urgencyColor,
      actionRequired,
      relocationMandatory,
      assignedShelter: assignedShelter
        ? {
            id: assignedShelter.id,
            name: assignedShelter.name,
            availableSlots: assignedShelter.capacity - assignedShelter.currentOccupancy,
            medicalFacility: assignedShelter.medicalFacility,
          }
        : null,
      evacuationLogistics: {
        busesRequired,
        ambulancesRequired,
        displacedCitizenCount: hab.population,
      },
      explainWhy: `${parentZone.name} is on a steep ${parentZone.baseSlope}° slope with ${Math.round(hab.vulnerablePopRatio * 100)}% elderly/infant population. Fragility: ${Math.round(hab.structuralFragility * 100)}%.`,
    };
  });

  scoredHabitations.sort((a, b) => b.vulnerabilityPriorityScore - a.vulnerabilityPriorityScore);

  return scoredHabitations.map((hab, index) => ({
    ...hab,
    priorityRank: index + 1,
  }));
}

module.exports = { computeRelocationNeeds };
