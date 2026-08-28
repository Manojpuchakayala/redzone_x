import React from 'react';
import { Flame, Users, ShieldCheck, Scale } from 'lucide-react';

export default function StatCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {/* Red Zones */}
      <div className="bg-white rounded-2xl p-5 border border-rose-200 border-l-[6px] border-l-rose-600 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-rose-900 uppercase">
          <span>Critical Red Zones</span>
          <span className="flex items-center gap-1 bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-300 font-black">
            <Flame className="h-3.5 w-3.5 text-rose-600 animate-pulse" /> Critical Risk
          </span>
        </div>
        <div className="text-3xl lg:text-4xl font-black text-rose-950 mt-2">{summary.redZonesCount} Zones</div>
        <p className="text-xs text-rose-700 mt-1 font-semibold">Slope &gt; 35° &amp; High Saturation</p>
      </div>

      {/* Citizens at Risk */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 border-l-[6px] border-l-amber-500 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-amber-900 uppercase">
          <span>Citizens at Immediate Risk</span>
          <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 font-black">
            ⚠️ Mandatory Evac
          </span>
        </div>
        <div className="text-3xl lg:text-4xl font-black text-amber-950 mt-2">
          {summary.totalDisplacedPopulation?.toLocaleString() || 0}
        </div>
        <p className="text-xs text-amber-700 mt-1 font-semibold">
          {summary.criticalEvacuations} Vulnerable Habitations Ranked
        </p>
      </div>

      {/* Safe Capacity */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-200 border-l-[6px] border-l-emerald-600 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-900 uppercase">
          <span>Green Zone Safe Capacity</span>
          <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300 font-black">
            🟢 Verified Safe
          </span>
        </div>
        <div className="text-3xl lg:text-4xl font-black text-emerald-950 mt-2">
          {summary.totalShelterCapacity?.toLocaleString() || 0} Slots
        </div>
        <p className="text-xs text-emerald-700 mt-1 font-semibold">
          Surplus Buffer: +{(summary.totalShelterCapacity - summary.totalDisplacedPopulation).toLocaleString()} Available
        </p>
      </div>

      {/* Carrying Capacity */}
      <div className="bg-white rounded-2xl p-5 border border-blue-200 border-l-[6px] border-l-blue-600 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-blue-900 uppercase">
          <span>Carrying Capacity (CCI)</span>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 text-[10px] font-black">
            Overburdened
          </span>
        </div>
        <div className="text-3xl lg:text-4xl font-black text-blue-950 mt-2 font-mono">CCI: 0.58</div>
        <p className="text-xs text-blue-700 mt-1 font-semibold">Slope Load Strain: +48% Penalty</p>
      </div>
    </div>
  );
}
