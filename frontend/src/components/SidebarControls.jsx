import React from 'react';
import { Flame, Users, ShieldCheck, Scale, CloudRain, AlertOctagon, Bus, Navigation, Fingerprint, Sparkles } from 'lucide-react';

export default function SidebarControls({
  summary,
  rainfall,
  onRainfallChange,
  onPresetSelect,
  activeTab,
  onTabChange,
  habitations,
  relocationSites,
  activeRouteHabId,
  onSelectRoute,
  onToggleDigitalTwin,
}) {
  return (
    <div className="h-full flex flex-col overflow-hidden text-slate-200">
      
      {/* 1. KPI Strip */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-rose-900/40 border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-rose-400">
              <span>Red Zones</span>
              <Flame className="h-3 w-3 text-rose-500 animate-pulse" />
            </div>
            <div className="text-xl font-black text-white mt-0.5">{summary?.redZonesCount || 0} Zones</div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-amber-900/40 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-amber-400">
              <span>Immediate Evac</span>
              <span className="text-[9px] bg-amber-950 px-1 py-0.2 rounded text-amber-300 font-mono">0-48h</span>
            </div>
            <div className="text-xl font-black text-white mt-0.5">{summary?.totalDisplacedPopulation?.toLocaleString() || 0}</div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-emerald-900/40 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400">
              <span>Destination Headroom</span>
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{summary?.totalShelterCapacity?.toLocaleString() || 0}</div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-blue-900/40 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-blue-400">
              <span>Carrying Capacity</span>
              <span className="text-[9px] text-red-400 font-mono font-bold">Strain</span>
            </div>
            <div className="text-xl font-black text-white mt-0.5 font-mono">CCI: 0.58</div>
          </div>
        </div>
      </div>

      {/* 2. Weather Simulator & Digital Twin */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <CloudRain className="h-4 w-4 text-blue-400" />
            <span>Precipitation Stress Simulator:</span>
          </div>
          <span className="font-mono text-xs font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
            {rainfall} mm / 24h
          </span>
        </div>

        <input
          type="range" min="30" max="350" step="10" value={rainfall}
          onChange={(e) => onRainfallChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-2.5"
        />

        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold mb-2">
          <button onClick={() => onPresetSelect(60)} className="py-1 px-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700">Normal (60mm)</button>
          <button onClick={() => onPresetSelect(180)} className="py-1 px-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-700/60">Monsoon (180mm)</button>
          <button onClick={() => onPresetSelect(320)} className="py-1 px-1 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-700/60">Cloudburst (320mm)</button>
        </div>

        {/* Digital Twin Scenario Button */}
        <button
          onClick={onToggleDigitalTwin}
          className="w-full py-1.5 px-2.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-[10px] font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>Digital Twin Scenario: Simulate Shelter 1 Cutoff</span>
        </button>
      </div>

      {/* 3. Tab Selector */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => onTabChange('evacuation')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'evacuation' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fingerprint className="h-3.5 w-3.5" />
            <span>Vulnerability Fingerprint</span>
          </button>
          <button
            onClick={() => onTabChange('capacity')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'capacity' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Destination Capacity</span>
          </button>
        </div>
      </div>

      {/* 4. Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {activeTab === 'evacuation' ? (
          <>
            {habitations?.map((hab) => {
              const isSelected = activeRouteHabId === hab.id;
              const fp = hab.fingerprint;

              return (
                <div
                  key={hab.id}
                  className={`p-3.5 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-500 ring-1 ring-blue-400'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-black text-white ${
                          hab.priorityRank === 1 ? 'bg-red-600' : hab.priorityRank === 2 ? 'bg-amber-600' : 'bg-slate-700'
                        }`}
                      >
                        #{hab.priorityRank}
                      </span>
                      <div>
                        <strong className="text-white font-bold text-sm">{hab.name}</strong>
                        <span
                          className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            hab.urgencyTier === 'IMMEDIATE'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {hab.urgencyTier.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-950 text-red-400 border border-red-800 font-mono">
                      RUI: {Math.round(hab.rui * 100)}%
                    </span>
                  </div>

                  {/* Vulnerability Fingerprint */}
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
                    <div className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Fingerprint className="h-3 w-3 text-amber-400" /> Vulnerability Fingerprint:
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-slate-400">
                      <span>👴 Elderly: <strong className="text-white">{fp.elderly}</strong></span>
                      <span>👶 Infants: <strong className="text-white">{fp.infants}</strong></span>
                      <span>♿ PwD: <strong className="text-white">{fp.disabilities}</strong></span>
                      <span>🏥 Med: <strong className="text-white">{fp.medicalDependency}</strong></span>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-800 text-[9.5px] text-slate-500">
                      Cutoff Risk: <strong className="text-amber-400">{Math.round(fp.accessCutoffRisk * 100)}%</strong> • Fragility: <strong className="text-red-400">{Math.round(fp.structuralFragility * 100)}%</strong>
                    </div>
                  </div>

                  {/* Split Allocation Plan */}
                  {hab.allocationPlan && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800 text-[10px]">
                      <div className="font-bold text-emerald-300 mb-1">
                        {hab.allocationPlan.isSplit ? '⚠️ Multi-Destination Split Allocation:' : 'Destination Assigned:'}
                      </div>
                      {hab.allocationPlan.splits.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-emerald-200">
                          <span>➡️ <strong>{s.allocatedCount} Citizens</strong> to {s.siteName}</span>
                          <span className="bg-emerald-900 text-emerald-300 px-1 rounded text-[9px]">Suitability: {s.suitabilityScore}%</span>
                        </div>
                      ))}
                      <div className="mt-1 pt-1 border-t border-emerald-900/60 text-emerald-400">
                        Fleet: <strong>{hab.allocationPlan.fleetLogistics.buses} Buses / {hab.allocationPlan.fleetLogistics.ambulances} Ambulances</strong>
                      </div>
                    </div>
                  )}

                  {hab.allocationPlan?.assignedRoute && (
                    <button
                      onClick={() => onSelectRoute(hab.id, hab.allocationPlan.assignedRoute)}
                      className={`mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
                      }`}
                    >
                      <Navigation className="h-3 w-3" />
                      <span>{isSelected ? 'Corridor Active on Map' : 'Draw Safe Evacuation Corridor'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <>
            {relocationSites?.map((site) => {
              const percent = Math.min(100, Math.round((site.currentOccupancy / site.maxCapacity) * 100));

              return (
                <div key={site.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-200">{site.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${site.isAvailable ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-red-950 text-red-400 border-red-800'}`}>
                      {site.isAvailable ? '🟢 ACTIVE' : '🔴 COLLAPSED'}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Suitability Score: <strong className="text-white">{site.suitability.overallScore}/100</strong></span>
                    <span>Headroom: <strong className="text-emerald-400">+{site.currentHeadroom} Slots</strong></span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-1.5">
                    <div
                      className={`h-full rounded-full ${percent > 85 ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Occupancy: <strong>{site.currentOccupancy} / {site.maxCapacity}</strong></span>
                    <span>Water: <strong>{site.suitability.drinkingWater}%</strong> • Health: <strong>{site.suitability.healthcareProximity}%</strong></span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

    </div>
  );
}
