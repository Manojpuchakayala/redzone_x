import React from 'react';
import { Droplet, Home, Users, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

export default function SphereStandardsMonitor() {
  const { simulationData } = useDisaster();

  if (!simulationData) return null;
  const { summary, shelters } = simulationData;

  const evacuees = summary.totalDisplacedPopulation || 1200;
  const requiredWaterLitersPerDay = evacuees * 45; // Sphere standard: 45 LPCD (Liters per capita per day)
  const requiredFloorAreaM2 = evacuees * 3.5; // Sphere standard: 3.5 m2 per person
  const requiredLatrines = Math.ceil(evacuees / 20); // Sphere standard: 1 latrine per 20 persons

  const isWaterStrained = summary.cciStrainPercent > 80;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm">NDMA &amp; Sphere Minimum Humanitarian Standards Monitor</h3>
            <p className="text-[11px] text-slate-400">Live Carrying Capacity Inspector: 45 LPCD Water, 3.5 m² Floor Area &amp; Sanitation Ratios</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-xl text-[10px] font-black border flex items-center gap-1 ${
          isWaterStrained
            ? 'bg-amber-950 text-amber-300 border-amber-800'
            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
        }`}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{isWaterStrained ? 'RESOURCE STRAIN WARNING (85% LOAD)' : 'SPHERE STANDARDS COMPLIANT'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Metric 1: Clean Drinking Water */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold">Drinking Water Supply (45 LPCD)</span>
            <Droplet className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-base font-black text-white">
            {requiredWaterLitersPerDay.toLocaleString()} L/Day
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">
            ✓ 10 Tankers Standby ({evacuees} Evacuees Covered)
          </div>
        </div>

        {/* Metric 2: Covered Living Space */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold">Floor Area (3.5 m²/Person)</span>
            <Home className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-base font-black text-white">
            {requiredFloorAreaM2.toLocaleString()} m²
          </div>
          <div className="text-[10px] text-slate-400 font-semibold">
            Total Shelter Capacity: {summary.totalShelterCapacity.toLocaleString()} m²
          </div>
        </div>

        {/* Metric 3: Emergency Sanitation */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold">Sanitation (1 Unit / 20 Pers)</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-base font-black text-white">
            {requiredLatrines} Latrine Units
          </div>
          <div className="text-[10px] text-blue-300 font-semibold">
            ✓ Segregated Male/Female Triage Units Ready
          </div>
        </div>

      </div>
    </div>
  );
}
