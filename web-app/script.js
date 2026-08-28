/**
 * GeoResilience AI - Master Standalone Application Engine
 */
/**
 * GeoResilience AI - Master Datasets with Vulnerability Fingerprint & Destination Infrastructure
 */
const disasterData = {
  wayanad: {
    id: "wayanad",
    name: "Wayanad (Meppadi - Chooralmala Basin), Kerala",
    center: [11.5325, 76.1362],
    zoom: 13,
    geologicalContext: "High-gradient Western Ghats escarpment with thick laterite soil on fractured gneiss bedrock.",
    
    zones: [
      {
        id: "WZ-01",
        name: "Chooralmala Upper Escarpment",
        baseSlope: 42,
        soilType: "Laterite Clayey (2.8m)",
        soilThickness: 2.8,
        drainageDistance: 45,
        floodRisk: 78,
        landslideRisk: 94,
        cloudburstRisk: 88,
        disasterHistoryScore: 92,
        coordinates: [
          [11.542, 76.128],
          [11.549, 76.135],
          [11.541, 76.148],
          [11.533, 76.138],
        ],
      },
      {
        id: "WZ-02",
        name: "Mundakkai Valley Basin",
        baseSlope: 36,
        soilType: "Gravelly Sandy Loam (3.2m)",
        soilThickness: 3.2,
        drainageDistance: 20,
        floodRisk: 92,
        landslideRisk: 86,
        cloudburstRisk: 82,
        disasterHistoryScore: 89,
        coordinates: [
          [11.533, 76.138],
          [11.541, 76.148],
          [11.530, 76.160],
          [11.522, 76.147],
        ],
      },
      {
        id: "WZ-03",
        name: "Attamala Hill Settlement Spur",
        baseSlope: 28,
        soilType: "Sandy Clay with Boulders (2.1m)",
        soilThickness: 2.1,
        drainageDistance: 120,
        floodRisk: 45,
        landslideRisk: 68,
        cloudburstRisk: 70,
        disasterHistoryScore: 65,
        coordinates: [
          [11.522, 76.147],
          [11.530, 76.160],
          [11.515, 76.168],
          [11.508, 76.152],
        ],
      },
      {
        id: "WZ-04",
        name: "Meppadi Foothills & Plateau (Safe Green Hub)",
        baseSlope: 9,
        soilType: "Compacted Red Soil on Stable Bedrock",
        soilThickness: 1.2,
        drainageDistance: 450,
        floodRisk: 15,
        landslideRisk: 12,
        cloudburstRisk: 25,
        disasterHistoryScore: 10,
        coordinates: [
          [11.545, 76.110],
          [11.560, 76.128],
          [11.542, 76.128],
          [11.525, 76.115],
        ],
      },
      {
        id: "WZ-05",
        name: "Kalpetta Ridge Green Sanctuary",
        baseSlope: 6,
        soilType: "Hard Charnockite Bedrock",
        soilThickness: 0.8,
        drainageDistance: 600,
        floodRisk: 8,
        landslideRisk: 6,
        cloudburstRisk: 18,
        disasterHistoryScore: 5,
        coordinates: [
          [11.555, 76.085],
          [11.575, 76.110],
          [11.560, 76.128],
          [11.540, 76.095],
        ],
      },
    ],

    // Rich Vulnerability Fingerprint per Habitation
    habitations: [
      {
        id: "HAB-104",
        name: "Punchirimattam Ridge Hamlet",
        zoneId: "WZ-01",
        coordinates: [11.546, 76.132],
        population: 310,
        households: 72,
        fingerprint: {
          elderly: 78,
          infants: 52,
          disabilities: 24,
          medicalDependency: "High (Dialysis & Chronic)",
          structuralFragility: 0.94, // 94% Kutcha / Tin structures
          accessCutoffRisk: 0.95,     // Single narrow unpaved footpath
          disasterHistory: "Severe (2019 Debris Flow)",
          socioEconomicResilience: "Low (Daily Wage Tea Labor)",
        },
      },
      {
        id: "HAB-101",
        name: "Mundakkai Tea Plantation Colony",
        zoneId: "WZ-02",
        coordinates: [11.532, 76.145],
        population: 840,
        households: 195,
        fingerprint: {
          elderly: 185,
          infants: 135,
          disabilities: 48,
          medicalDependency: "High",
          structuralFragility: 0.88,
          accessCutoffRisk: 0.90, // Stream bridge dependent
          disasterHistory: "Severe (2020 Flash Flood)",
          socioEconomicResilience: "Low",
        },
      },
      {
        id: "HAB-102",
        name: "Chooralmala Bazaar & Quarters",
        zoneId: "WZ-01",
        coordinates: [11.538, 76.135],
        population: 1420,
        households: 330,
        fingerprint: {
          elderly: 260,
          infants: 195,
          disabilities: 55,
          medicalDependency: "Medium",
          structuralFragility: 0.76,
          accessCutoffRisk: 0.85, // Bridge dependent
          disasterHistory: "Severe",
          socioEconomicResilience: "Medium",
        },
      },
      {
        id: "HAB-103",
        name: "Attamala Upper Enclave",
        zoneId: "WZ-03",
        coordinates: [11.518, 76.155],
        population: 460,
        households: 110,
        fingerprint: {
          elderly: 82,
          infants: 48,
          disabilities: 18,
          medicalDependency: "Low",
          structuralFragility: 0.62,
          accessCutoffRisk: 0.70,
          disasterHistory: "Moderate",
          socioEconomicResilience: "Medium",
        },
      },
      {
        id: "HAB-105",
        name: "Meppadi South Residential Sector",
        zoneId: "WZ-04",
        coordinates: [11.548, 76.120],
        population: 2650,
        households: 620,
        fingerprint: {
          elderly: 310,
          infants: 170,
          disabilities: 35,
          medicalDependency: "Low",
          structuralFragility: 0.20,
          accessCutoffRisk: 0.15,
          disasterHistory: "Low",
          socioEconomicResilience: "High",
        },
      },
    ],

    // Multi-Dimensional Relocation Destination Sites (Carrying Capacity)
    relocationSites: [
      {
        id: "SITE-01",
        name: "Meppadi Central Transit Hub",
        coordinates: [11.552, 76.122],
        maxCapacity: 1500,
        currentOccupancy: 450,
        availableHeadroom: 1050, // 1500 - 450 = 1050
        suitability: {
          hazardSafety: 94,
          drinkingWater: 92, // 45 LPCD verified
          sanitationPiped: 88,
          healthcareProximity: 90, // Primary Health Center 300m
          roadConnectivity: 95,    // 2-Lane Highway
          schoolCapacity: 80,
          overallScore: 90,
        },
        status: "ACTIVE",
      },
      {
        id: "SITE-02",
        name: "Kalpetta Greenfield Stadium Sanctuary",
        coordinates: [11.565, 76.098],
        maxCapacity: 4500,
        currentOccupancy: 800,
        availableHeadroom: 3700,
        suitability: {
          hazardSafety: 98,
          drinkingWater: 96,
          sanitationPiped: 94,
          healthcareProximity: 95, // District General Hospital 1.2km
          roadConnectivity: 98,    // 4-Lane State Highway
          schoolCapacity: 92,
          overallScore: 96,
        },
        status: "ACTIVE",
      },
      {
        id: "SITE-03",
        name: "St. Joseph Hill Community Camp",
        coordinates: [11.545, 76.115],
        maxCapacity: 1200,
        currentOccupancy: 300,
        availableHeadroom: 900,
        suitability: {
          hazardSafety: 92,
          drinkingWater: 72,
          sanitationPiped: 68,
          healthcareProximity: 60,
          roadConnectivity: 75,
          schoolCapacity: 65,
          overallScore: 74,
        },
        status: "ACTIVE",
      },
    ],

    evacuationRoutes: [
      {
        fromHabitationId: "HAB-104",
        toSiteId: "SITE-01",
        distanceKm: 4.8,
        transitMinutes: 18,
        safetyRating: "96% Hazard Bypassed (Upper Ridge Corridor)",
        waypoints: [
          [11.546, 76.132],
          [11.543, 76.129],
          [11.548, 76.124],
          [11.552, 76.122],
        ],
      },
      {
        fromHabitationId: "HAB-101",
        toSiteId: "SITE-03",
        distanceKm: 5.6,
        transitMinutes: 22,
        safetyRating: "94% Elevated Stream Bypass",
        waypoints: [
          [11.532, 76.145],
          [11.530, 76.138],
          [11.538, 76.125],
          [11.545, 76.115],
        ],
      },
      {
        fromHabitationId: "HAB-102",
        toSiteId: "SITE-01",
        distanceKm: 3.2,
        transitMinutes: 12,
        safetyRating: "98% High Ground Clearance",
        waypoints: [
          [11.538, 76.135],
          [11.542, 76.128],
          [11.548, 76.124],
          [11.552, 76.122],
        ],
      },
      {
        fromHabitationId: "HAB-103",
        toSiteId: "SITE-03",
        distanceKm: 6.4,
        transitMinutes: 26,
        safetyRating: "92% Ridge Line Road",
        waypoints: [
          [11.518, 76.155],
          [11.524, 76.140],
          [11.535, 76.125],
          [11.545, 76.115],
        ],
      },
    ],
  },

  joshimath: {
    id: "joshimath",
    name: "Joshimath Urban Catchment, Chamoli, Uttarakhand",
    center: [30.556, 79.567],
    zoom: 14,
    geologicalContext: "Glacial moraine debris slope experiencing severe toe erosion and deep subsurface subsidence.",

    zones: [
      {
        id: "JZ-01",
        name: "Sunil / Manohar Bagh Subsidence Core",
        baseSlope: 34,
        soilType: "Glacial Moraine Debris (4.5m)",
        soilThickness: 4.5,
        drainageDistance: 90,
        floodRisk: 30,
        landslideRisk: 96,
        cloudburstRisk: 75,
        disasterHistoryScore: 95,
        coordinates: [
          [30.562, 79.560],
          [30.568, 79.569],
          [30.559, 79.575],
          [30.552, 79.564],
        ],
      },
      {
        id: "JZ-02",
        name: "Marwari River Toe Slopes",
        baseSlope: 40,
        soilType: "Fractured Colluvium (3.8m)",
        soilThickness: 3.8,
        drainageDistance: 15,
        floodRisk: 88,
        landslideRisk: 92,
        cloudburstRisk: 80,
        disasterHistoryScore: 90,
        coordinates: [
          [30.552, 79.564],
          [30.559, 79.575],
          [30.548, 79.582],
          [30.541, 79.570],
        ],
      },
      {
        id: "JZ-03",
        name: "Auli Foothills Stable Bedrock Spur (Green Hub)",
        baseSlope: 11,
        soilType: "Hard Granite-Gneiss Bedrock",
        soilThickness: 0.9,
        drainageDistance: 550,
        floodRisk: 10,
        landslideRisk: 15,
        cloudburstRisk: 30,
        disasterHistoryScore: 8,
        coordinates: [
          [30.540, 79.545],
          [30.555, 79.558],
          [30.545, 79.565],
          [30.530, 79.550],
        ],
      },
    ],

    habitations: [
      {
        id: "JH-201",
        name: "Manohar Bagh Settlement",
        zoneId: "JZ-01",
        coordinates: [30.561, 79.567],
        population: 920,
        households: 210,
        fingerprint: {
          elderly: 210,
          infants: 120,
          disabilities: 38,
          medicalDependency: "High",
          structuralFragility: 0.96, // Active wide fissures
          accessCutoffRisk: 0.88,
          disasterHistory: "Severe (2023 Subsidence)",
          socioEconomicResilience: "Low",
        },
      },
      {
        id: "JH-202",
        name: "Sunil Village Ward #7",
        zoneId: "JZ-01",
        coordinates: [30.565, 79.563],
        population: 680,
        households: 155,
        fingerprint: {
          elderly: 145,
          infants: 85,
          disabilities: 26,
          medicalDependency: "Medium",
          structuralFragility: 0.90,
          accessCutoffRisk: 0.82,
          disasterHistory: "Severe",
          socioEconomicResilience: "Medium",
        },
      },
      {
        id: "JH-203",
        name: "Marwari Municipal Colony",
        zoneId: "JZ-02",
        coordinates: [30.549, 79.572],
        population: 1150,
        households: 260,
        fingerprint: {
          elderly: 195,
          infants: 140,
          disabilities: 32,
          medicalDependency: "Low",
          structuralFragility: 0.84,
          accessCutoffRisk: 0.78,
          disasterHistory: "High",
          socioEconomicResilience: "Medium",
        },
      },
    ],

    relocationSites: [
      {
        id: "JSITE-01",
        name: "Pipalkoti Central Relief Town",
        coordinates: [30.538, 79.548],
        maxCapacity: 4000,
        currentOccupancy: 600,
        availableHeadroom: 3400,
        suitability: {
          hazardSafety: 96,
          drinkingWater: 94,
          sanitationPiped: 92,
          healthcareProximity: 90, // Sub-District Hospital
          roadConnectivity: 96,    // NH-07 Highway
          schoolCapacity: 88,
          overallScore: 94,
        },
        status: "ACTIVE",
      },
      {
        id: "JSITE-02",
        name: "Auli Alpine Tourism Transit Camp",
        coordinates: [30.546, 79.556],
        maxCapacity: 2000,
        currentOccupancy: 400,
        availableHeadroom: 1600,
        suitability: {
          hazardSafety: 92,
          drinkingWater: 80,
          sanitationPiped: 75,
          healthcareProximity: 85, // Army Base Hospital
          roadConnectivity: 70,    // Winding Hill Pass
          schoolCapacity: 60,
          overallScore: 80,
        },
        status: "ACTIVE",
      },
    ],

    evacuationRoutes: [
      {
        fromHabitationId: "JH-201",
        toSiteId: "JSITE-01",
        distanceKm: 4.2,
        transitMinutes: 16,
        safetyRating: "97% Bedrock Highway",
        waypoints: [
          [30.561, 79.567],
          [30.555, 79.558],
          [30.546, 79.552],
          [30.538, 79.548],
        ],
      },
      {
        fromHabitationId: "JH-202",
        toSiteId: "JSITE-01",
        distanceKm: 5.1,
        transitMinutes: 20,
        safetyRating: "95% Stable Corridor",
        waypoints: [
          [30.565, 79.563],
          [30.558, 79.556],
          [30.546, 79.552],
          [30.538, 79.548],
        ],
      },
      {
        fromHabitationId: "JH-203",
        toSiteId: "JSITE-02",
        distanceKm: 3.5,
        transitMinutes: 14,
        safetyRating: "93% Elevated Ridge Route",
        waypoints: [
          [30.549, 79.572],
          [30.547, 79.562],
          [30.546, 79.556],
        ],
      },
    ],
  },
};


/**
 * GeoResilience AI - Master Algorithmic Engine
 * Features:
 * 1. Multi-Hazard Red-Zone Index (MHI)
 * 2. Vulnerability Fingerprint Score (VFS)
 * 3. Relocation Urgency Tiers (IMMEDIATE, SHORT_TERM, MEDIUM_TERM, MONITOR)
 * 4. Destination Carrying Capacity & Split Allocation Algorithm
 */


function calculateSimulation(regionId, rainMm, disabledSiteIds = []) {
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


/**
 * GeoResilience AI - Leaflet GIS Map Manager Module
 */
class MapManager {
  constructor(elementId) {
    this.elementId = elementId;
    this.map = null;
    this.layerGroup = null;
  }

  init(initialCenter, initialZoom) {
    this.map = L.map(this.elementId, { zoomControl: true }).setView(initialCenter, initialZoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.layerGroup = L.layerGroup().addTo(this.map);
  }

  setView(center, zoom) {
    if (this.map) {
      this.map.setView(center, zoom);
    }
  }

  renderLayers(simulationResult, activeRouteHabId) {
    if (!this.map || !simulationResult) return;
    this.layerGroup.clearLayers();

    // 1. Polygons
    simulationResult.hazardZones.forEach((zone) => {
      L.polygon(zone.coordinates, {
        color: zone.colorHex,
        fillColor: zone.colorHex,
        fillOpacity: zone.zoneCategory === 'RED_ZONE' ? 0.65 : 0.35,
        weight: zone.zoneCategory === 'RED_ZONE' ? 3.5 : 2,
      }).bindPopup(`
        <div style="font-size:12px; line-height: 1.4;">
          <strong style="color: ${zone.colorHex}">${zone.name}</strong><br>
          Hazard Index: <strong>${Math.round(zone.susceptibilityIndex * 100)}%</strong><br>
          Base Slope: <strong>${zone.baseSlope}°</strong><br>
          Soil: ${zone.soilType}
        </div>
      `).addTo(this.layerGroup);
    });

    // 2. Relief Shelters
    simulationResult.reliefShelters.forEach((shelter) => {
      L.circleMarker(shelter.coordinates, {
        radius: 10,
        color: '#ffffff',
        fillColor: '#a855f7',
        fillOpacity: 0.95,
        weight: 3,
      }).bindPopup(`
        <div style="font-size:12px;">
          <strong style="color:#7e22ce;">🏛️ ${shelter.name}</strong><br>
          <span style="color:#10b981; font-weight:bold;">✓ Verified Safe Green Hub</span><br>
          Capacity: <strong>${shelter.capacity} Persons</strong>
        </div>
      `).addTo(this.layerGroup);
    });

    // 3. Habitations
    simulationResult.relocationPriorities.forEach((hab) => {
      L.circleMarker(hab.coordinates, {
        radius: hab.relocationMandatory ? 9 : 7,
        color: '#ffffff',
        fillColor: hab.relocationMandatory ? '#ef4444' : '#3b82f6',
        fillOpacity: 0.95,
        weight: 2.5,
      }).bindPopup(`
        <div style="font-size:12px;">
          <strong>🏡 ${hab.name} (Rank #${hab.priorityRank})</strong><br>
          Population: <strong>${hab.population} Citizens</strong><br>
          VPS Score: <strong style="color:#ef4444;">${Math.round(hab.vulnerabilityPriorityScore * 100)}%</strong>
        </div>
      `).addTo(this.layerGroup);
    });

    // 4. Active Glowing Evacuation Corridor
    if (activeRouteHabId) {
      const selectedHab = simulationResult.relocationPriorities.find((h) => h.id === activeRouteHabId);
      if (selectedHab && selectedHab.assignedRoute) {
        L.polyline(selectedHab.assignedRoute.waypoints, {
          color: '#10b981',
          weight: 6,
          className: 'active-evac-corridor',
        }).addTo(this.layerGroup);
      }
    }
  }
}


/**
 * Simple Dashboard UI Controller
 */
class UIController {
  static updateKPIs(summary, rain) {
    document.getElementById('kpi-red-zones').innerText = `${summary.redZonesCount} Zones`;
    document.getElementById('kpi-evacuees').innerText = summary.totalDisplacedPopulation.toLocaleString();
    document.getElementById('kpi-safe-slots').innerText = summary.totalShelterCapacity.toLocaleString();
    document.getElementById('rain-display').innerText = `${rain} mm / 24h`;
  }

  static renderSidebar(tab, simulationResult, activeRouteHabId, onToggleRoute) {
    const container = document.getElementById('tab-content-area');
    container.innerHTML = '';

    simulationResult.relocationPriorities.forEach((hab) => {
      const isSelected = activeRouteHabId === hab.id;
      const card = document.createElement('div');
      card.className = `village-card ${isSelected ? 'active' : ''}`;

      const tagClass = hab.urgencyTier === 'IMMEDIATE' ? 'tag-red' : hab.urgencyTier === 'SHORT_TERM' ? 'tag-amber' : 'tag-blue';
      const destName = hab.allocationPlan?.splits?.[0]?.siteName || 'Designated Green Sanctuary';

      card.innerHTML = `
        <div class="village-top">
          <div class="village-name">#${hab.priorityRank} ${hab.name}</div>
          <span class="urgency-tag ${tagClass}">${hab.urgencyTier.replace('_', ' ')}</span>
        </div>

        <div class="village-details">
          <span>👥 Pop: <strong>${hab.population}</strong></span>
          <span>👴 Elderly: <strong>${hab.fingerprint.elderly}</strong></span>
          <span>♿ PwD: <strong>${hab.fingerprint.disabilities}</strong></span>
        </div>

        <div class="village-dest">
          ➡️ Relocate to: <strong>${destName}</strong>
        </div>

        ${hab.allocationPlan?.assignedRoute ? `
          <button class="btn-route ${isSelected ? 'active' : ''}" data-hab-id="${hab.id}">
            <i class="fa-solid fa-location-arrow"></i>
            <span>${isSelected ? '✓ Showing Route on Map' : 'Show Evacuation Path'}</span>
          </button>
        ` : ''}
      `;

      const btn = card.querySelector('.btn-route');
      if (btn) {
        btn.addEventListener('click', () => onToggleRoute(hab.id));
      }

      container.appendChild(card);
    });
  }

  static updateRouteBanner(habId, simulationResult) {
    // Banner simplified in minimal mode
  }
}


/**
 * GeoResilience AI - NDMA Directive PDF Exporter with Vulnerability Fingerprints
 */
function exportNDMADirectivePdf(simulationResult) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const res = simulationResult;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("NATIONAL DISASTER MANAGEMENT AUTHORITY", 20, 20);
  doc.setFontSize(11);
  doc.text("TACTICAL HABITATION RELOCATION & EVACUATION DIRECTIVE", 20, 28);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Order Ref: NDMA/OPS/${res.region.id.toUpperCase()}/2026/048`, 20, 36);
  doc.text(`Issued At: ${new Date().toLocaleString('en-IN')}`, 20, 42);
  doc.text(`Jurisdiction: ${res.region.name}`, 20, 48);
  doc.text(`Immediate Evacuees (0-48h): ${res.summary.totalDisplacedPopulation} Citizens`, 20, 54);

  doc.setFont("helvetica", "bold");
  doc.text("TACTICAL DISPATCH ROSTER WITH VULNERABILITY FINGERPRINT:", 20, 66);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  let y = 74;
  res.relocationPriorities.slice(0, 5).forEach((h, i) => {
    const alloc = h.allocationPlan?.splits?.[0]?.siteName || "Transit Camp";
    const fp = h.fingerprint;
    doc.text(`Rank #${i + 1} [${h.urgencyTier}] ${h.name} (Pop: ${h.population})`, 20, y);
    doc.text(`  -> Fingerprint: ${fp.elderly} Elderly, ${fp.infants} Infants, ${fp.disabilities} PwD | Cutoff: ${Math.round(fp.accessCutoffRisk*100)}%`, 20, y + 4);
    doc.text(`  -> Allocation: ${alloc} | Fleet: ${h.allocationPlan?.fleetLogistics.buses || 4} Buses, ${h.allocationPlan?.fleetLogistics.ambulances || 2} Amb`, 20, y + 8);
    y += 14;
  });

  doc.setFont("helvetica", "bold");
  doc.text("Directives: Maintain LoRa Radio Frequency Channel CH-04 if cellular towers collapse.", 20, y + 8);

  doc.save(`NDMA_Evacuation_Directive_${res.region.id}.pdf`);
}


/**
 * GeoResilience AI - Master Application Orchestrator
 * Features:
 * - What-If Relocation Digital Twin
 * - Offline-First Local Storage Cache
 * - Automatic Split Allocation Coordinator
 */






// Application State
const state = {
  regionId: 'wayanad',
  rainfallMm: 180,
  activeTab: 'evacuation',
  activeRouteHabId: null,
  disabledSiteIds: [], // Digital twin: simulated collapsed shelters
  simulationResult: null,
  isOfflineMode: false,
};

let mapManager = null;

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const initialRegion = disasterData[state.regionId];
  mapManager = new MapManager('map');
  mapManager.init(initialRegion.center, initialRegion.zoom);

  setupEventListeners();
  runWorkflow();
});

function runWorkflow() {
  state.simulationResult = calculateSimulation(state.regionId, state.rainfallMm, state.disabledSiteIds);
  
  // Update UI & Map
  UIController.updateKPIs(state.simulationResult.summary, state.rainfallMm);
  UIController.renderSidebar(state.activeTab, state.simulationResult, state.activeRouteHabId, handleToggleRoute);
  UIController.updateRouteBanner(state.activeRouteHabId, state.simulationResult);
  mapManager.renderLayers(state.simulationResult, state.activeRouteHabId);
}

function handleToggleRoute(habId) {
  state.activeRouteHabId = (state.activeRouteHabId === habId) ? null : habId;
  runWorkflow();
}

function setupEventListeners() {
  // Region Switcher
  document.getElementById('btn-wayanad').addEventListener('click', () => {
    state.regionId = 'wayanad';
    state.activeRouteHabId = null;
    state.disabledSiteIds = [];
    document.getElementById('btn-wayanad').classList.add('active');
    document.getElementById('btn-joshimath').classList.remove('active');
    mapManager.setView(disasterData.wayanad.center, disasterData.wayanad.zoom);
    runWorkflow();
  });

  document.getElementById('btn-joshimath').addEventListener('click', () => {
    state.regionId = 'joshimath';
    state.activeRouteHabId = null;
    state.disabledSiteIds = [];
    document.getElementById('btn-joshimath').classList.add('active');
    document.getElementById('btn-wayanad').classList.remove('active');
    mapManager.setView(disasterData.joshimath.center, disasterData.joshimath.zoom);
    runWorkflow();
  });

  // Rainfall Slider & Presets
  const slider = document.getElementById('rain-slider');
  slider.addEventListener('input', (e) => {
    state.rainfallMm = Number(e.target.value);
    runWorkflow();
  });

  window.setPreset = (val) => {
    state.rainfallMm = val;
    slider.value = val;
    runWorkflow();
  };

  // Digital Twin: Collapse Shelter 1 Simulation Toggle
  window.toggleDigitalTwinShelterCollapse = () => {
    if (state.disabledSiteIds.includes('SITE-01') || state.disabledSiteIds.includes('JSITE-01')) {
      state.disabledSiteIds = [];
      alert('🟢 Digital Twin: Primary Transit Hub Restored to Online Service.');
    } else {
      state.disabledSiteIds = state.regionId === 'wayanad' ? ['SITE-01'] : ['JSITE-01'];
      alert('🔴 Digital Twin Simulation: Primary Transit Hub Collapsed / Flooded! System dynamically re-allocating 100% of evacuees to secondary Greenfield Sanctuary!');
    }
    runWorkflow();
  };

  // Tab Switcher
  document.getElementById('tab-btn-evac').addEventListener('click', () => {
    state.activeTab = 'evacuation';
    document.getElementById('tab-btn-evac').classList.add('active');
    document.getElementById('tab-btn-cap').classList.remove('active');
    runWorkflow();
  });

  document.getElementById('tab-btn-cap').addEventListener('click', () => {
    state.activeTab = 'capacity';
    document.getElementById('tab-btn-cap').classList.add('active');
    document.getElementById('tab-btn-evac').classList.remove('active');
    runWorkflow();
  });

  // Modal Handlers
  window.openReportModal = () => {
    const res = state.simulationResult;
    document.getElementById('modal-region-name').innerText = res.region.name;
    document.getElementById('modal-evacuees-count').innerText = `${res.summary.totalDisplacedPopulation.toLocaleString()} Citizens`;
    document.getElementById('modal-fleet-count').innerText = `${Math.ceil(res.summary.totalDisplacedPopulation / 40)} Buses / ${Math.ceil(res.summary.totalDisplacedPopulation / 90)} Amb`;

    const tbody = document.getElementById('modal-table-body');
    tbody.innerHTML = '';
    res.relocationPriorities.slice(0, 5).forEach((h, idx) => {
      const allocName = h.allocationPlan?.splits?.[0]?.siteName || 'Transit Hub';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color:${h.tierColor};">[${h.urgencyTier}]</strong></td>
        <td><strong>${h.name}</strong></td>
        <td style="font-family:'JetBrains Mono';">${h.population}</td>
        <td style="color:#047857; font-weight:bold;">${allocName}</td>
        <td style="color:#64748b; font-family:'JetBrains Mono';">15 - 25 mins</td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('report-modal').style.display = 'flex';
  };

  window.closeReportModal = () => {
    document.getElementById('report-modal').style.display = 'none';
  };

  window.downloadDirectivePdf = () => {
    exportNDMADirectivePdf(state.simulationResult);
  };
}

