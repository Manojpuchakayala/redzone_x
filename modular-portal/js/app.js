/**
 * GeoResilience AI - Master Application Orchestrator
 * Features:
 * - What-If Relocation Digital Twin
 * - Offline-First Local Storage Cache
 * - Automatic Split Allocation Coordinator
 */
import { disasterData } from './data.js';
import { calculateSimulation } from './engine.js';
import { MapManager } from './mapManager.js';
import { UIController } from './uiController.js';
import { exportNDMADirectivePdf } from './pdfGenerator.js';

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
