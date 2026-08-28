import React, { useState } from 'react';
import { Building, CloudRain, Mountain, Waves, Satellite, ShieldCheck, ExternalLink, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { GOVT_DATA_SOURCES } from '../../data/govtDataSources';

export default function GovtTelemetryBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg text-xs">
      
      {/* Top Header Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 bg-slate-950/80 hover:bg-slate-950 flex items-center justify-between transition-colors border-b border-slate-800"
      >
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
            <Building className="h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-xs">Official Government Data Feeds &amp; Solutions</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-black">
                IMD • GSI • CWC • ISRO • NDMA
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Integrated with Official Govt of India Portals &amp; Sphere Minimum Standards</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px]">
          <span>{isOpen ? 'Collapse Official Sources' : 'View Govt Telemetry & Solutions'}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded Official Telemetry Grid */}
      {isOpen && (
        <div className="p-4 space-y-4 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* 1. IMD Live Telemetry */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-blue-400 font-black text-xs">
                <span className="flex items-center gap-1.5"><CloudRain className="h-4 w-4" /> IMD Mausam</span>
                <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[9px]">RED ALERT</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div>Rainfall: <strong>{GOVT_DATA_SOURCES.imd.liveFeed.last24hRainfall}</strong></div>
                <div>Radar: <strong>{GOVT_DATA_SOURCES.imd.liveFeed.radarReflectivity}</strong></div>
                <div className="text-slate-500 text-[10px]">{GOVT_DATA_SOURCES.imd.liveFeed.station}</div>
              </div>
              <a href={GOVT_DATA_SOURCES.imd.portalUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 pt-1 border-t border-slate-800">
                <span>Official IMD Portal</span> <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* 2. GSI Slope Instability */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-black text-xs">
                <span className="flex items-center gap-1.5"><Mountain className="h-4 w-4" /> GSI NLSM</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[9px]">CRITICAL</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div>Slope Stability: <strong>FoC &lt; 1.05 (Unstable)</strong></div>
                <div>Overburden: <strong>3.2m Saturated Debris</strong></div>
                <div className="text-slate-500 text-[10px]">{GOVT_DATA_SOURCES.gsi.liveFeed.zone}</div>
              </div>
              <a href={GOVT_DATA_SOURCES.gsi.portalUrl} target="_blank" rel="noreferrer" className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 pt-1 border-t border-slate-800">
                <span>Official GSI Portal</span> <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* 3. CWC Flood River Gauge */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-black text-xs">
                <span className="flex items-center gap-1.5"><Waves className="h-4 w-4" /> CWC Flood</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px]">SEVERE</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div>River Gauge: <strong>89.4m (Above HFL)</strong></div>
                <div>Discharge: <strong>1,450 m³/sec Inflow</strong></div>
                <div className="text-slate-500 text-[10px]">{GOVT_DATA_SOURCES.cwc.liveFeed.river}</div>
              </div>
              <a href={GOVT_DATA_SOURCES.cwc.portalUrl} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 pt-1 border-t border-slate-800">
                <span>Official CWC Portal</span> <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* 4. ISRO Bhuvan Satellite */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-purple-400 font-black text-xs">
                <span className="flex items-center gap-1.5"><Satellite className="h-4 w-4" /> ISRO Bhuvan</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[9px]">SAR 10m</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div>Satellite: <strong>EOS-04 SAR Pass</strong></div>
                <div>Elevation: <strong>CartoDEM 10m v3.1</strong></div>
                <div className="text-slate-500 text-[10px]">Flood Catchment: 4.8 km²</div>
              </div>
              <a href={GOVT_DATA_SOURCES.isro.portalUrl} target="_blank" rel="noreferrer" className="text-[10px] text-purple-400 hover:underline flex items-center gap-1 pt-1 border-t border-slate-800">
                <span>Official Bhuvan Portal</span> <ExternalLink className="h-3 w-3" />
              </a>
            </div>

          </div>

          {/* NDMA Official Solutions Implemented */}
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/60 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>Official NDMA &amp; Sphere Standards Solved &amp; Enforced in RED-ZONE X:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-emerald-200">
              <div className="p-2 bg-slate-950/80 rounded-lg border border-emerald-900/60">
                💧 <strong>Drinking Water Quota:</strong> 45 LPCD per displaced citizen guaranteed
              </div>
              <div className="p-2 bg-slate-950/80 rounded-lg border border-emerald-900/60">
                🏠 <strong>Shelter Space:</strong> 3.5 m² minimum covered space per evacuee
              </div>
              <div className="p-2 bg-slate-950/80 rounded-lg border border-emerald-900/60">
                📊 <strong>Carrying Capacity (CCI):</strong> Automated split allocation prevents camp collapse
              </div>
              <div className="p-2 bg-slate-950/80 rounded-lg border border-emerald-900/60">
                📻 <strong>Zero-Grid Comms:</strong> LoRa 868 MHz radio frequency fallback
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
