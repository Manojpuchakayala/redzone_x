const pilotRegions = {
  wayanad: {
    id: "wayanad",
    name: "Wayanad (Meppadi - Chooralmala Basin), Kerala",
    state: "Kerala",
    hazardPrimary: "Landslide / Debris Flow",
    center: [11.5325, 76.1362],
    zoom: 13,
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
    ],
    habitations: [
      {
        id: "HAB-104",
        name: "Punchirimattam Ridge Hamlet",
        zoneId: "WZ-01",
        coordinates: [11.546, 76.132],
        population: 310,
        fingerprint: {
          elderly: 78,
          infants: 52,
          women: 165,
          disabilities: 24,
          medicalDependency: "High",
          structuralFragility: 0.94,
          accessCutoffRisk: 0.95,
          disasterHistory: "Severe",
        },
      },
      {
        id: "HAB-102",
        name: "Chooralmala Bazaar & Quarters",
        zoneId: "WZ-01",
        coordinates: [11.538, 76.135],
        population: 1420,
        fingerprint: {
          elderly: 260,
          infants: 195,
          women: 720,
          disabilities: 55,
          medicalDependency: "Medium",
          structuralFragility: 0.76,
          accessCutoffRisk: 0.85,
          disasterHistory: "Severe",
        },
      },
    ],
    shelters: [
      {
        id: "SHELTER-01",
        name: "Meppadi Higher Secondary Relief Complex",
        coordinates: [11.552, 76.122],
        capacity: 2500,
        occupied: 450,
        safetyScore: 94,
      },
      {
        id: "SHELTER-02",
        name: "Kalpetta Greenfield Multi-Camp Sanctuary",
        coordinates: [11.565, 76.098],
        capacity: 4500,
        occupied: 800,
        safetyScore: 98,
      },
    ],
    evacuationRoutes: [
      {
        fromHabitationId: "HAB-104",
        toShelterId: "SHELTER-01",
        distanceKm: 4.8,
        transitMinutes: 18,
        safetyRating: "96% Safe Ridge Route",
        waypoints: [[11.546, 76.132], [11.543, 76.129], [11.548, 76.124], [11.552, 76.122]],
      },
    ],
  },
};

function synthesizeDynamicLocationModel(lat, lon, locationName = "Custom Incident Zone") {
  const baseLat = Number(lat);
  const baseLon = Number(lon);
  const offset = 0.012;

  return {
    id: "custom_detected",
    name: locationName,
    state: "Local Administrative Unit",
    hazardPrimary: "Multi-Hazard Dynamic Assessment",
    center: [baseLat, baseLon],
    zoom: 14,
    zones: [
      {
        id: "DYN-Z01",
        name: `${locationName} - Primary Vulnerability Epicenter`,
        baseSlope: 35,
        soilType: "Saturated Weathered Colluvium",
        soilThickness: 2.9,
        drainageDistance: 35,
        floodRisk: 88,
        landslideRisk: 92,
        cloudburstRisk: 85,
        disasterHistoryScore: 90,
        coordinates: [
          [baseLat + offset * 0.5, baseLon - offset * 0.8],
          [baseLat + offset * 1.2, baseLon + offset * 0.2],
          [baseLat + offset * 0.4, baseLon + offset * 1.1],
          [baseLat - offset * 0.5, baseLon + offset * 0.1],
        ],
      },
    ],
    habitations: [
      {
        id: "DYN-HAB-01",
        name: `${locationName} Core Settlement`,
        zoneId: "DYN-Z01",
        coordinates: [baseLat + offset * 0.3, baseLon + offset * 0.1],
        population: 1120,
        fingerprint: {
          elderly: 215,
          infants: 145,
          women: 540,
          disabilities: 45,
          medicalDependency: "High",
          structuralFragility: 0.92,
          accessCutoffRisk: 0.90,
          disasterHistory: "Severe",
        },
      },
    ],
    shelters: [
      {
        id: "DYN-SHELTER-01",
        name: `${locationName} Safe Sanctuary`,
        coordinates: [baseLat + offset * 0.9, baseLon - offset * 1.2],
        capacity: 3500,
        occupied: 400,
        safetyScore: 96,
      },
    ],
    evacuationRoutes: [
      {
        fromHabitationId: "DYN-HAB-01",
        toShelterId: "DYN-SHELTER-01",
        distanceKm: 3.8,
        transitMinutes: 14,
        safetyRating: "97% Clear Corridor",
        waypoints: [[baseLat + offset * 0.3, baseLon + offset * 0.1], [baseLat + offset * 0.9, baseLon - offset * 1.2]],
      },
    ],
  };
}

module.exports = { pilotRegions, synthesizeDynamicLocationModel };
