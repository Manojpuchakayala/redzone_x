import React from 'react';
import { AlertOctagon, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmergencyActionBanner({ habitations }) {
  const navigate = useNavigate();
  const immediate = habitations?.filter(h => h.urgencyTier === 'IMMEDIATE') || [];
  const shortTerm = habitations?.filter(h => h.urgencyTier === 'SHORT_TERM') || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/40">
            <AlertOctagon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Tactical Emergency Action Directives
            </h3>
            <p className="text-xs text-slate-400">Prioritized relocation and asset dispatch orders</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/relocation')}
          className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
        >
          <span>View Relocation Manifest</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        
        {/* Tier 1: Immediate */}
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/80">
          <div className="flex items-center justify-between font-black text-red-400 mb-1.5 uppercase">
            <span>🔴 IMMEDIATE (0 - 6 Hours)</span>
            <span>{immediate.length} Settlements</span>
          </div>
          <p className="text-slate-300 leading-snug">
            Mandatory evacuation for <strong>{immediate.map(h => h.name).join(', ') || 'None'}</strong>. Mobilize NDRF fleet and dispatch road-clearing dozers.
          </p>
        </div>

        {/* Tier 2: Short Term */}
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/80">
          <div className="flex items-center justify-between font-black text-amber-400 mb-1.5 uppercase">
            <span>🟠 WITHIN 24 HOURS</span>
            <span>{shortTerm.length} Settlements</span>
          </div>
          <p className="text-slate-300 leading-snug">
            Pre-evacuate bedridden elderly &amp; infants from <strong>{shortTerm.map(h => h.name).join(', ') || 'None'}</strong> to Meppadi Transit Hub.
          </p>
        </div>

        {/* Tier 3: Logistics & Comms */}
        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/80">
          <div className="flex items-center justify-between font-black text-blue-400 mb-1.5 uppercase">
            <span>🔵 LOGISTICS &amp; RADIO</span>
            <span>LoRa CH-04</span>
          </div>
          <p className="text-slate-300 leading-snug">
            Maintain LoRa emergency mesh frequency. Ensure 45 LPCD drinking water replenishment at Greenfield Sanctuary.
          </p>
        </div>

      </div>
    </div>
  );
}
