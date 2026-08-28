/**
 * GeoResilience AI - Leaflet GIS Map Manager Module
 */
export class MapManager {
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
