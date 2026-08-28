import React from 'react';
import { Scale } from 'lucide-react';

export default function CapacityPanel({ carryingCapacity }) {
  if (!carryingCapacity) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              Zonal Ecological Carrying Capacity Audit
            </h2>
            <p className="text-xs text-slate-500 font-medium">Standard: 120 persons / safe hectare (Slope-adjusted)</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[510px]">
        {carryingCapacity.map((zone) => {
          const isOverburdened = zone.status === "OVERBURDENED";
          const isThreshold = zone.status === "THRESHOLD";
          const progressPercent = Math.min(100, Math.round(zone.carryingCapacityIndex * 50));

          return (
            <div key={zone.zoneId} className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-sm transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="font-black text-sm text-slate-900">{zone.zoneName}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black border ${
                    isOverburdened ? "bg-rose-100 text-rose-800 border-rose-300" : isThreshold ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-100 text-emerald-800 border-emerald-300"
                  }`}
                >
                  CCI: {zone.carryingCapacityIndex} ({zone.statusLabel})
                </span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2.5 border border-slate-200 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverburdened ? "bg-red-600" : isThreshold ? "bg-amber-500" : "bg-emerald-600"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-600 font-semibold">
                <span>Resident Density: <strong className="text-slate-900">{zone.totalPopulation} Persons</strong></span>
                <span>Permissible Safe Limit: <strong className="text-emerald-700">{zone.maxPermissiblePopulation} Max</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
