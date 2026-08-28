export const GOVT_DATA_SOURCES = {
  imd: {
    agency: "India Meteorological Department (IMD)",
    ministry: "Ministry of Earth Sciences, Govt of India",
    portalUrl: "https://mausam.imd.gov.in/",
    dataType: "Quantitative Precipitation & Doppler Weather Radar Telemetry",
    alertColorCodes: {
      RED: { threshold: "> 204.4 mm/24h", action: "Take Action (Mandatory Immediate Evacuation)" },
      ORANGE: { threshold: "115.6 - 204.4 mm/24h", action: "Be Prepared (Pre-position Convoys & Medical)" },
      YELLOW: { threshold: "64.5 - 115.5 mm/24h", action: "Be Updated (Monitor Saturated Slopes)" },
      GREEN: { threshold: "< 64.5 mm/24h", action: "No Warning (Designated Safe Sanctuary Zone)" },
    },
    liveFeed: {
      station: "Meppadi Automated Weather Station (AWS-401)",
      last24hRainfall: "214.6 mm (Extreme Torrential Surge)",
      radarReflectivity: "54.2 dBZ (Active Convective Cell)",
      status: "RED ALERT ACTIVE",
    }
  },
  gsi: {
    agency: "Geological Survey of India (GSI)",
    ministry: "Ministry of Mines, Govt of India",
    portalUrl: "https://www.gsi.gov.in/",
    dataType: "National Landslide Susceptibility Mapping (NLSM) & LEWS",
    officialSolutions: [
      "Dynamic slope angle thresholding (>35° escarpments classified as High Hazard)",
      "Pore-water pressure saturation limits (85% volumetric moisture cutoff)",
      "Structural habitation zoning bans inside 100m runoff runout fans",
    ],
    liveFeed: {
      zone: "Western Ghats Sector WG-14 / Wayanad Ridge",
      slopeInstabilityIndex: "Critical (Factor of Safety < 1.05)",
      soilThickness: "3.2m loose overburden on unweathered charnockite bed",
      status: "HIGH LANDSLIDE PROBABILITY",
    }
  },
  cwc: {
    agency: "Central Water Commission (CWC)",
    ministry: "Ministry of Jal Shakti, Govt of India",
    portalUrl: "https://ffs.india-water.gov.in/",
    dataType: "Real-Time Flood Forecasting & River Gauge Telemetry",
    officialSolutions: [
      "Inundation warning when river gauge crosses Danger Level (DL + 0.5m)",
      "Automated bridge cutoff alarms to divert transport convoys",
    ],
    liveFeed: {
      river: "Chaliyar / Iruvanipuzha Basin River Gauge #04",
      currentLevel: "89.4m (0.6m above High Flood Level)",
      dischargeRate: "1,450 m³/sec",
      status: "SEVERE FLOOD STAGE",
    }
  },
  isro: {
    agency: "ISRO / National Remote Sensing Centre (NRSC - Bhuvan)",
    ministry: "Department of Space, Govt of India",
    portalUrl: "https://bhuvan.nrsc.gov.in/",
    dataType: "CartoDEM 10m Elevation & Satellite Flood Inundation Atlas",
    officialSolutions: [
      "High-resolution 3D Digital Elevation Models to calculate debris flow velocity",
      "Satellite Synthetic Aperture Radar (SAR) for all-weather flood mapping",
    ],
    liveFeed: {
      satellite: "EOS-04 / RISAT-1A SAR Radar Pass",
      surfaceInundationArea: "4.8 km² localized catchment",
      demResolution: "10-meter CartoDEM v3.1",
      status: "ACTIVE RADAR ACQUISITION",
    }
  },
  ndma: {
    agency: "National Disaster Management Authority (NDMA)",
    ministry: "Ministry of Home Affairs, Govt of India",
    portalUrl: "https://ndma.gov.in/",
    dataType: "National Disaster Management Guidelines & Sphere Standards",
    sphereStandards: {
      drinkingWater: "45 Litres per person per day (LPCD) mandatory",
      coveredLivingSpace: "3.5 m² per person minimum floor area",
      toiletRatio: "1 emergency latrine per 20 persons max",
      medicalStandby: "1 Primary Healthcare Triage Unit per 1,000 evacuees",
    },
    solutionsImplemented: [
      "Carrying Capacity Index (CCI) algorithmic balancing to prevent camp collapse",
      "Multi-destination split relocation (1,420 -> 1,050 + 370)",
      "LoRa 868 MHz emergency radio fallback during total grid blackout",
    ]
  }
};
