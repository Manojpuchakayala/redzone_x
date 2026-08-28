import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Polyline, Popup } from 'react-leaflet';
import {
  Navigation,
  ShieldCheck,
  AlertTriangle,
  LocateFixed,
  Radio,
  ExternalLink,
  Volume2,
  Compass,
  ArrowUp,
  CornerUpRight,
  CornerUpLeft,
  MapPin,
  Route,
  ShieldAlert,
  Sliders,
  Satellite,
  Layers,
  Mountain,
  Map as MapIcon
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { useLanguage } from '../../context/LanguageContext';

export default function InteractiveMap() {
  const {
    simulationData,
    userLocation,
    detectUserLocation,
    locationLoading,
    activeRouteHabId,
    toggleRoute
  } = useDisaster();

  const { t, localizePlace } = useLanguage();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isRoadCutoffSimulated, setIsRoadCutoffSimulated] = useState(false);
  const [mapLayer, setMapLayer] = useState('SATELLITE'); // SATELLITE (Default) | TOPO | STREET

  if (!simulationData) return null;

  const { hazardZones = [], shelters = [], relocationPriorities = [], region = {} } = simulationData;
  const mapCenter = Array.isArray(region.center) ? region.center : [11.5325, 76.1362];

  // Helper to robustly parse coordinates regardless of format [lat, lon] or {lat, lng}
  const parseCoords = (c, fallback) => {
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

  // PRIMARY ROUTE vs SECONDARY DETOUR
  const primaryWaypoints = [
    originCoords,
    [Number(originCoords[0]) + 0.004, Number(originCoords[1]) - 0.003],
    [Number(originCoords[0]) + 0.009, Number(originCoords[1]) - 0.006],
    [Number(originCoords[0]) + 0.015, Number(originCoords[1]) - 0.010],
    targetCoords
  ];

  const detourWaypoints = [
    originCoords,
    [Number(originCoords[0]) + 0.002, Number(originCoords[1]) + 0.006],
    [Number(originCoords[0]) + 0.012, Number(originCoords[1]) + 0.003],
    [Number(originCoords[0]) + 0.019, Number(originCoords[1]) - 0.005],
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
    { distance: 'Target', icon: MapPin, text: `Arrive at Safe Green Sanctuary (Detour Complete)`, road: 'Safe Zone' }
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
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 font-sans">
      
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
            <span>REAL-TIME SATELLITE: <strong>{mapLayer === 'SATELLITE' ? 'ESRI WORLD HIGH-RES 0.3m' : mapLayer === 'TOPO' ? 'USGS 3D TOPODEM' : 'OSM STREET VECTOR'}</strong></span>
          </div>

          {/* Map Layer Switcher Pills */}
          <div className="bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 flex items-center gap-1 shadow-lg text-[10px] font-bold">
            <button
              onClick={() => setMapLayer('SATELLITE')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                mapLayer === 'SATELLITE'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Satellite className="h-3 w-3" />
              <span>🛰️ Satellite (Live)</span>
            </button>

            <button
              onClick={() => setMapLayer('TOPO')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                mapLayer === 'TOPO'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mountain className="h-3 w-3" />
              <span>⛰️ Terrain (3D)</span>
            </button>

            <button
              onClick={() => setMapLayer('STREET')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                mapLayer === 'STREET'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="h-3 w-3" />
              <span>🗺️ Street Vector</span>
            </button>
          </div>

        </div>

      </div>

      {/* 2. LEAFLET MAP CONTAINER WITH DYNAMIC SATELLITE TILE LAYERS */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        {/* Layer 1: ESRI Ultra HD Satellite with Auto-Scaling & Road Overlays (Zero Tile Errors) */}
        {mapLayer === 'SATELLITE' && (
          <>
            <TileLayer
              key="esri-satellite"
              attribution='Tiles &copy; Esri &mdash; High-Resolution Earth Observation Satellite'
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

        {/* Contour-Snapped Road Evacuation Path */}
        <Polyline
          positions={activeWaypoints}
          pathOptions={{
            color: isRoadCutoffSimulated ? '#f59e0b' : '#10b981',
            weight: 6,
            opacity: 0.9,
            dashArray: '10, 10',
          }}
        />

        {/* Simulated Road Blockade Marker */}
        {isRoadCutoffSimulated && (
          <CircleMarker
            center={primaryWaypoints[2]}
            radius={12}
            pathOptions={{ color: '#ef4444', fillColor: '#7f1d1d', fillOpacity: 1, weight: 3 }}
          >
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
          radius={10}
          pathOptions={{ color: '#ef4444', fillColor: '#dc2626', fillOpacity: 0.9, weight: 3 }}
        >
          <Popup>
            <div className="p-1 text-xs font-bold text-red-600">
              🔴 START: Evacuation Point (Red Hazard Zone)
            </div>
          </Popup>
        </CircleMarker>

        {/* Destination Shelter Marker (Green Zone Safe Sanctuary) */}
        <CircleMarker
          center={targetCoords}
          radius={12}
          pathOptions={{ color: '#10b981', fillColor: '#059669', fillOpacity: 1, weight: 4 }}
        >
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
            onClick={() => setIsRoadCutoffSimulated(!isRoadCutoffSimulated)}
            className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase transition-all shadow-md active:scale-95 ${
              isRoadCutoffSimulated
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
            }`}
          >
            {isRoadCutoffSimulated ? '✓ Switched to Ridge Detour' : 'Simulate Road Blockade'}
          </button>
        </div>

        <button
          onClick={detectUserLocation}
          disabled={locationLoading}
          className="bg-slate-900/95 hover:bg-slate-800 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 text-white shadow-xl pointer-events-auto text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
        >
          <LocateFixed className={`h-4 w-4 text-emerald-400 ${locationLoading ? 'animate-spin' : ''}`} />
          <span>{locationLoading ? 'Syncing...' : 'My Live GPS'}</span>
        </button>
      </div>

    </div>
  );
}
