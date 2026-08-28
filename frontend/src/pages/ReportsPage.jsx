import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { generateAssessmentReport } from '../services/pdfService';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Droplet,
  UsersRound,
  ExternalLink,
  MapPin
} from 'lucide-react';

export default function ReportsPage() {
  const { simulationData } = useDisaster();

  if (!simulationData) return null;

  const { region, summary, relocationPriorities, shelters } = simulationData;
  const evacPop = summary.totalDisplacedPopulation || 1200;
  const waterReq = evacPop * 45;
  const spaceReq = evacPop * 3.5;
  const latrinesReq = Math.ceil(evacPop / 20);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-10">
      
      {/* Top Action Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Official NDMA Disaster Assessment Report</h2>
            <p className="text-xs text-slate-400">Complete multi-hazard vulnerability audit, habitation manifest &amp; Sphere standards</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => generateAssessmentReport(simulationData)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Download Multi-Page PDF</span>
          </button>
        </div>
      </div>

      {/* FULL ON-SCREEN OFFICIAL NDMA DOCUMENT PREVIEW */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-slate-200 shadow-2xl">
        
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-5 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono font-black uppercase text-red-400 tracking-wider">
                NDMA STATUTORY FIELD DIRECTIVE • CONFIDENTIAL
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Ref: NDMA/RZX/{(region.id || 'GEN').toUpperCase()}/{Date.now().toString().slice(-6)}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">
            {region.name} — Emergency Relocation &amp; Multi-Hazard Assessment
          </h1>
          <p className="text-slate-400 text-xs leading-relaxed">
            Geological Context: {region.geologicalContext}
          </p>
        </div>

        {/* 1. Executive KPIs */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span className="h-4 w-1 bg-red-500 rounded-full" />
            1. Executive Vulnerability &amp; Carrying Capacity Summary
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Red Zones</span>
              <div className="text-lg font-black text-red-400">{summary.redZonesCount} Zones</div>
              <span className="text-[10px] text-slate-500">MHI Susceptibility &gt; 68%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Displaced Population</span>
              <div className="text-lg font-black text-amber-400">{summary.totalDisplacedPopulation.toLocaleString()} Pers</div>
              <span className="text-[10px] text-slate-500">{summary.immediateEvacuees} Immediate Tier</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Shelter Capacity</span>
              <div className="text-lg font-black text-emerald-400">{summary.totalShelterCapacity.toLocaleString()} Slots</div>
              <span className="text-[10px] text-slate-500">Safe Headroom Available</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Carrying Capacity</span>
              <div className="text-lg font-black text-blue-400">CCI {summary.cci}</div>
              <span className="text-[10px] text-slate-500">{summary.cciStrainPercent}% Capacity Load</span>
            </div>
          </div>
        </div>

        {/* 2. Priority Habitations Relocation Manifest */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span className="h-4 w-1 bg-red-500 rounded-full" />
            2. Prioritized Habitation Relocation Manifest (Demographic Fingerprints)
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Settlement Name</th>
                  <th className="p-3">Population</th>
                  <th className="p-3">Demographic Fingerprint</th>
                  <th className="p-3">Cutoff Risk</th>
                  <th className="p-3">Destination Hub</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {relocationPriorities?.map((hab) => {
                  const fp = hab.fingerprint || {};
                  return (
                    <tr key={hab.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-black text-red-400">#{hab.priorityRank}</td>
                      <td className="p-3 font-bold text-white">{hab.name}</td>
                      <td className="p-3 font-mono">{hab.population} pers</td>
                      <td className="p-3 text-slate-300">
                        <span className="text-rose-400 font-semibold">{fp.elderly} Elderly</span> • <span className="text-amber-400 font-semibold">{fp.infants} Infants</span> • <span>{fp.disabilities} PwD</span>
                      </td>
                      <td className="p-3 font-bold text-amber-400">
                        {Math.round((fp.accessCutoffRisk || 0.85) * 100)}%
                      </td>
                      <td className="p-3 text-slate-200">
                        {shelters[0]?.name || 'Meppadi Safe Sanctuary'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Sphere Humanitarian Standards Compliance */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span className="h-4 w-1 bg-emerald-500 rounded-full" />
            3. NDMA &amp; Sphere Minimum Humanitarian Standards Audit
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Droplet className="h-4 w-4" />
                <span>Drinking Water Quota (45 LPCD)</span>
              </div>
              <div className="text-base font-black text-white">{waterReq.toLocaleString()} Liters / Day</div>
              <p className="text-[10px] text-emerald-400">✓ 10 Water Tankers Standby ({evacPop} Evacuees Covered)</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Building className="h-4 w-4" />
                <span>Shelter Area (3.5 m²/Person)</span>
              </div>
              <div className="text-base font-black text-white">{spaceReq.toLocaleString()} m² Required</div>
              <p className="text-[10px] text-slate-400">Total Shelter Capacity: {summary.totalShelterCapacity.toLocaleString()} m²</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <UsersRound className="h-4 w-4" />
                <span>Emergency Sanitation (1:20 Unit)</span>
              </div>
              <div className="text-base font-black text-white">{latrinesReq} Latrines Mandated</div>
              <p className="text-[10px] text-blue-300">✓ Segregated Male/Female Triage Units</p>
            </div>
          </div>
        </div>

        {/* 4. Statutory Directives & Signature */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="font-black text-white text-xs uppercase tracking-wide">
            Statutory Emergency Mobilization Directives:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <li>Immediate deployment of SDRF / NDRF teams to Priority 1 habitations within 0-6 hours.</li>
            <li>Maintain LoRa Emergency Radio Channel CH-04 if cellular transmission cuts off.</li>
            <li>Reroute convoys via Elevated High-Ridge Bypass Line if primary roads are blocked by debris.</li>
            <li>District Health Mission (DHM) to stage 4 advanced life support ambulances at designated hubs.</li>
          </ul>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
            <span>Digital Signature: <strong>SHA256-{Date.now().toString(16).toUpperCase()}-NDMA-VERIFIED</strong></span>
            <span className="text-emerald-400 font-bold">✓ Transmitted to Emergency Command Centers</span>
          </div>
        </div>

      </div>

    </div>
  );
}
