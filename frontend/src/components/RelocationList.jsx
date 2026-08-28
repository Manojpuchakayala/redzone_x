import React from 'react';
import { AlertOctagon, Navigation, Bus } from 'lucide-react';

export default function RelocationList({ habitations, activeRouteHabId, onSelectRoute }) {
  if (!habitations) return null;

  const evacCount = habitations.filter((h) => h.relocationMandatory).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-600 text-white shadow">
            <AlertOctagon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              Priority Evacuation &amp; Relocation Roster
            </h2>
            <p className="text-xs text-slate-500 font-medium">Ranked by Vulnerability Priority Score (VPS Algorithm)</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-xs font-black">
          {evacCount} Mandatory Evacuations
        </span>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[510px]">
        {habitations.map((hab) => {
          const isSelected = activeRouteHabId === hab.id;

          return (
            <div
              key={hab.id}
              className={`p-4 rounded-2xl border transition-all ${
                isSelected
                  ? "bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-400"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-6 w-6 rounded-xl flex items-center justify-center text-xs font-black text-white ${
                        hab.priorityRank === 1 ? "bg-red-600" : hab.priorityRank === 2 ? "bg-amber-500" : "bg-slate-600"
                      }`}
                    >
                      #{hab.priorityRank}
                    </span>
                    <strong className="text-sm font-black text-slate-900">{hab.name}</strong>
                  </div>

                  <div className="text-xs text-slate-600 mt-1.5 flex items-center gap-4 font-semibold">
                    <span>Population: <strong className="text-slate-900 font-bold">{hab.population} Citizens</strong></span>
                    <span>Fragility: <strong className="text-rose-600 font-bold">{Math.round(hab.structuralFragility * 100)}%</strong></span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black border ${
                    hab.relocationMandatory ? "bg-rose-100 text-rose-800 border-rose-300" : "bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  VPS: {(hab.vulnerabilityPriorityScore * 100).toFixed(0)}%
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                <strong className="text-slate-900 font-bold">Official Risk Audit:</strong> {hab.explainWhy}
              </div>

              <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100 flex-wrap gap-2">
                <div className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                  <Bus className="h-4 w-4 text-blue-600" />
                  <span>Logistics: <strong>{hab.evacuationLogistics?.busesRequired} Buses / {hab.evacuationLogistics?.ambulancesRequired} Amb</strong></span>
                </div>

                {hab.assignedRoute && (
                  <button
                    onClick={() => onSelectRoute(hab.id, hab.assignedRoute)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-emerald-700 text-white shadow"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow"
                    }`}
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>{isSelected ? "Active Corridor" : "Draw Safe Evacuation Path"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
