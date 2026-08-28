import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Polyline,
  CircleMarker,
  Popup,
  Tooltip,
  useMap
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
  Bus,
  Bike,
  Car,
  Footprints,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

// Dynamic Camera Controller
function MapCameraController({ center, waypoints, shouldFitBounds, onBoundsFitted }) {
  const map = useMap();

  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, map.getZoom() || 14, { duration: 1.2, easeLinearity: 0.25 });
    }
  }, [center, map]);

  useEffect(() => {
    if (shouldFitBounds && waypoints && waypoints.length >= 2) {
      const bounds = waypoints.map(w => [w[0], w[1]]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, duration: 1.2 });
      if (onBoundsFitted) onBoundsFitted();
    }
  }, [shouldFitBounds, waypoints, map, onBoundsFitted]);

  return null;
}

// Floating Zoom Controls
function CustomMapControls({ onRecenterRoute, onLocateGPS }) {
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
        onClick={onRecenterRoute}
        title="Recenter Route"
        className="h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 flex items-center justify-center shadow-lg active:scale-95 transition-all mt-0.5"
      >
        <Navigation className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onLocateGPS}
        title="My GPS Position"
        className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/50 flex items-center justify-center shadow-lg active:scale-95 transition-all"
      >
        <LocateFixed className="h-3.5 w-3.5" />
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
  const [transitMode, setTransitMode] = useState('BUS'); // 'BUS' | 'CYCLE' | 'CAR' | 'WALK'
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [shouldFitBounds, setShouldFitBounds] = useState(true);

  const region = simulationData?.region || {};
  const summary = simulationData?.summary || {};
  const hazardZones = simulationData?.hazardZones || [];
  const shelters = simulationData?.reliefShelters || [];
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

  const defaultCenter = parseCoords(region.center, [11.5325, 76.1362]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if (region.center) {
      setMapCenter(parseCoords(region.center, [11.5325, 76.1362]));
      setShouldFitBounds(true);
    }
  }, [region.center]);

  const originHab = relocationPriorities && relocationPriorities.length > 0 ? relocationPriorities[0] : null;
  const originCoords = userLocation
    ? parseCoords(userLocation, [11.546, 76.132])
    : originHab
    ? parseCoords(originHab.coordinates, [11.546, 76.132])
    : [11.546, 76.132];

  const safeShelter = shelters && shelters.length > 0 ? shelters[0] : null;
  const targetCoords = safeShelter
    ? parseCoords(safeShelter.coordinates, [11.552, 76.122])
    : [11.552, 76.122];

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

  const transitTimes = {
    BUS: {
      label: 'Bus',
      icon: Bus,
      directTime: '16m',
      detourTime: '22m',
      googleMode: 'driving',
      voiceText: isRoadCutoffSimulated
        ? "Heavy Evacuation Bus Convoy route active via High-Ridge Bypass. 22 minutes to Safe Sanctuary."
        : "Heavy Evacuation Bus Convoy route active. 16 minutes to Meppadi Safe Sanctuary."
    },
    CYCLE: {
      label: 'Cycle',
      icon: Bike,
      directTime: '21m',
      detourTime: '28m',
      googleMode: 'two_wheeler',
      voiceText: isRoadCutoffSimulated
        ? "Bicycle and two-wheeler route active on High-Ridge Trail. 28 minutes to Safe Sanctuary."
        : "Bicycle and two-wheeler route active. 21 minutes to Meppadi Safe Sanctuary."
    },
    CAR: {
      label: 'Car',
      icon: Car,
      directTime: '11m',
      detourTime: '14m',
      googleMode: 'driving',
      voiceText: isRoadCutoffSimulated
        ? "Emergency Vehicle route active via Elevated Bypass. 14 minutes to Meppadi Safe Sanctuary."
        : "Car and Ambulance emergency route active. 11 minutes to Safe Sanctuary."
    },
    WALK: {
      label: 'Walk',
      icon: Footprints,
      directTime: '48m',
      detourTime: '62m',
      googleMode: 'walking',
      voiceText: isRoadCutoffSimulated
        ? "Pedestrian foot evacuation corridor active on high ridge. 62 minutes to Safe Sanctuary."
        : "Pedestrian foot evacuation corridor active. 48 minutes to Meppadi Safe Sanctuary."
    }
  };

  const currentTransit = transitTimes[transitMode] || transitTimes.BUS;
  const currentEta = isRoadCutoffSimulated ? currentTransit.detourTime : currentTransit.directTime;
  const currentDistance = isRoadCutoffSimulated ? '4.1 km' : '3.4 km';

  const handleVoiceGuidance = () => {
    if ('speechSynthesis' in window) {
      setIsVoiceActive(true);
      const utterance = new SpeechSynthesisUtterance(currentTransit.voiceText);
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

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 font-sans select-none">
      
      {/* 1. ULTRA-COMPACT SLIM TOP NAVIGATION HUD (MAXIMIZING MAP VIEWPORT) */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex flex-col gap-1.5 pointer-events-none">
        
        {/* Streamlined Single-Row Navigation Bar */}
        <div className="bg-slate-950/95 backdrop-blur-xl text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700/80 flex items-center justify-between pointer-events-auto transition-all flex-wrap gap-2">
          
          {/* Active Navigation Step & Mode ETA */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
              <CornerUpRight className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-black text-white leading-none truncate">
                <span className="text-emerald-400">{isRoadCutoffSimulated ? '⚠️ Detour:' : '🟢 Escape:'}</span>
                <span className="truncate">{originHab?.name || 'Red Zone'} ➔ {safeShelter?.name || 'Sanctuary'}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-800">
                  {currentEta} • {currentDistance}
                </span>
              </div>
            </div>
          </div>

          {/* COMPACT TRANSIT MODE SWITCHER (SINGLE INSTANCE) */}
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
          <div className="flex items-center gap-1.5">
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

            {/* Compact Layer Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700 p-0.5 rounded-lg text-[10px] font-bold">
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
            </div>
          </div>
        </div>

        {/* Minimal Population Strip */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-300 flex items-center gap-2 shadow-md">
            <span className="text-rose-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              Red Zone: <strong className="text-white font-mono">{redZonePopulation.toLocaleString()}</strong> Pers
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Safe Capacity: <strong className="text-white font-mono">{totalShelterCapacity.toLocaleString()}</strong> Slots
            </span>
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
        <MapCameraController
          center={mapCenter}
          waypoints={activeWaypoints}
          shouldFitBounds={shouldFitBounds}
          onBoundsFitted={() => setShouldFitBounds(false)}
        />

        <CustomMapControls
          onRecenterRoute={() => setShouldFitBounds(true)}
          onLocateGPS={async () => {
            await detectUserLocation();
            setShouldFitBounds(true);
          }}
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

        {/* Small, Compact Hazard Risk Polygons (Clear Satellite View) */}
        {hazardZones.map((zone) => {
          const lat = Number(zone.lat || 11.5325);
          const lon = Number(zone.lon || 76.1362);
          const isRed = zone.severity === 'CRITICAL' || zone.colorHex === '#ef4444' || zone.color === '#ef4444';
          const radius = Math.min((zone.radiusMeters || 600) * 0.4, 220); // Small, compact radius

          return (
            <Circle
              key={zone.id}
              center={[lat, lon]}
              radius={radius}
              pathOptions={{
                color: zone.color || (isRed ? '#ef4444' : '#f59e0b'),
                fillColor: zone.color || (isRed ? '#ef4444' : '#f59e0b'),
                fillOpacity: isRed ? 0.25 : 0.15,
                weight: 1.5,
              }}
            >
              <Tooltip direction="top" offset={[0, -5]}>
                <div className="font-bold text-[10px] text-slate-900">
                  <span className="text-red-600 font-black">{zone.name}</span>
                  <span className="block text-slate-700">👥 {zone.population || 1200} Citizens Living Here</span>
                </div>
              </Tooltip>
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <strong className="block text-red-600 font-black">{zone.name}</strong>
                  <p className="text-slate-800">👥 Population: <strong>{zone.population || 1200} Citizens</strong></p>
                  <p className="text-slate-700">MHI Susceptibility: {Math.round((zone.mhi || 0.8) * 100)}%</p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Settlement Markers */}
        {relocationPriorities.map((hab) => {
          const coords = parseCoords(hab.coordinates);
          const fp = hab.fingerprint || {};
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

        {/* Multi-Layer High-Contrast GPS Navigation Route Line */}
        <Polyline
          positions={activeWaypoints}
          pathOptions={{ color: '#022c22', weight: 10, opacity: 0.85 }}
        />
        <Polyline
          positions={activeWaypoints}
          pathOptions={{ color: isRoadCutoffSimulated ? '#f59e0b' : '#10b981', weight: 6, opacity: 1.0 }}
        />
        <Polyline
          positions={activeWaypoints}
          pathOptions={{ color: '#ffffff', weight: 2, opacity: 0.95, dashArray: '6, 10' }}
        />

        {/* Blockade Marker if Detour Active */}
        {isRoadCutoffSimulated && (
          <CircleMarker
            center={primaryWaypoints[2]}
            radius={10}
            pathOptions={{ color: '#ef4444', fillColor: '#7f1d1d', fillOpacity: 1, weight: 2 }}
          >
            <Tooltip permanent direction="top" offset={[0, -8]}>
              <span className="font-black text-red-600 text-[10px]">🛑 BLOCKED</span>
            </Tooltip>
          </CircleMarker>
        )}

        {/* Start Point Pin */}
        <CircleMarker
          center={originCoords}
          radius={9}
          pathOptions={{ color: '#ffffff', fillColor: '#dc2626', fillOpacity: 1, weight: 2 }}
        >
          <Tooltip permanent direction="top" offset={[0, -10]}>
            <span className="font-black text-rose-700 text-[10px]">🚨 START (Pop: {originHab?.population || 310})</span>
          </Tooltip>
        </CircleMarker>

        {/* Destination Pin */}
        <CircleMarker
          center={targetCoords}
          radius={10}
          pathOptions={{ color: '#ffffff', fillColor: '#059669', fillOpacity: 1, weight: 2.5 }}
        >
          <Tooltip permanent direction="top" offset={[0, -11]}>
            <span className="font-black text-emerald-700 text-[10px]">🟢 DESTINATION ({safeShelter?.name?.slice(0, 16) || 'Sanctuary'})</span>
          </Tooltip>
        </CircleMarker>

      </MapContainer>

      {/* 3. MINIMAL CLEAN BOTTOM BAR (NO DUPLICATE TRAVEL TIMES) */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-[1000] flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Road Cutoff Detour Switcher */}
        <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white shadow-lg pointer-events-auto flex items-center gap-2.5">
          <ShieldAlert className={`h-3.5 w-3.5 ${isRoadCutoffSimulated ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[11px] font-bold text-slate-200">
            {isRoadCutoffSimulated ? '⚠️ Detour Active (High-Ridge)' : 'Road: Clear'}
          </span>
          <button
            onClick={() => {
              setIsRoadCutoffSimulated(!isRoadCutoffSimulated);
              setShouldFitBounds(true);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all shadow-md active:scale-95 ${
              isRoadCutoffSimulated
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            <span>{isRoadCutoffSimulated ? '✓ Clear Blockade' : '⚡ Simulate Blockade'}</span>
          </button>
        </div>

        {/* Minimal Route Distance Pill */}
        <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white text-[11px] font-mono flex items-center gap-2 pointer-events-auto shadow-md">
          <span className="text-slate-400">Route:</span>
          <span className="text-emerald-400 font-bold">{currentDistance}</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-bold">{currentEta} ({currentTransit.label})</span>
        </div>

      </div>

    </div>
  );
}
