import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { useLanguage } from '../context/LanguageContext';
import { UsersRound, Split, Bus, ShieldCheck, ArrowRight, Activity, Truck } from 'lucide-react';

export default function RelocationPage() {
  const { simulationData } = useDisaster();
  const { t, localizePlace } = useLanguage();
  const habitations = simulationData?.relocationPriorities || [];
  const summary = simulationData?.summary || {};

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <UsersRound className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{t('relocationTitle')}</h2>
            <p className="text-xs text-slate-400">{t('relocationSub')}</p>
          </div>
        </div>

        {/* Dynamic Capacity Balance Banner */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs">
          <Activity className="h-4 w-4 text-blue-400" />
          <span className="text-slate-400">Regional Strain:</span>
          <strong className="text-white font-mono">CCI {summary.cci}</strong>
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
            {summary.cciBadge}
          </span>
        </div>
      </div>

      {/* Relocation Plan Table & Tactical Fleet Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Habitation Multi-Destination Split Allocation Roster (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Split className="h-4 w-4 text-emerald-400" />
            <span>{t('splitPlan')}</span>
          </h3>

          <div className="space-y-3.5">
            {habitations.map((hab) => (
              <div key={hab.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-black text-white text-sm">#{hab.priorityRank} {localizePlace(hab.name)}</span>
                    <span className="ml-2 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-950 text-red-400 border border-red-800">
                      {hab.urgencyTier.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="font-mono text-slate-300">Total Evacuees: <strong className="text-white">{hab.population}</strong></span>
                </div>

                {/* Allocation Splits */}
                {hab.allocationPlan ? (
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/80 space-y-2">
                    <div className="font-bold text-emerald-300 text-[11px] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Split className="h-3.5 w-3.5" />
                        <span>{hab.allocationPlan.isSplit ? '⚠️ Automated Carrying Capacity Split Allocation:' : 'Assigned Sanctuary:'}</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[10px]">
                        {hab.allocationPlan.splits.length} Destination Hubs
                      </span>
                    </div>

                    {hab.allocationPlan.splits.map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-emerald-200 text-xs bg-slate-950/80 p-2 rounded-lg border border-emerald-900/50">
                        <span>➡️ <strong>{s.allocatedCount} Citizens</strong> to {localizePlace(s.shelterName)}</span>
                        <span className="bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          Suitability: {s.safetyScore}%
                        </span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-emerald-900/60 flex justify-between text-emerald-300 font-semibold text-[11px]">
                      <span className="flex items-center gap-1">
                        <Bus className="h-3.5 w-3.5" />
                        <span>Required Fleet: <strong>{hab.allocationPlan.fleetLogistics.buses} Buses (40-Seater)</strong></span>
                      </span>
                      <span>Ambulances: <strong>{hab.allocationPlan.fleetLogistics.ambulances} Standby</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic p-2 bg-slate-900/40 rounded-lg">No relocation required (Stable Green Sanctuary)</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Fleet Dispatch & Capacity Logistics Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-400" />
              <span>Evacuation Transport Summary</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Total Citizens Displaced:</span>
                <strong className="text-white text-sm">{summary.totalDisplacedPopulation}</strong>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Total Convoy Buses Required:</span>
                <strong className="text-blue-400 text-sm">{Math.ceil(summary.totalDisplacedPopulation / 40)} Buses</strong>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Medical Ambulances Standby:</span>
                <strong className="text-rose-400 text-sm">6 Advanced Life Support</strong>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Available Sanctuary Headroom:</span>
                <strong className="text-emerald-400 text-sm">+{summary.totalShelterCapacity} Slots</strong>
              </div>
            </div>

            <div className="p-3 bg-blue-950/30 border border-blue-800/60 rounded-xl text-[11px] text-blue-200">
              💡 <strong>Split Allocation Rule:</strong> When a single habitation exceeds the safe headroom of the closest shelter, population is dynamically divided to prevent drinking water and sanitation collapses.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
