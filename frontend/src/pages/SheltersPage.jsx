import React, { useState } from 'react';
import SphereStandardsMonitor from '../components/common/SphereStandardsMonitor';
import { useDisaster } from '../context/DisasterContext';
import { Home, Filter, ShieldCheck, Phone, MapPin, CheckCircle2, XCircle } from 'lucide-react';

export default function SheltersPage() {
  const { simulationData } = useDisaster();
  const shelters = simulationData?.shelters || [];
  const [filterMedicalOnly, setFilterMedicalOnly] = useState(false);

  const filtered = filterMedicalOnly ? shelters.filter(s => s.facilities?.medical) : shelters;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Relief Shelter &amp; Sanctuary Management</h2>
            <p className="text-xs text-slate-400">Live capacity audit, medical standby, and infrastructure readiness</p>
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setFilterMedicalOnly(!filterMedicalOnly)}
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
            filterMedicalOnly
              ? 'bg-purple-600 text-white border-purple-500'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>{filterMedicalOnly ? 'Showing Medical Ready' : 'Filter: Medical Facilities'}</span>
        </button>
      </div>

      {/* Shelter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((sh) => {
          const percent = Math.min(100, Math.round((sh.occupied / sh.capacity) * 100));
          return (
            <div key={sh.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-400">{sh.type}</span>
                  <h3 className="text-base font-black text-white mt-0.5">{sh.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {sh.safetyScore}% Safe
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Occupancy:</span>
                  <strong className="text-white font-mono">{sh.occupied} / {sh.capacity}</strong>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${percent > 85 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">{percent}% Occupied</span>
                  <span className="text-emerald-400 font-bold">+{sh.capacity - sh.occupied} Slots Free</span>
                </div>
              </div>

              {/* Facilities Checklist */}
              <div className="space-y-1 text-slate-300">
                <div className="flex items-center gap-2">
                  {sh.facilities?.medical ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-slate-600" />}
                  <span>Emergency Medical Unit &amp; Triage</span>
                </div>
                <div className="flex items-center gap-2">
                  {sh.facilities?.water ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-slate-600" />}
                  <span>Piped Drinking Water (45 LPCD quota)</span>
                </div>
                <div className="flex items-center gap-2">
                  {sh.facilities?.powerBackup ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-slate-600" />}
                  <span>24/7 Generator Power Backup</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-slate-500 text-[11px] flex items-center justify-between">
                <span>📍 {sh.distanceKm} km from epicenter</span>
                <span>📞 {sh.contact}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
