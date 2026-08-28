import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { generateAssessmentReport } from '../services/pdfService';
import { FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const { simulationData } = useDisaster();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Disaster Risk &amp; Relocation Assessment Reports</h2>
            <p className="text-xs text-slate-400">Generate legally compliant NDMA/SDMA evacuation orders with full demographic manifests</p>
          </div>
        </div>
      </div>

      {/* Report Preview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-xs space-y-4">
        <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-base font-black text-white">Tactical Habitation Relocation Directive</h3>
            <span className="text-slate-400">Jurisdiction: {simulationData?.region?.name}</span>
          </div>
          <button
            onClick={() => generateAssessmentReport(simulationData)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Generate Official PDF</span>
          </button>
        </div>

        <div className="space-y-2 text-slate-300 leading-relaxed">
          <p><strong>Executive Summary:</strong> Under present catchment meteorological saturation, <strong>{simulationData?.summary?.redZonesCount} Red Zones</strong> require immediate evacuation. <strong>{simulationData?.summary?.totalDisplacedPopulation} citizens</strong> have been prioritized across safe transit hubs.</p>
          
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div>✓ Vulnerability Fingerprint breakdown included for all Priority 1 habitations</div>
            <div>✓ Carrying capacity verified with 45 LPCD drinking water and hospital beds</div>
            <div>✓ LoRa Radio Emergency Channel CH-04 frequency assigned</div>
          </div>
        </div>
      </div>

    </div>
  );
}
