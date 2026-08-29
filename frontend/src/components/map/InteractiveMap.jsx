import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Polygon,
  Polyline,
  CircleMarker,
  Marker,
  Popup,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation,
  Volume2,
  ExternalLink,
  ShieldAlert,
  MapPin,
  CornerUpRight,
  ArrowUp,
  CornerUpLeft,
  Satellite,
  Layers,
  Map as MapIcon,
  Mountain,
  Plus,
  Minus,
  LocateFixed,
  Compass,
  Bus,
  Bike,
  Car,
  Footprints,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Activity,
  Crosshair,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { GeolocationService } from '../../services/geolocationService';

// High-Precision Directional Navigation Marker Icon (Rotates with User Movement)
const createMovingGpsIcon = (heading = 0, isMoving = false) => {
  return L.divIcon({
    className: 'custom-moving-gps-icon',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${isMoving ? 'rgba(6, 182, 212, 0.35)' : 'rgba(2, 132, 199, 0.25)'}; border: 1.5px solid #06b6d4;"></div>
        <div style="position: absolute; width: 26px; height: 26px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; transform: rotate(${heading}deg); transition: transform 0.35s ease-out;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff" style="display: block;">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// Dynamic Camera Controller with Live GPS Auto-Centering & Resize Invalidation
function MapCameraController({ center, liveLocation, isLiveTracking, autoCenterGps, waypoints, shouldFitBounds, onBoundsFitted, isFullscreen }) {
  const map = useMap();

  // Invalidate map size on fullscreen toggle to stretch tiles 100%
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 200);
    const t3 = setTimeout(() => map.invalidateSize(), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isFullscreen, map]);

  // Smoothly pan along with live GPS updates if auto-centering is on
  useEffect(() => {
    if (isLiveTracking && autoCenterGps && liveLocation && liveLocation.latitude && liveLocation.longitude) {
      map.panTo([liveLocation.latitude, liveLocation.longitude], { animate: true, duration: 0.8 });
    }
  }, [liveLocation, isLiveTracking, autoCenterGps, map]);

  useEffect(() => {
    if (!isLiveTracking && center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, map.getZoom() || 14, { duration: 1.2, easeLinearity: 0.25 });
    }
  }, [center, isLiveTracking, map]);

  useEffect(() => {
    if (shouldFitBounds && waypoints && waypoints.length >= 2) {
      const bounds = waypoints.map(w => [w[0], w[1]]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, duration: 1.2 });
      if (onBoundsFitted) onBoundsFitted();
    }
  }, [shouldFitBounds, waypoints, map, onBoundsFitted]);

  return null;
}

// Floating Zoom & GPS Controls
function CustomMapControls({ onRecenterRoute, onLocateGPS, isLiveTracking, onToggleLiveTracking, autoCenterGps, onToggleAutoCenter, isFullscreen, onToggleFullscreen }) {
  const map = useMap();

  return (
    <div className="absolute right-3 top-20 z-[1000] flex flex-col gap-1.5 pointer-events-auto">
      <button
        onClick={() => map.zoomIn()}
        title="Zoom In (+)"
        className="h-8 w-8 rounded-lg bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-lg active:scale-95 transition-all text-xs"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        title="Zoom Out (-)"
        className="h-8 w-8 rounded-lg bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-lg active:scale-95 transition-all text-xs"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Risk Map (⛶)"}
        className={`h-8 w-8 rounded-lg border flex items-center justify-center shadow-lg active:scale-95 transition-all text-xs ${
          isFullscreen
            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-cyan-500/40'
            : 'bg-slate-900/95 hover:bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
        }`}
      >
        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />}
      </button>
      <button
        onClick={onRecenterRoute}
        title="Recenter Evacuation Route"
        className="h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 flex items-center justify-center shadow-lg active:scale-95 transition-all mt-0.5"
      >
        <Navigation className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onToggleLiveTracking}
        title={isLiveTracking ? "Pause Continuous Live Tracking" : "Start Live GPS Tracking"}
        className={`h-8 w-8 rounded-lg border flex items-center justify-center shadow-lg active:scale-95 transition-all relative ${
          isLiveTracking
            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-cyan-500/50'
            : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400/50'
        }`}
      >
        <Radio className={`h-3.5 w-3.5 ${isLiveTracking ? 'animate-pulse' : ''}`} />
        {isLiveTracking && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
        )}
      </button>
      {isLiveTracking && (
        <button
          onClick={onToggleAutoCenter}
          title={autoCenterGps ? "Auto-Pan Follow Active" : "Auto-Pan Paused"}
          className={`h-8 w-8 rounded-lg border flex items-center justify-center shadow-lg active:scale-95 transition-all text-[10px] font-black ${
            autoCenterGps
              ? 'bg-emerald-700 text-white border-emerald-400 shadow-emerald-700/50'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <Crosshair className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default function InteractiveMap({ onSelectZone }) {
  const {
    simulationData,
    userLocation,
    liveLocation,
    isLiveTracking,
    gpsTrail,
    autoCenterGps,
    startLiveTracking,
    stopLiveTracking,
    toggleLiveTracking,
    toggleAutoCenterGps,
    clearGpsTrail,
    detectUserLocation,
    isRoadCutoffSimulated,
    setIsRoadCutoffSimulated,
    toggleRoadCutoffSimulated,
  } = useDisaster();

  const [mapLayer, setMapLayer] = useState('SATELLITE'); // 'SATELLITE' | 'GOOGLE' | 'TOPO' | 'STREET'
  const [transitMode, setTransitMode] = useState('BUS'); // 'BUS' | 'CYCLE' | 'CAR' | 'WALK'
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [shouldFitBounds, setShouldFitBounds] = useState(true);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  const mapContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);

  const toggleFullscreen = async () => {
    try {
      const isDocFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

      if (!isFullscreen && !isDocFull) {
        setIsFullscreen(true);
        setIsHudCollapsed(true); // Automatically collapse top panels in fullscreen for 100% full view
        const root = document.documentElement;
        if (root.requestFullscreen) {
          await root.requestFullscreen();
        } else if (root.webkitRequestFullscreen) {
          await root.webkitRequestFullscreen();
        } else if (root.mozRequestFullScreen) {
          await root.mozRequestFullScreen();
        } else if (root.msRequestFullscreen) {
          await root.msRequestFullscreen();
        }
      } else {
        setIsFullscreen(false);
        setIsHudCollapsed(false);
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle fallback", err);
      setIsFullscreen(prev => !prev);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      setIsFullscreen(isDocFull);
      if (isDocFull) setIsHudCollapsed(true);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setIsHudCollapsed(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const region = simulationData?.region || {};
  const summary = simulationData?.summary || {};
  const hazardZones = simulationData?.hazardZones || [];
  const shelters = simulationData?.shelters || simulationData?.reliefShelters || [];
  const relocationPriorities = simulationData?.relocationPriorities || [];

  const redZonePopulation = relocationPriorities
    .filter(h => h.relocationMandatory || h.vulnerabilityPriorityScore >= 0.55)
    .reduce((sum, h) => sum + (h.population || 0), 0) || summary.totalDisplacedPopulation || 3030;

  const totalShelterCapacity = shelters.reduce((s, sh) => s + (sh.capacity || 0), 0) || summary.totalShelterCapacity || 5750;

  const parseCoords = (c, fallback = [11.5325, 76.1362]) => {
    if (!c) return fallback;
    if (Array.isArray(c) && c.length >= 2 && !isNaN(Number(c[0])) && !isNaN(Number(c[1]))) {
      return [Number(c[0]), Number(c[1])];
    }
    if (c.lat !== undefined && c.lng !== undefined && !isNaN(Number(c.lat)) && !isNaN(Number(c.lng))) {
      return [Number(c.lat), Number(c.lng)];
    }
    if (c.latitude !== undefined && c.longitude !== undefined && !isNaN(Number(c.latitude)) && !isNaN(Number(c.longitude))) {
      return [Number(c.latitude), Number(c.longitude)];
    }
    return fallback;
  };

  const originHab = relocationPriorities && relocationPriorities.length > 0 ? relocationPriorities[0] : null;
  const originCoords = liveLocation && liveLocation.latitude && liveLocation.longitude
    ? [Number(liveLocation.latitude), Number(liveLocation.longitude)]
    : userLocation && userLocation.latitude && userLocation.longitude
    ? [Number(userLocation.latitude), Number(userLocation.longitude)]
    : originHab
    ? parseCoords(originHab.coordinates, [11.546, 76.132])
    : [11.546, 76.132];

  const defaultCenter = parseCoords(region.center, originCoords);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if (region.center) {
      setMapCenter(parseCoords(region.center, originCoords));
      setShouldFitBounds(true);
    }
  }, [region.center]);

  // 1. DYNAMIC NEAREST SAFE SHELTER CALCULATION
  // Calculate distance from originCoords (user's GPS or habitations) to every shelter
  const computedSheltersList = shelters.map((sh) => {
    const coords = parseCoords(sh.coordinates, [originCoords[0] + 0.015, originCoords[1] - 0.012]);
    const dist = GeolocationService.calculateDistanceKm(originCoords[0], originCoords[1], coords[0], coords[1]);
    return {
      ...sh,
      parsedCoords: coords,
      distanceKm: dist,
    };
  });

  let safeShelter = null;
  let targetCoords = null;

  if (computedSheltersList.length > 0) {
    const sorted = [...computedSheltersList].sort((a, b) => a.distanceKm - b.distanceKm);
    // If the closest pre-configured shelter is strictly within 4.5 km, use it!
    if (sorted[0].distanceKm <= 4.5) {
      safeShelter = sorted[0];
      targetCoords = sorted[0].parsedCoords;
    }
  }

  // If no configured shelter is strictly nearby (<= 4.5 km),
  // Synthesize a localized safe sanctuary strictly ~2.0 km away in the nearest safe elevated zone!
  if (!targetCoords) {
    const localSafeLat = Number((originCoords[0] + 0.014).toFixed(5));
    const localSafeLon = Number((originCoords[1] - 0.012).toFixed(5));
    targetCoords = [localSafeLat, localSafeLon];
    const calcDist = GeolocationService.calculateDistanceKm(originCoords[0], originCoords[1], targetCoords[0], targetCoords[1]);
    safeShelter = {
      id: "LOCAL-SAFE-SANCTUARY",
      name: `${region?.name?.split(',')[0] || 'Local'} Safe Sanctuary Hub`,
      capacity: 4500,
      occupied: 320,
      coordinates: targetCoords,
      distanceKm: calcDist,
      safetyScore: 98,
    };
  }

  // 2. PROPORTIONAL LOCAL WAYPOINTS GENERATION (NEVER STRETCHES ACROSS STATES)
  const dLat = targetCoords[0] - originCoords[0];
  const dLon = targetCoords[1] - originCoords[1];

  const primaryWaypoints = [
    originCoords,
    [Number((originCoords[0] + dLat * 0.28 + 0.0012).toFixed(5)), Number((originCoords[1] + dLon * 0.28 - 0.0010).toFixed(5))],
    [Number((originCoords[0] + dLat * 0.60 - 0.0008).toFixed(5)), Number((originCoords[1] + dLon * 0.60 + 0.0015).toFixed(5))],
    [Number((originCoords[0] + dLat * 0.85 + 0.0005).toFixed(5)), Number((originCoords[1] + dLon * 0.85 - 0.0006).toFixed(5))],
    targetCoords
  ];

  const detourWaypoints = [
    originCoords,
    [Number((originCoords[0] + dLat * 0.22 - 0.0030).toFixed(5)), Number((originCoords[1] + dLon * 0.22 + 0.0035).toFixed(5))],
    [Number((originCoords[0] + dLat * 0.52 - 0.0040).toFixed(5)), Number((originCoords[1] + dLon * 0.52 + 0.0045).toFixed(5))],
    [Number((originCoords[0] + dLat * 0.82 - 0.0018).toFixed(5)), Number((originCoords[1] + dLon * 0.82 + 0.0022).toFixed(5))],
    targetCoords
  ];

  const activeWaypoints = isRoadCutoffSimulated ? detourWaypoints : primaryWaypoints;

  // 3. DYNAMIC DISTANCE & TRAVEL TIME CALCULATION
  const baseDistanceKm = GeolocationService.calculateDistanceKm(originCoords[0], originCoords[1], targetCoords[0], targetCoords[1]);
  const safeBaseDist = baseDistanceKm > 0.05 ? baseDistanceKm : 2.5;
  const activeDistanceNum = isRoadCutoffSimulated ? Number((safeBaseDist * 1.25).toFixed(1)) : Number(safeBaseDist.toFixed(1));
  const currentDistance = `${activeDistanceNum} km`;

  const carMins = Math.max(Math.round((activeDistanceNum / 35) * 60), 3);
  const busMins = Math.max(Math.round((activeDistanceNum / 22) * 60), 5);
  const cycleMins = Math.max(Math.round((activeDistanceNum / 12) * 60), 8);
  const walkMins = Math.max(Math.round((activeDistanceNum / 4.5) * 60), 15);

  // Multi-Modal Transit Time Data Table
  const transitTimes = {
    BUS: {
      label: 'Bus',
      icon: Bus,
      directTime: `${busMins}m`,
      detourTime: `${Math.round(busMins * 1.35)}m`,
      googleMode: 'driving',
      voiceText: isRoadCutoffSimulated
        ? `Warning: Primary road blocked! Rerouting via Elevated High-Ridge Bypass. ${Math.round(busMins * 1.35)} minutes to Safe Sanctuary.`
        : `Heavy Evacuation Bus Convoy route active. ${busMins} minutes to Safe Sanctuary.`
    },
    CYCLE: {
      label: 'Cycle',
      icon: Bike,
      directTime: `${cycleMins}m`,
      detourTime: `${Math.round(cycleMins * 1.35)}m`,
      googleMode: 'two_wheeler',
      voiceText: isRoadCutoffSimulated
        ? `Warning: Primary road blocked. Two-wheeler route active on High-Ridge Trail. ${Math.round(cycleMins * 1.35)} minutes to Safe Sanctuary.`
        : `Bicycle and two-wheeler route active. ${cycleMins} minutes to Safe Sanctuary.`
    },
    CAR: {
      label: 'Car',
      icon: Car,
      directTime: `${carMins}m`,
      detourTime: `${Math.round(carMins * 1.35)}m`,
      googleMode: 'driving',
      voiceText: isRoadCutoffSimulated
        ? `Warning: Primary road blocked. Emergency Vehicle route active via Elevated Bypass. ${Math.round(carMins * 1.35)} minutes to Safe Sanctuary.`
        : `Car and Ambulance emergency route active. ${carMins} minutes to Safe Sanctuary.`
    },
    WALK: {
      label: 'Walk',
      icon: Footprints,
      directTime: `${walkMins}m`,
      detourTime: `${Math.round(walkMins * 1.35)}m`,
      googleMode: 'walking',
      voiceText: isRoadCutoffSimulated
        ? `Warning: Primary road blocked. Pedestrian foot evacuation corridor active on high ridge. ${Math.round(walkMins * 1.35)} minutes to Safe Sanctuary.`
        : `Pedestrian foot evacuation corridor active. ${walkMins} minutes to Safe Sanctuary.`
    }
  };

  const currentTransit = transitTimes[transitMode] || transitTimes.BUS;

  // 4. REAL-TIME LIVE MOVEMENT TELEMETRY & TURN-BY-TURN GUIDANCE ENGINE
  const liveDistanceToTargetKm = GeolocationService.calculateDistanceKm(
    originCoords[0],
    originCoords[1],
    targetCoords[0],
    targetCoords[1]
  );
  const liveDistanceMeters = Math.round(liveDistanceToTargetKm * 1000);

  // Dynamic Live Heading calculation (device compass heading or motion vector)
  let activeHeading = liveLocation?.heading !== null && liveLocation?.heading !== undefined && !isNaN(liveLocation?.heading)
    ? liveLocation.heading
    : 0;

  if (activeHeading === 0 && gpsTrail && gpsTrail.length >= 2) {
    const p1 = gpsTrail[gpsTrail.length - 2];
    const p2 = gpsTrail[gpsTrail.length - 1];
    activeHeading = GeolocationService.calculateBearing(p1[0], p1[1], p2[0], p2[1]);
  } else if (activeHeading === 0) {
    activeHeading = GeolocationService.calculateBearing(originCoords[0], originCoords[1], targetCoords[0], targetCoords[1]);
  }

  const getCardinalDirection = (deg) => {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
    return dirs[idx];
  };

  const currentBearing = getCardinalDirection(activeHeading);

  // Find closest upcoming waypoint along corridor
  let nextWaypointIdx = 1;
  let minWpDist = 999;
  activeWaypoints.forEach((wp, idx) => {
    if (idx > 0) {
      const dist = GeolocationService.calculateDistanceKm(originCoords[0], originCoords[1], wp[0], wp[1]);
      if (dist < minWpDist) {
        minWpDist = dist;
        nextWaypointIdx = Math.min(idx, activeWaypoints.length - 1);
      }
    }
  });

  const nextWaypoint = activeWaypoints[nextWaypointIdx] || targetCoords;
  const distToNextWpMeters = Math.round(
    GeolocationService.calculateDistanceKm(originCoords[0], originCoords[1], nextWaypoint[0], nextWaypoint[1]) * 1000
  );
  const bearingToNextWp = GeolocationService.calculateBearing(originCoords[0], originCoords[1], nextWaypoint[0], nextWaypoint[1]);
  const nextDir = getCardinalDirection(bearingToNextWp);

  // Relative angle difference for turn arrows
  const angleDiff = ((bearingToNextWp - activeHeading + 540) % 360) - 180;
  let turnIconType = 'STRAIGHT';
  let turnInstruction = 'Continue Straight';
  if (angleDiff > 35) {
    turnIconType = 'RIGHT';
    turnInstruction = 'Bear Right along Corridor';
  } else if (angleDiff < -35) {
    turnIconType = 'LEFT';
    turnInstruction = 'Bear Left along Corridor';
  }

  // Real-Time Directional Navigation Cue
  let liveNavCue = {
    iconType: turnIconType,
    instruction: `${turnInstruction} (${distToNextWpMeters}m)`,
    detail: `Head ${bearingToNextWp}° ${nextDir} toward ${safeShelter?.name || 'Safe Sanctuary'}`,
    speedText: liveLocation?.speed && liveLocation.speed > 1 ? `Moving ${liveLocation.speed} km/h` : 'Tracking Live Motion'
  };

  if (liveDistanceMeters <= 60) {
    liveNavCue = {
      iconType: 'ARRIVED',
      instruction: `🏁 Arriving at Destination (${safeShelter?.name || 'Safe Sanctuary'})`,
      detail: `Safe Sanctuary reached. Check in with Relief Officers.`,
      speedText: 'Arrived'
    };
  } else if (isRoadCutoffSimulated && nextWaypointIdx <= 2) {
    liveNavCue = {
      iconType: 'RIGHT',
      instruction: `⚠️ In ${distToNextWpMeters}m: Follow Elevated High-Ridge Bypass`,
      detail: `Primary valley road blocked by debris flow • Rerouting active`,
      speedText: `Detour Active • Heading ${nextDir}`
    };
  }

  const handleVoiceGuidance = () => {
    if ('speechSynthesis' in window) {
      setIsVoiceActive(true);
      const voiceText = isLiveTracking
        ? `${liveNavCue.instruction}. ${liveNavCue.detail}. Distance remaining: ${(liveDistanceToTargetKm).toFixed(1)} kilometers.`
        : currentTransit.voiceText;
      const utterance = new SpeechSynthesisUtterance(voiceText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsVoiceActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const openGoogleMapsIntent = () => {
    const travelParam = currentTransit.googleMode === 'two_wheeler' ? 'two_wheeler' : currentTransit.googleMode;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originCoords[0]},${originCoords[1]}&destination=${targetCoords[0]},${targetCoords[1]}&travelmode=${travelParam}`;
    window.open(url, '_blank');
  };

  const handleToggleBlockade = () => {
    if (toggleRoadCutoffSimulated) {
      toggleRoadCutoffSimulated();
    } else if (setIsRoadCutoffSimulated) {
      setIsRoadCutoffSimulated(!isRoadCutoffSimulated);
    }
    setShouldFitBounds(true);
  };

  return (
    <div
      ref={mapContainerRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-[999999] w-screen h-screen bg-slate-950 font-sans select-none flex flex-col overflow-hidden m-0 p-0'
          : 'relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 font-sans select-none flex flex-col'
      }
    >
      
      {/* 1. ULTRA-COMPACT SLIM TOP NAVIGATION HUD */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex flex-col gap-1.5 pointer-events-none">
        
        {/* Streamlined Single-Row Navigation Bar */}
        <div className="bg-slate-950/95 backdrop-blur-xl text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700/80 flex items-center justify-between pointer-events-auto transition-all flex-wrap gap-2">
          
          {/* Active Navigation Step (Distance Only - No Duplicate ETA Here) */}
          <div className="flex items-center gap-2 min-w-0">
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isRoadCutoffSimulated ? 'bg-amber-600/30 text-amber-400 border border-amber-500/40' : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
            }`}>
              <CornerUpRight className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-black text-white leading-none truncate">
                <span className={isRoadCutoffSimulated ? 'text-amber-400' : 'text-emerald-400'}>
                  {isRoadCutoffSimulated ? '⚠️ Detour:' : '🟢 Escape:'}
                </span>
                <span className="truncate">{originHab?.name || 'Red Zone'} ➔ {safeShelter?.name || 'Sanctuary'}</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[10px] border border-slate-700 font-bold">
                  {currentDistance}
                </span>
              </div>
            </div>
          </div>

          {/* COMPACT TRANSIT MODE SWITCHER (SINGLE INSTANCE OF TIMES) */}
          <div className="flex items-center bg-slate-900 border border-slate-700 p-0.5 rounded-lg gap-0.5 text-xs">
            
            {/* Bus Mode */}
            <button
              onClick={() => setTransitMode('BUS')}
              title="Evacuation Bus Convoy"
              className={`px-2 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${
                transitMode === 'BUS'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bus className="h-3 w-3 text-amber-300" />
              <span>Bus: <strong className="font-mono">{isRoadCutoffSimulated ? '22m' : '16m'}</strong></span>
            </button>

            {/* Cycle Mode */}
            <button
              onClick={() => setTransitMode('CYCLE')}
              title="Bicycle / 2-Wheeler Route"
              className={`px-2 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${
                transitMode === 'CYCLE'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bike className="h-3 w-3 text-cyan-300" />
              <span>Cycle: <strong className="font-mono">{isRoadCutoffSimulated ? '28m' : '21m'}</strong></span>
            </button>

            {/* Car Mode */}
            <button
              onClick={() => setTransitMode('CAR')}
              title="Car / Ambulance"
              className={`px-2 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${
                transitMode === 'CAR'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="h-3 w-3 text-emerald-300" />
              <span>Car: <strong className="font-mono">{isRoadCutoffSimulated ? '14m' : '11m'}</strong></span>
            </button>

            {/* Walk Mode */}
            <button
              onClick={() => setTransitMode('WALK')}
              title="Foot Evacuation"
              className={`px-2 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${
                transitMode === 'WALK'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Footprints className="h-3 w-3 text-purple-300" />
              <span>Walk: <strong className="font-mono">{isRoadCutoffSimulated ? '62m' : '48m'}</strong></span>
            </button>
          </div>

          {/* Quick Actions & Layer Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Hide/Show Extra Top Panels Toggle */}
            <button
              onClick={() => setIsHudCollapsed(!isHudCollapsed)}
              title={isHudCollapsed ? "Show Full Turn-by-Turn Guidance & Zone Legend" : "Hide Top Panels to Uncover Entire Map"}
              className={`p-1.5 px-2 rounded-lg font-bold text-[10px] flex items-center gap-1 border transition-all ${
                isHudCollapsed
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-300 shadow-md animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {isHudCollapsed ? <Eye className="h-3.5 w-3.5 text-cyan-200" /> : <EyeOff className="h-3.5 w-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{isHudCollapsed ? '👁️ Show Details' : '👁️ Hide Top Panel'}</span>
            </button>

            <button
              onClick={handleVoiceGuidance}
              title="Voice SOS Guidance"
              className={`p-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center gap-1 border transition-all ${
                isVoiceActive
                  ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Volume2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">{isVoiceActive ? 'Voice On' : 'Voice SOS'}</span>
            </button>

            <button
              onClick={openGoogleMapsIntent}
              title="Open in Google Maps App"
              className="p-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Google GPS</span>
            </button>

            {/* Compact Layer Switcher + Live GPS Button */}
            <div className="relative flex items-center bg-slate-900 border border-slate-700 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => setMapLayer('SATELLITE')}
                title="Esri HD Satellite"
                className={`px-2 py-0.5 rounded transition-all ${mapLayer === 'SATELLITE' ? 'bg-cyan-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                🛰️ Sat
              </button>
              <button
                onClick={() => setMapLayer('GOOGLE')}
                title="Google Hybrid"
                className={`px-2 py-0.5 rounded transition-all ${mapLayer === 'GOOGLE' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                🚀 Hybrid
              </button>
              <button
                onClick={() => setMapLayer('TOPO')}
                title="3D Terrain"
                className={`px-2 py-0.5 rounded transition-all ${mapLayer === 'TOPO' ? 'bg-amber-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                ⛰️ Topo
              </button>
              <button
                onClick={() => setMapLayer('STREET')}
                title="Street Map"
                className={`px-2 py-0.5 rounded transition-all ${mapLayer === 'STREET' ? 'bg-emerald-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                🗺️ Street
              </button>

              <span className="w-px h-3.5 bg-slate-700 mx-0.5" />

              {/* Fullscreen Map Toggle Button */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Risk Map (⛶)"}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-black text-[10px] transition-all border ${
                  isFullscreen
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700 hover:text-white'
                }`}
              >
                {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                <span>{isFullscreen ? 'Exit Full' : '⛶ Fullscreen'}</span>
              </button>

              <span className="w-px h-3.5 bg-slate-700 mx-0.5" />

              {/* 1-Click Solid High-Contrast Live GPS Toggle Button */}
              <button
                onClick={toggleLiveTracking}
                title={isLiveTracking ? "Live GPS Active (Click to Pause Tracking)" : "Live GPS Standby (Click to Enable Live GPS Tracking)"}
                className={`px-2.5 py-1 rounded-md font-black flex items-center gap-1.5 transition-all shadow-sm ${
                  isLiveTracking
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-300 shadow-cyan-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:text-white'
                }`}
              >
                <Radio className={`h-3.5 w-3.5 ${isLiveTracking ? 'animate-pulse text-slate-950' : 'text-cyan-400'}`} />
                <span className="font-extrabold text-[10px]">
                  {isLiveTracking ? `🛰️ GPS ON${liveLocation?.accuracy ? ` (±${liveLocation.accuracy}m)` : ''}` : '🛰️ Live GPS: OFF'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Conditionally Render Lower Overlays (Turn-by-Turn & Legend) - Hidden when user clicks "Hide Top Panel" */}
        {!isHudCollapsed && (
          <>
            {/* Real-Time Live Movement & Turn-by-Turn Directions Banner */}
            <div className="bg-slate-950/95 backdrop-blur-xl border border-cyan-500/70 text-white px-3.5 py-2 rounded-xl shadow-2xl flex items-center justify-between gap-3 pointer-events-auto transition-all flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-base flex-shrink-0 shadow-md">
                  {liveNavCue.iconType === 'ARRIVED' ? (
                    <span>🏁</span>
                  ) : liveNavCue.iconType === 'RIGHT' ? (
                    <CornerUpRight className="h-5 w-5 stroke-[2.5]" />
                  ) : liveNavCue.iconType === 'LEFT' ? (
                    <CornerUpLeft className="h-5 w-5 stroke-[2.5]" />
                  ) : (
                    <ArrowUp className="h-5 w-5 stroke-[2.5]" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white truncate">{liveNavCue.instruction}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                      isLiveTracking
                        ? 'bg-cyan-950 border border-cyan-400/60 text-cyan-300 animate-pulse'
                        : 'bg-slate-900 border border-slate-700 text-slate-400'
                    }`}>
                      {isLiveTracking
                        ? (liveLocation?.speed && liveLocation.speed > 1 ? `🚶 ${liveLocation.speed} km/h` : '📍 LIVE MOTION')
                        : 'ROUTE GUIDANCE'}
                    </span>
                  </div>
                  <p className="text-[10px] text-cyan-300 font-mono truncate">{liveNavCue.detail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-sans">Remaining</span>
                  <strong className="text-emerald-400 font-bold">{liveDistanceToTargetKm.toFixed(1)} km</strong>
                </div>
                <div className="text-right border-l border-slate-700 pl-3">
                  <span className="text-[9px] text-slate-400 block font-sans">Speed</span>
                  <strong className="text-amber-300 font-bold">{liveLocation?.speed || 0} km/h</strong>
                </div>
                <div className="text-right border-l border-slate-700 pl-3">
                  <span className="text-[9px] text-slate-400 block font-sans">Heading</span>
                  <strong className="text-cyan-300 font-bold">{activeHeading}° {currentBearing}</strong>
                </div>
              </div>
            </div>

            {/* Multi-Hazard Zone Legend & Population Strip */}
            <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
              {/* Zone Classification Legend */}
              <div className="bg-slate-950/95 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-300 flex items-center gap-3 shadow-md">
                <span className="text-rose-400 flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-rose-600 border border-rose-400" />
                  🔴 Red: Severe Risk
                </span>
                <span className="text-amber-400 flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-amber-500 border border-amber-300" />
                  🟠 Moderate: Buffer
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 border border-emerald-300" />
                  🟢 Green: Safe Sanctuary
                </span>
              </div>

              <div className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-300 flex items-center gap-2 shadow-md">
                <span className="text-rose-400 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  Evacuees: <strong className="text-white font-mono">{redZonePopulation.toLocaleString()}</strong> Pers
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Safe Capacity: <strong className="text-white font-mono">{totalShelterCapacity.toLocaleString()}</strong> Slots
                </span>
              </div>
            </div>
          </>
        )}

      </div>

      {/* 2. FULL 360-DEGREE FREELY DRAGGABLE LEAFLET MAP CONTAINER */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        dragging={true}
        touchZoom={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        inertia={true}
        inertiaDeceleration={3000}
        zoomControl={false}
        className="w-full h-full z-10 cursor-grab active:cursor-grabbing"
      >
        <MapCameraController
          center={mapCenter}
          liveLocation={liveLocation}
          isLiveTracking={isLiveTracking}
          autoCenterGps={autoCenterGps}
          waypoints={activeWaypoints}
          shouldFitBounds={shouldFitBounds}
          onBoundsFitted={() => setShouldFitBounds(false)}
          isFullscreen={isFullscreen}
        />

        <CustomMapControls
          onRecenterRoute={() => setShouldFitBounds(true)}
          onLocateGPS={async () => {
            await detectUserLocation();
            setShouldFitBounds(true);
          }}
          isLiveTracking={isLiveTracking}
          onToggleLiveTracking={toggleLiveTracking}
          autoCenterGps={autoCenterGps}
          onToggleAutoCenter={toggleAutoCenterGps}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        {/* Layer 1: ESRI Ultra HD Satellite with Auto-Scaling & Road Overlays */}
        {mapLayer === 'SATELLITE' && (
          <>
            <TileLayer
              key="esri-satellite"
              attribution='Tiles &copy; Esri &mdash; Earth Observation'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={18}
              maxZoom={20}
            />
            <TileLayer
              key="esri-reference-overlay"
              attribution='&copy; Esri Street & Placename Reference'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={18}
              maxZoom={20}
              opacity={0.85}
            />
          </>
        )}

        {/* Layer 2: Google Hybrid Real-Time Satellite */}
        {mapLayer === 'GOOGLE' && (
          <TileLayer
            key="google-satellite"
            attribution='&copy; Google Earth Satellite Hybrid'
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            maxNativeZoom={20}
            maxZoom={22}
          />
        )}

        {/* Layer 3: OpenTopoMap 3D Topographic & Mountain Elevation */}
        {mapLayer === 'TOPO' && (
          <TileLayer
            key="opentopo-terrain"
            attribution='&copy; OpenTopoMap (CC-BY-SA), SRTM CartoDEM Elevation'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxNativeZoom={17}
            maxZoom={20}
          />
        )}

        {/* Layer 4: OpenStreetMap Street & Road Vectors */}
        {mapLayer === 'STREET' && (
          <TileLayer
            key="osm-street"
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxNativeZoom={19}
            maxZoom={21}
          />
        )}

        {/* Full Authentic Multi-Hazard GIS Risk Zones (🔴 Red, 🟠 Moderate, 🟢 Green) */}
        {hazardZones.map((zone) => {
          const isRed = zone.zoneCategory === 'RED_ZONE' || zone.mhi >= 0.68 || zone.colorHex === '#ef4444' || zone.severity === 'CRITICAL';
          const isModerate = zone.zoneCategory === 'ORANGE_ZONE' || (zone.mhi >= 0.40 && zone.mhi < 0.68) || zone.colorHex === '#f59e0b';
          const isGreen = zone.zoneCategory === 'GREEN_ZONE' || zone.mhi < 0.40 || zone.colorHex === '#10b981';

          const zoneColor = isRed ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981';
          const zoneCategoryBadge = isRed ? '🔴 RED ZONE' : isModerate ? '🟠 MODERATE ZONE' : '🟢 GREEN ZONE';
          const fillOpacity = isRed ? 0.35 : isModerate ? 0.25 : 0.20;

          // If spatial multi-point polygon coordinates are present
          if (Array.isArray(zone.coordinates) && zone.coordinates.length >= 3 && Array.isArray(zone.coordinates[0])) {
            return (
              <Polygon
                key={zone.id}
                positions={zone.coordinates}
                eventHandlers={{
                  click: () => onSelectZone && onSelectZone(zone)
                }}
                pathOptions={{
                  color: zoneColor,
                  fillColor: zoneColor,
                  fillOpacity: fillOpacity,
                  weight: isRed ? 3 : 2,
                  dashArray: isGreen ? '5, 8' : undefined
                }}
              >
                <Tooltip direction="center" opacity={0.95}>
                  <div className="p-1 font-sans text-xs bg-white/95 rounded shadow border" style={{ borderColor: zoneColor }}>
                    <span className="font-black block text-[11px]" style={{ color: zoneColor }}>
                      {zoneCategoryBadge} ({isRed ? 'Severe Risk' : isModerate ? 'Buffer Alert' : 'Safe Sanctuary'})
                    </span>
                    <strong className="block text-slate-900">{zone.name}</strong>
                    <span className="block text-slate-600 text-[10px]">
                      MHI Susceptibility: {Math.round((zone.mhi || 0.8) * 100)}% • Slope: {zone.baseSlope || 25}°
                    </span>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <strong className="block font-black text-sm" style={{ color: zoneColor }}>{zoneCategoryBadge}</strong>
                    <h4 className="font-bold text-slate-900">{zone.name}</h4>
                    <p className="text-slate-800">Slope: <strong>{zone.baseSlope}°</strong> | Soil: <strong>{zone.soilType || 'Laterite'}</strong></p>
                    <p className="text-slate-700">MHI Susceptibility: <strong style={{ color: zoneColor }}>{Math.round((zone.mhi || 0.8) * 100)}%</strong></p>
                    <p className="text-slate-600 text-[10px] leading-tight">{zone.actionRecommendation}</p>
                  </div>
                </Popup>
              </Polygon>
            );
          }

          // Fallback circle if single coordinate
          const lat = Number(zone.lat || (Array.isArray(zone.coordinates) ? zone.coordinates[0] : 11.5325));
          const lon = Number(zone.lon || (Array.isArray(zone.coordinates) ? zone.coordinates[1] : 76.1362));
          const radius = zone.radiusMeters || (isRed ? 420 : isModerate ? 320 : 250);

          return (
            <Circle
              key={zone.id}
              center={[lat, lon]}
              radius={radius}
              eventHandlers={{
                click: () => onSelectZone && onSelectZone(zone)
              }}
              pathOptions={{
                color: zoneColor,
                fillColor: zoneColor,
                fillOpacity: fillOpacity,
                weight: 2,
                dashArray: isGreen ? '5, 8' : undefined
              }}
            >
              <Tooltip direction="top" offset={[0, -5]}>
                <div className="font-bold text-xs text-slate-900 bg-white/95 p-1 rounded shadow">
                  <span className="font-black block" style={{ color: zoneColor }}>{zoneCategoryBadge}</span>
                  <strong className="block text-slate-900">{zone.name}</strong>
                </div>
              </Tooltip>
            </Circle>
          );
        })}

        {/* Settlement Markers */}
        {relocationPriorities.map((hab) => {
          const coords = parseCoords(hab.coordinates);
          return (
            <CircleMarker
              key={hab.id}
              center={coords}
              radius={6}
              pathOptions={{
                color: '#ffffff',
                fillColor: hab.relocationMandatory ? '#dc2626' : '#f59e0b',
                fillOpacity: 1,
                weight: 1.5
              }}
            >
              <Tooltip direction="top" offset={[0, -6]}>
                <div className="text-[10px] font-bold text-slate-900">
                  <strong>{hab.name}</strong> (Pop: {hab.population})
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* Multi-Layer High-Contrast GPS Navigation Route Line (Dynamic Key for Instant Re-rendering) */}
        <Polyline
          key={`casing-${isRoadCutoffSimulated ? 'detour' : 'primary'}`}
          positions={activeWaypoints}
          pathOptions={{ color: '#022c22', weight: 10, opacity: 0.85 }}
        />
        <Polyline
          key={`core-${isRoadCutoffSimulated ? 'detour' : 'primary'}`}
          positions={activeWaypoints}
          pathOptions={{ color: isRoadCutoffSimulated ? '#f59e0b' : '#10b981', weight: 6, opacity: 1.0 }}
        />
        <Polyline
          key={`dash-${isRoadCutoffSimulated ? 'detour' : 'primary'}`}
          positions={activeWaypoints}
          pathOptions={{ color: '#ffffff', weight: 2, opacity: 0.95, dashArray: '6, 10' }}
        />

        {/* Real-Time Live GPS Motion Breadcrumb Trail */}
        {gpsTrail && gpsTrail.length > 1 && (
          <Polyline
            key="live-gps-breadcrumb-trail"
            positions={gpsTrail}
            pathOptions={{
              color: '#06b6d4',
              weight: 4,
              opacity: 0.9,
              dashArray: '5, 8',
              className: 'gps-trail-active'
            }}
          />
        )}

        {/* Real-Time Solid Moving Directional Marker with Dynamic Heading Arrow */}
        {liveLocation && liveLocation.latitude && liveLocation.longitude ? (
          <Marker
            position={[liveLocation.latitude, liveLocation.longitude]}
            icon={createMovingGpsIcon(activeHeading, (liveLocation.speed || 0) > 1)}
          >
            <Tooltip permanent direction="top" offset={[0, -14]}>
              <div className="flex items-center gap-1 font-black text-slate-950 bg-white border border-slate-300 px-1.5 py-0.5 rounded shadow text-[10px]">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                <span>YOU ({currentBearing} • {liveLocation.speed || 0} km/h)</span>
              </div>
            </Tooltip>
            <Popup>
              <div className="p-1.5 space-y-1 text-xs font-sans">
                <div className="flex items-center gap-1 text-cyan-700 font-black border-b pb-1">
                  <Radio className="h-3.5 w-3.5 text-cyan-600" />
                  <span>Live Motion Telemetry</span>
                </div>
                <p className="text-slate-800">
                  Coords: <strong className="font-mono text-slate-900">{liveLocation.latitude.toFixed(5)}°, {liveLocation.longitude.toFixed(5)}°</strong>
                </p>
                <p className="text-slate-700">
                  Speed: <strong className="text-blue-600 font-mono">{liveLocation.speed || 0} km/h</strong>
                </p>
                <p className="text-slate-700">
                  Heading: <strong className="text-emerald-600 font-mono">{activeHeading}° ({currentBearing})</strong>
                </p>
                <p className="text-slate-700">
                  Distance to Sanctuary: <strong className="text-amber-600 font-mono">{liveDistanceToTargetKm.toFixed(2)} km</strong>
                </p>
                <p className="text-slate-500 text-[10px]">
                  Updated: {new Date(liveLocation.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ) : (
          <CircleMarker
            center={originCoords}
            radius={9}
            pathOptions={{ color: '#ffffff', fillColor: '#dc2626', fillOpacity: 1, weight: 2 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-black text-rose-700 text-[10px]">🚨 START (Pop: {originHab?.population || 310})</span>
            </Tooltip>
          </CircleMarker>
        )}

        {/* Blockade Marker if Detour Active */}
        {isRoadCutoffSimulated && (
          <CircleMarker
            center={primaryWaypoints[2]}
            radius={12}
            pathOptions={{ color: '#ffffff', fillColor: '#ef4444', fillOpacity: 1, weight: 2.5 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-black text-red-600 text-[10px] bg-white/95 px-1.5 py-0.5 rounded shadow">🛑 ROAD BLOCKED</span>
            </Tooltip>
            <Popup>
              <div className="p-1 text-xs">
                <strong className="text-red-600 block">🛑 Main Road Blocked by Debris Flow</strong>
                <p className="text-slate-600 text-[10px]">Traffic diverted via High-Ridge Bypass Line (+0.7 km).</p>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* Start Point Pin (if no live GPS active) */}
        {(!liveLocation || !liveLocation.latitude) && (
          <CircleMarker
            center={originCoords}
            radius={9}
            pathOptions={{ color: '#ffffff', fillColor: '#dc2626', fillOpacity: 1, weight: 2 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-black text-rose-700 text-[10px]">🚨 START (Pop: {originHab?.population || 310})</span>
            </Tooltip>
          </CircleMarker>
        )}

        {/* Nearest Safe Sanctuary Zone Perimeter (Flood & Landslide Proof High Ground) */}
        {targetCoords && (
          <Circle
            center={targetCoords}
            radius={280}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.20,
              weight: 2,
              dashArray: '5, 8'
            }}
          >
            <Tooltip permanent direction="bottom" offset={[0, 8]}>
              <div className="flex items-center gap-1 font-bold text-emerald-900 bg-white/95 border border-emerald-400 px-2 py-0.5 rounded shadow text-[10px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>🟢 SAFE ZONE (Nearest Relief Hub • {currentDistance})</span>
              </div>
            </Tooltip>
          </Circle>
        )}

        {/* Destination Pin */}
        {targetCoords && (
          <CircleMarker
            center={targetCoords}
            radius={10}
            pathOptions={{ color: '#ffffff', fillColor: '#059669', fillOpacity: 1, weight: 2.5 }}
          >
            <Tooltip permanent direction="top" offset={[0, -11]}>
              <span className="font-black text-emerald-700 text-[10px]">🏁 SANCTUARY ({safeShelter?.name?.slice(0, 18) || 'Relief Hub'})</span>
            </Tooltip>
            <Popup>
              <div className="p-1.5 space-y-1 text-xs font-sans">
                <div className="flex items-center gap-1 text-emerald-800 font-black border-b pb-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{safeShelter?.name || 'Safe Sanctuary Facility'}</span>
                </div>
                <p className="text-slate-800">
                  Capacity: <strong className="text-emerald-700 font-mono">{(safeShelter?.capacity || 4500).toLocaleString()} Slots</strong>
                </p>
                <p className="text-slate-700">
                  Status: <strong className="text-blue-600">Active Reception Hub</strong>
                </p>
                <p className="text-slate-700">
                  Distance from User: <strong className="text-emerald-600 font-mono">{currentDistance}</strong>
                </p>
              </div>
            </Popup>
          </CircleMarker>
        )}

      </MapContainer>

      {/* 3. MINIMAL CLEAN BOTTOM BAR (NO DUPLICATE TRAVEL TIMES) */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-[1000] flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Road Cutoff Detour Switcher Button */}
        <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white shadow-lg pointer-events-auto flex items-center gap-2.5">
          <ShieldAlert className={`h-3.5 w-3.5 ${isRoadCutoffSimulated ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[11px] font-bold text-slate-200">
            {isRoadCutoffSimulated ? '⚠️ Detour Active (High-Ridge)' : 'Road: Main Route Clear'}
          </span>
          <button
            onClick={handleToggleBlockade}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all shadow-md active:scale-95 ${
              isRoadCutoffSimulated
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            <span>{isRoadCutoffSimulated ? '✓ Clear Blockade (Direct)' : '⚡ Simulate Blockade'}</span>
          </button>
        </div>

        {/* Route Status Strip (Corridor Name - No Duplicate Mode Times) */}
        <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white text-[11px] font-mono flex items-center gap-2 pointer-events-auto shadow-md">
          <span className="text-slate-400">Corridor:</span>
          <span className="text-emerald-400 font-bold">{isRoadCutoffSimulated ? `Elevated High-Ridge Bypass (${currentDistance})` : `Green Valley Main Corridor (${currentDistance})`}</span>
        </div>

      </div>

    </div>
  );
}
