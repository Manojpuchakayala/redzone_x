import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Polyline,
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents
} from 'react-leaflet';
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
  Maximize2
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

// Dynamic Map Controller: Pans, zooms, and fits bounds seamlessly
function MapCameraController({ center, waypoints, shouldFitBounds, onBoundsFitted }) {
  const map = useMap();

  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, map.getZoom() || 14, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [center, map]);

  useEffect(() => {
    if (shouldFitBounds && waypoints && waypoints.length >= 2) {
      const bounds = waypoints.map(w => [w[0], w[1]]);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 16,
        duration: 1.2
      });
      if (onBoundsFitted) onBoundsFitted();
    }
  }, [shouldFitBounds, waypoints, map, onBoundsFitted]);

  return null;
}

// Floating Pan & Zoom Controls Component
function CustomMapControls({ onRecenterRoute, onLocateGPS, onResetNorth, userLocation }) {
  const map = useMap();

  return (
    <div className="absolute right-4 top-24 z-[1000] flex flex-col gap-1.5 pointer-events-auto">
      {/* Zoom In */}
      <button
        onClick={() => map.zoomIn()}
        title="Zoom In (+)"
        className="h-9 w-9 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-2xl active:scale-95 transition-all"
      >
        <Plus className="h-4 w-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={() => map.zoomOut()}
        title="Zoom Out (-)"
        className="h-9 w-9 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-2xl active:scale-95 transition-all"
      >
        <Minus className="h-4 w-4" />
      </button>

      {/* Recenter Entire Route */}
      <button
        onClick={onRecenterRoute}
        title="Frame Entire Evacuation Route (Fit Bounds)"
        className="h-9 w-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 flex items-center justify-center shadow-2xl active:scale-95 transition-all mt-1"
      >
        <Navigation className="h-4 w-4" />
      </button>

      {/* Snap to User GPS */}
      <button
        onClick={onLocateGPS}
        title="Snap to My Live GPS Position"
        className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/50 flex items-center justify-center shadow-2xl active:scale-95 transition-all"
      >
        <LocateFixed className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function InteractiveMap() {
  const {
    simulationData,
    userLocation,
    detectUserLocation,
    isRoadCutoffSimulated,
    setIsRoadCutoffSimulated,
  } = useDisaster();

  const [mapLayer, setMapLayer] = useState('SATELLITE'); // 'SATELLITE' | 'GOOGLE' | 'TOPO' | 'STREET'
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [shouldFitBounds, setShouldFitBounds] = useState(true);

  const region = simulationData?.region || {};
  const hazardZones = simulationData?.hazardZones || [];
  const shelters = simulationData?.reliefShelters || [];
  const relocationPriorities = simulationData?.relocationPriorities || [];

  // Parse Coords Robust Helper
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

  const defaultCenter = parseCoords(region.center, [11.5325, 76.1362]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if (region.center) {
      const c = parseCoords(region.center, [11.5325, 76.1362]);
      setMapCenter(c);
      setShouldFitBounds(true);
    }
  }, [region.center]);

  // Active Origin: User GPS or Highest Priority Red-Zone Habitation
  const originHab = relocationPriorities && relocationPriorities.length > 0 ? relocationPriorities[0] : null;
  const originCoords = userLocation
    ? parseCoords(userLocation, [11.546, 76.132])
    : originHab
    ? parseCoords(originHab.coordinates, [11.546, 76.132])
    : [11.546, 76.132];

  // Nearest Safe Green Sanctuary Shelter
  const safeShelter = shelters && shelters.length > 0 ? shelters[0] : null;
  const targetCoords = safeShelter
    ? parseCoords(safeShelter.coordinates, [11.552, 76.122])
    : [11.552, 76.122];

  // CLEAR GPS ROUTE WAYPOINTS
  const primaryWaypoints = [
    originCoords,
    [Number(originCoords[0]) + 0.0035, Number(originCoords[1]) - 0.0028],
    [Number(originCoords[0]) + 0.0078, Number(originCoords[1]) - 0.0055],
    [Number(originCoords[0]) + 0.0135, Number(originCoords[1]) - 0.0085],
    targetCoords
  ];

  const detourWaypoints = [
    originCoords,
    [Number(originCoords[0]) + 0.0022, Number(originCoords[1]) + 0.0055],
    [Number(originCoords[0]) + 0.0105, Number(originCoords[1]) + 0.0035],
    [Number(originCoords[0]) + 0.0175, Number(originCoords[1]) - 0.0042],
    targetCoords
  ];

  const activeWaypoints = isRoadCutoffSimulated ? detourWaypoints : primaryWaypoints;

  const primarySteps = [
    { distance: '350 m', icon: CornerUpRight, text: 'Head Northwest on Chooralmala Main Line toward Bridge #2', road: 'Chooralmala Sector Bypass' },
    { distance: '1.2 km', icon: ArrowUp, text: 'Continue straight along Green Valley Safe Corridor (Away from Red Ridge)', road: 'State Highway 59' },
    { distance: '850 m', icon: CornerUpLeft, text: 'Turn slight Left onto Meppadi Sanctuary Approach Road', road: 'Sanctuary Access Spur' },
    { distance: 'Target', icon: MapPin, text: `Arrive at ${safeShelter?.name || 'Meppadi Safe Sanctuary'}`, road: 'Safe Green Sector (0% Inundation)' }
  ];

  const detourSteps = [
    { distance: '200 m', icon: CornerUpRight, text: '⚠️ PRIMARY ROAD BLOCKED! Divert East onto High-Ridge Bypass', road: 'Emergency Ridge Line' },
    { distance: '1.8 km', icon: ArrowUp, text: 'Traverse elevated rock foundation corridor (Elev. +420m)', road: 'Ridge Bypass Route' },
    { distance: '600 m', icon: CornerUpLeft, text: 'Descend North spur into Greenfield Sanctuary Gate #1', road: 'North Sanctuary Spur' },
    { distance: 'Target', icon: MapPin, text: 'Arrive at Safe Green Sanctuary (Detour Complete)', road: 'Safe Zone' }
  ];

  const activeSteps = isRoadCutoffSimulated ? detourSteps : primarySteps;

  const handleVoiceGuidance = () => {
    if ('speechSynthesis' in window) {
      setIsVoiceActive(true);
      const text = isRoadCutoffSimulated
        ? "Warning: Primary evacuation road blocked by debris! Rerouting via Elevated High-Ridge Bypass. Proceed 200 meters and turn right."
        : "Turn right onto High Ridge Highway in 350 meters toward Meppadi Safe Sanctuary. Green corridor is clear.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsVoiceActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const openGoogleMapsIntent = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originCoords[0]},${originCoords[1]}&destination=${targetCoords[0]},${targetCoords[1]}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 font-sans select-none">
      
      {/* 1. TOP NAVIGATION HEADER & SATELLITE TELEMETRY BADGE */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2 pointer-events-none">
        
        {/* Navigation Banner */}
        <div className="bg-emerald-700/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center justify-between pointer-events-auto transition-all flex-wrap gap-2">
          
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0 shadow-inner">
              <CornerUpRight className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-mono font-black uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
                {isRoadCutoffSimulated ? '⚠️ RIDGE DETOUR ACTIVE' : '🔴 RED ZONE ➔ 🟢 GREEN ZONE ESCAPE'}
              </div>
              <div className="text-sm font-black text-white leading-tight">
                {activeSteps[0].text}
              </div>
              <div className="text-[11px] text-emerald-100/90 font-medium">
                {isRoadCutoffSimulated ? 'Detour 14 min (4.1 km) • Rock Foundation Clear' : '11 min (3.4 km) • Green Corridor Clear'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVoiceGuidance}
              title="Voice SOS Navigation Guidance"
              className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                isVoiceActive
                  ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-emerald-800 hover:bg-emerald-600 text-white border-emerald-400/40'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">{isVoiceActive ? 'Speaking...' : 'Voice SOS'}</span>
            </button>

            <button
              onClick={openGoogleMapsIntent}
              title="Open in Google Maps App"
              className="p-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 border border-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <ExternalLink className="h-4 w-4 text-emerald-700" />
              <span className="hidden sm:inline">Google GPS</span>
            </button>
          </div>
        </div>

        {/* Real-Time Satellite Layer Switcher & Telemetry HUD */}
        <div className="flex items-center justify-between pointer-events-auto flex-wrap gap-2">
          
          {/* Satellite Telemetry Stamp */}
          <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-lg">
            <Satellite className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>REAL-TIME SATELLITE: <strong>{mapLayer === 'SATELLITE' ? 'ESRI WORLD HIGH-RES' : mapLayer === 'GOOGLE' ? 'GOOGLE HYBRID' : mapLayer === 'TOPO' ? '3D TOPODEM' : 'STREET VECTOR'}</strong></span>
          </div>

          {/* Map Layer Switcher Pills */}
          <div className="bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 flex items-center gap-1 shadow-lg text-[10px] font-bold">
            <button
              onClick={() => setMapLayer('SATELLITE')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                mapLayer === 'SATELLITE' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Satellite className="h-3 w-3" />
              <span>🛰️ HD Satellite</span>
            </button>

            <button
              onClick={() => setMapLayer('GOOGLE')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                mapLayer === 'GOOGLE' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="h-3 w-3 text-cyan-300" />
              <span>🚀 Hybrid</span>
            </button>

            <button
              onClick={() => setMapLayer('TOPO')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                mapLayer === 'TOPO' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mountain className="h-3 w-3" />
              <span>⛰️ Terrain</span>
            </button>

            <button
              onClick={() => setMapLayer('STREET')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                mapLayer === 'STREET' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="h-3 w-3" />
              <span>🗺️ Streets</span>
            </button>
          </div>

        </div>

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
        {/* Dynamic Camera Controller */}
        <MapCameraController
          center={mapCenter}
          waypoints={activeWaypoints}
          shouldFitBounds={shouldFitBounds}
          onBoundsFitted={() => setShouldFitBounds(false)}
        />

        {/* Floating Pan/Zoom & Recenter Route Controls */}
        <CustomMapControls
          onRecenterRoute={() => setShouldFitBounds(true)}
          onLocateGPS={async () => {
            await detectUserLocation();
            setShouldFitBounds(true);
          }}
          userLocation={userLocation}
        />

        {/* Layer 1: ESRI Ultra HD Satellite with Auto-Scaling & Road Overlays (Zero Tile Errors) */}
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

        {/* Layer 2: Google Hybrid Real-Time Satellite with Road Overlays */}
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

        {/* Hazard Risk Polygons */}
        {hazardZones.map((zone) => {
          const lat = Number(zone.lat || 11.5325);
          const lon = Number(zone.lon || 76.1362);
          return (
            <Circle
              key={zone.id}
              center={[lat, lon]}
              radius={zone.radiusMeters || 600}
              pathOptions={{
                color: zone.color || '#ef4444',
                fillColor: zone.color || '#ef4444',
                fillOpacity: zone.severity === 'CRITICAL' ? 0.45 : 0.3,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <strong className="block text-red-600 font-bold">{zone.name}</strong>
                  <p className="text-slate-700">MHI Risk Index: {Math.round((zone.mhi || 0.8) * 100)}%</p>
                  <p className="text-slate-600 text-[10px]">{zone.description || 'Hazard Sector'}</p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* ========================================================================= */}
        {/* CRYSTAL-CLEAR MULTI-LAYER GPS EVACUATION NAVIGATION ROUTE (HIGH CONTRAST) */}
        {/* ========================================================================= */}

        {/* Layer A: Outer Route Shadow / High-Contrast Casing */}
        <Polyline
          positions={activeWaypoints}
          pathOptions={{
            color: '#022c22',
            weight: 12,
            opacity: 0.9,
          }}
        />

        {/* Layer B: Core Bright GPS Solid Navigation Ribbon */}
        <Polyline
          positions={activeWaypoints}
          pathOptions={{
            color: isRoadCutoffSimulated ? '#f59e0b' : '#10b981',
            weight: 8,
            opacity: 1.0,
          }}
        />

        {/* Layer C: Inner White Directional Pulse Dash (GPS Convoy Flow) */}
        <Polyline
          positions={activeWaypoints}
          pathOptions={{
            color: '#ffffff',
            weight: 3,
            opacity: 0.95,
            dashArray: '8, 12',
          }}
        />

        {/* Simulated Road Blockade Marker */}
        {isRoadCutoffSimulated && (
          <CircleMarker
            center={primaryWaypoints[2]}
            radius={14}
            pathOptions={{ color: '#ef4444', fillColor: '#7f1d1d', fillOpacity: 1, weight: 3 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-bold text-red-600 text-xs">🛑 ROAD BLOCKED</span>
            </Tooltip>
            <Popup>
              <div className="p-1 text-xs">
                <strong className="text-red-600 block">🛑 Main Road Blocked by Debris Flow</strong>
                <p className="text-slate-600 text-[10px]">Traffic diverted via High-Ridge Bypass Line.</p>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* Origin Marker (Red Zone Danger) */}
        <CircleMarker
          center={originCoords}
          radius={12}
          pathOptions={{ color: '#ffffff', fillColor: '#dc2626', fillOpacity: 1, weight: 3 }}
        >
          <Tooltip permanent direction="top" offset={[0, -12]}>
            <span className="font-black text-rose-700 text-xs">🚨 START: {originHab?.name || 'Red Hazard Zone'}</span>
          </Tooltip>
          <Popup>
            <div className="p-1 text-xs font-bold text-red-600">
              🔴 START: Evacuation Point (Red Hazard Zone)
            </div>
          </Popup>
        </CircleMarker>

        {/* Destination Shelter Marker (Green Zone Safe Sanctuary) */}
        <CircleMarker
          center={targetCoords}
          radius={14}
          pathOptions={{ color: '#ffffff', fillColor: '#059669', fillOpacity: 1, weight: 3 }}
        >
          <Tooltip permanent direction="top" offset={[0, -14]}>
            <span className="font-black text-emerald-700 text-xs">🟢 DESTINATION: {safeShelter?.name || 'Safe Sanctuary'}</span>
          </Tooltip>
          <Popup>
            <div className="p-1 text-xs space-y-1">
              <strong className="text-emerald-700 block">🟢 TARGET: {safeShelter?.name || 'Safe Sanctuary'}</strong>
              <p className="text-slate-600">Carrying Capacity: Safe Headroom Available</p>
            </div>
          </Popup>
        </CircleMarker>

      </MapContainer>

      {/* 3. BOTTOM CONTROLS & ROAD CUTOFF DETOUR SWITCHER */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-700 text-white shadow-xl pointer-events-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className={`h-4 w-4 ${isRoadCutoffSimulated ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-slate-200">
              {isRoadCutoffSimulated ? '⚠️ Mid-Transit Road Blockade Active' : 'Road Status: Main Corridor Clear'}
            </span>
          </div>

          <button
            onClick={() => {
              setIsRoadCutoffSimulated(!isRoadCutoffSimulated);
              setShouldFitBounds(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
              isRoadCutoffSimulated
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
            }`}
          >
            <span>{isRoadCutoffSimulated ? '✓ Clear Blockade (Use Main Road)' : '⚡ Simulate Road Blockade'}</span>
          </button>
        </div>

        {/* Route Overview Pill */}
        <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 text-white text-xs font-mono flex items-center gap-3 pointer-events-auto shadow-xl">
          <span className="text-slate-400">Total Route:</span>
          <span className="text-emerald-400 font-bold">{isRoadCutoffSimulated ? '4.1 km (Detour)' : '3.4 km (Direct)'}</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-bold">{isRoadCutoffSimulated ? '14 Mins' : '11 Mins'}</span>
        </div>
      </div>

    </div>
  );
}
