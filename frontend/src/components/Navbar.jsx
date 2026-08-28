import React from 'react';
import { ShieldAlert, Radio, FileDown, MapPin } from 'lucide-react';

export default function Navbar({ selectedRegion, onSelectRegion, onOpenReportModal }) {
  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white z-20 flex-shrink-0">
      <div className="gov-tricolor-line" />
      
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                National Disaster Management Authority
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="text-base font-black text-white tracking-tight leading-tight">
              GeoResilience AI <span className="text-xs font-medium text-slate-400 ml-1.5 font-sans">Multi-Hazard Red-Zoning &amp; Relocation DSS</span>
            </h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Jurisdiction Dropdown Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-bold">
            <span className="px-2 text-slate-400 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-amber-400" /> Jurisdiction:
            </span>
            <button
              onClick={() => onSelectRegion('wayanad')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedRegion === 'wayanad'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wayanad, Kerala
            </button>
            <button
              onClick={() => onSelectRegion('joshimath')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedRegion === 'joshimath'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Joshimath, UK
            </button>
          </div>

          {/* LoRa Radio Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-xs font-bold text-emerald-300">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>LoRa Mesh (0 Internet)</span>
          </div>

          {/* Export Directive Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow transition-all active:scale-95"
          >
            <FileDown className="h-4 w-4" />
            <span>Export NDMA Order</span>
          </button>
        </div>

      </div>
    </header>
  );
}
