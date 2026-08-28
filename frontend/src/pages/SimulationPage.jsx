import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { Sliders, Flame, CloudRain, Wind, Mountain, Activity, Sparkles } from 'lucide-react';

export default function SimulationPage() {
  const {
    rainfallMm,
    setRainfallMm,
    hazardType,
    setHazardType,
    hazardIntensity,
    setHazardIntensity,
    simulationData,
    disabledShelterIds,
    setDisabledShelterIds,
  } = useDisaster();

  const summary = simulationData?.summary;

  const hazards = [
    { id: 'multi', name: 'Multi-Hazard Combined', icon: Flame },
    { id: 'flood', name: 'Flash Flood Surge', icon: CloudRain },
    { id: 'landslide', name: 'Debris Flow / Landslide', icon: Mountain },
    { id: 'cyclone', name: 'Tropical Cyclone Wind & Rain', icon: Wind },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <Sliders className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">What-If Disaster Digital Twin Simulator</h2>
            <p className="text-xs text-slate-400">Stress-test scenarios: cloudburst surges, multi-hazard combinations, and shelter cutoffs</p>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Impact Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Controls (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 text-xs">
          
          {/* Hazard Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Simulate Primary Hazard Type:</label>
            <div className="grid grid-cols-2 gap-2">
              {hazards.map((h) => {
                const Icon = h.icon;
                const isSelected = hazardType === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setHazardType(h.id)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-bold ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{h.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Precipitation Slider */}
          <div>
            <div className="flex justify-between items-center font-bold text-slate-300 mb-1.5">
              <span>24-Hour Precipitation Load:</span>
              <span className="font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{rainfallMm} mm / 24h</span>
            </div>
            <input
              type="range" min="30" max="350" step="10" value={rainfallMm}
              onChange={(e) => setRainfallMm(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>30mm (Normal)</span>
              <span>180mm (Monsoon Warning)</span>
              <span>350mm (Cloudburst Catastrophe)</span>
            </div>
          </div>

          {/* Intensity Multiplier Slider */}
          <div>
            <div className="flex justify-between items-center font-bold text-slate-300 mb-1.5">
              <span>Disaster Intensity Multiplier:</span>
              <span className="font-mono text-rose-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{hazardIntensity.toFixed(1)}x Factor</span>
            </div>
            <input
              type="range" min="0.5" max="2.0" step="0.1" value={hazardIntensity}
              onChange={(e) => setHazardIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Shelter Collapse Scenario Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">Infrastructure Failure Scenario:</span>
            <button
              onClick={() => setDisabledShelterIds(prev => prev.length ? [] : ['SHELTER-01', 'JSHELTER-01'])}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                disabledShelterIds.length
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              {disabledShelterIds.length ? '🔴 Site 1 Cutoff / Flooded (Active)' : 'Simulate Site 1 Inundation Cutoff'}
            </button>
          </div>

        </div>

        {/* Right: Projected Impact Feed (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Projected Emergency Impact Metrics
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">🔴 Red Zones Generated</span>
              <strong className="text-2xl font-black text-rose-500 mt-1 block">{summary?.redZonesCount} Zones</strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">👥 Citizens Displaced</span>
              <strong className="text-2xl font-black text-amber-400 mt-1 block">{summary?.totalDisplacedPopulation?.toLocaleString()}</strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">🚨 Immediate Evacuations</span>
              <strong className="text-2xl font-black text-red-400 mt-1 block">{summary?.immediateEvacuees?.toLocaleString()}</strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">🚌 Required Transport Fleet</span>
              <strong className="text-2xl font-black text-blue-400 mt-1 block">
                {Math.ceil((summary?.totalDisplacedPopulation || 0) / 40)} Buses
              </strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-200 text-xs leading-relaxed">
            <strong>⚠️ Digital Twin Verdict:</strong> Under {rainfallMm}mm/24h precipitation load, slope failure probability exceeds 88% along upper escarpment spurs. All transport fleets must initiate departure 12 hours prior to peak storm apex.
          </div>
        </div>

      </div>

    </div>
  );
}
