import React from 'react';
import { CloudRain, Sparkles } from 'lucide-react';

export default function SimulationControls({ rainfall, onRainfallChange, onPresetSelect }) {
  let stormStatus = "Standard Rainfall";
  let statusBadge = "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (rainfall >= 260) {
    stormStatus = "Extreme Cloudburst Warning (Critical)";
    statusBadge = "bg-rose-100 text-rose-800 border-rose-300";
  } else if (rainfall >= 160) {
    stormStatus = "Severe Monsoon Inundation (High Alert)";
    statusBadge = "bg-amber-100 text-amber-800 border-amber-300";
  } else if (rainfall >= 100) {
    stormStatus = "Moderate Monsoon Rain (Advisory)";
    statusBadge = "bg-blue-100 text-blue-800 border-blue-300";
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow">
            <CloudRain className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              Precipitation &amp; Climate Stress Scenario Simulator
            </h2>
            <p className="text-xs text-slate-500 font-medium">Dynamically adjusts pore-water pressure &amp; slope instability</p>
          </div>
        </div>

        <span className={`text-xs font-black px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 ${statusBadge}`}>
          <Sparkles className="h-3.5 w-3.5" /> {stormStatus}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center text-xs mb-2 font-bold text-slate-700">
            <span>24-Hour Cumulative Catchment Precipitation:</span>
            <span className="font-mono text-sm font-black text-blue-900 bg-blue-100 px-3 py-1 rounded-xl border border-blue-200">
              {rainfall} mm / 24 hrs
            </span>
          </div>

          <input
            type="range" min="30" max="350" step="10" value={rainfall}
            onChange={(e) => onRainfallChange(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-xl appearance-none cursor-pointer accent-blue-600 shadow-inner"
          />

          <div className="flex justify-between text-xs text-slate-500 font-semibold mt-1.5">
            <span>30mm (Baseline)</span>
            <span>120mm (Advisory)</span>
            <span>220mm (Severe Warning)</span>
            <span>350mm (Historical Cloudburst)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => onPresetSelect(60)}
            className="rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 p-3 text-xs font-extrabold text-emerald-900 shadow-sm transition-all"
          >
            🟢 Baseline Normal (60mm)
          </button>
          <button
            onClick={() => onPresetSelect(180)}
            className="rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 p-3 text-xs font-extrabold text-amber-900 shadow-sm transition-all"
          >
            🟡 Severe Monsoon (180mm)
          </button>
          <button
            onClick={() => onPresetSelect(320)}
            className="rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 p-3 text-xs font-extrabold text-rose-900 shadow-sm transition-all"
          >
            🔴 2024 Cloudburst (320mm)
          </button>
        </div>
      </div>
    </div>
  );
}
