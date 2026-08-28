import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import { Layers } from 'lucide-react';

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapViewer({ region, hazardZones, reliefShelters, habitations, activeRoute }) {
  if (!region) return null;

  return (
    <div className="w-full h-full relative">
      
      {/* Floating Map Legend (Top Right) */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 shadow-2xl flex items-center gap-3.5">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" /> Red Zone</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Orange</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Green (Safe)</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500 border border-white" /> Village</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-purple-500 border border-white" /> Shelter</span>
      </div>

      {/* Floating Evacuation Route Banner (Bottom Left) */}
      {activeRoute && (
        <div className="absolute bottom-6 left-6 z-[1000] bg-emerald-950/95 backdrop-blur-md border border-emerald-500/60 px-4 py-2.5 rounded-xl text-xs text-emerald-200 shadow-2xl flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Active Safe Evacuation Corridor: <strong>{activeRoute.safetyRating}</strong></span>
          <span className="font-mono bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
            {activeRoute.distanceKm} km • ~{activeRoute.transitMinutes} mins
          </span>
        </div>
      )}

      {/* Full-Height Leaflet Map */}
      <MapContainer center={region.center} zoom={region.zoom} scrollWheelZoom={true} className="h-full w-full">
        <MapUpdater center={region.center} zoom={region.zoom} />
        
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hazard Polygons */}
        {hazardZones?.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates}
            pathOptions={{
              color: zone.colorHex,
              fillColor: zone.colorHex,
              fillOpacity: zone.zoneCategory === "RED_ZONE" ? 0.65 : 0.35,
              weight: zone.zoneCategory === "RED_ZONE" ? 3.5 : 2,
              className: zone.zoneCategory === "RED_ZONE" ? "gov-red-pulse" : "",
            }}
          >
            <Popup>
              <div className="p-1 space-y-1 text-xs">
                <div className="font-bold text-slate-900 text-sm border-b pb-1 flex items-center justify-between">
                  <span>{zone.name}</span>
                  <span style={{ color: zone.colorHex }} className="font-black">{zone.zoneCategory.replace("_", " ")}</span>
                </div>
                <div>Slope: <strong>{zone.baseSlope}°</strong></div>
                <div>Soil: <strong>{zone.soilType}</strong></div>
                <div>Hazard Index: <strong style={{ color: zone.colorHex }}>{(zone.susceptibilityIndex * 100).toFixed(0)}%</strong></div>
                <div className="text-slate-600 text-[11px] bg-slate-100 p-1.5 rounded mt-1 font-medium">{zone.actionRecommendation}</div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Safe Relief Shelters */}
        {reliefShelters?.map((shelter) => (
          <CircleMarker
            key={shelter.id}
            center={shelter.coordinates}
            radius={11}
            pathOptions={{ color: "#ffffff", fillColor: "#9333ea", fillOpacity: 0.95, weight: 3 }}
          >
            <Popup>
              <div className="p-1 space-y-1 text-xs">
                <strong className="text-purple-900 font-black block text-sm border-b pb-1">🏛️ {shelter.name}</strong>
                <div className="text-emerald-700 font-bold">✓ Multi-Disaster Verified Safe Green Zone</div>
                <div>Total Capacity: <strong>{shelter.capacity} Persons</strong></div>
                <div>Available Slots: <strong className="text-blue-700 font-bold">{shelter.capacity - shelter.currentOccupancy} Available</strong></div>
                <div>Medical Support: {shelter.medicalFacility}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Habitations */}
        {habitations?.map((hab) => (
          <CircleMarker
            key={hab.id}
            center={hab.coordinates}
            radius={hab.relocationMandatory ? 9 : 7}
            pathOptions={{
              color: "#ffffff",
              fillColor: hab.relocationMandatory ? "#dc2626" : "#2563eb",
              fillOpacity: 0.95,
              weight: 2.5,
            }}
          >
            <Popup>
              <div className="p-1 space-y-1 text-xs">
                <strong className="text-slate-900 block font-bold text-sm border-b pb-1">🏡 {hab.name} (Rank #{hab.priorityRank})</strong>
                <div>Population: <strong className="text-slate-900 font-bold">{hab.population} Citizens</strong></div>
                <div>VPS Score: <strong className="text-red-600">{(hab.vulnerabilityPriorityScore * 100).toFixed(0)}%</strong></div>
                <div>Action: <span className="font-bold text-red-700">{hab.urgencyLevel}</span></div>
                <div>Assigned Shelter: <strong className="text-purple-700">{hab.assignedShelter?.name}</strong></div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Active Glowing Safe Evacuation Route */}
        {activeRoute && (
          <Polyline
            positions={activeRoute.waypoints}
            pathOptions={{ color: "#16a34a", weight: 6, className: "gov-active-corridor" }}
          />
        )}
      </MapContainer>
    </div>
  );
}
