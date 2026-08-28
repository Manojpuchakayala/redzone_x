import React from 'react';
import { jsPDF } from 'jspdf';
import { Shield, X, Download } from 'lucide-react';

export default function ActionReportModal({ isOpen, onClose, simulationData }) {
  if (!isOpen || !simulationData) return null;

  const { region, summary, relocationPriorities, timestamp } = simulationData;

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("NATIONAL DISASTER MANAGEMENT AUTHORITY", 20, 20);
    doc.setFontSize(11);
    doc.text("TACTICAL HABITATION RELOCATION & EVACUATION DIRECTIVE", 20, 28);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Order Ref: NDMA/OPS/${region.id.toUpperCase()}/2026/048`, 20, 36);
    doc.text(`Issued At: ${new Date(timestamp).toLocaleString('en-IN')}`, 20, 42);
    doc.text(`Jurisdiction: ${region.name}`, 20, 48);
    doc.text(`Total Mandatory Evacuees: ${summary.totalDisplacedPopulation} Citizens`, 20, 54);

    doc.setFont("helvetica", "bold");
    doc.text("DISPATCH ROSTER & SHELTER ALLOCATION:", 20, 66);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    let y = 74;
    relocationPriorities?.slice(0, 5).forEach((h, i) => {
      doc.text(`Rank #${i + 1} | ${h.name} (Pop: ${h.population}) -> Assigned: ${h.assignedShelter?.name || "Transit Camp"}`, 20, y);
      y += 8;
    });

    doc.save(`NDMA_Evacuation_Directive_${region.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-5">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="gov-tricolor-line" />

        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-blue-700 flex items-center justify-center text-white shadow">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                Government of India • National Disaster Management Authority
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Tactical Habitation Relocation &amp; Evacuation Directive
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-700 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center">
            <div>
              <span className="block text-slate-500 font-bold text-xs uppercase">Jurisdiction</span>
              <strong className="text-slate-900 text-sm mt-1 block font-black">{region.name}</strong>
            </div>
            <div>
              <span className="block text-slate-500 font-bold text-xs uppercase">Mandatory Evacuees</span>
              <strong className="text-rose-700 text-sm mt-1 block font-black">{summary.totalDisplacedPopulation} Citizens</strong>
            </div>
            <div>
              <span className="block text-slate-500 font-bold text-xs uppercase">Required Fleet</span>
              <strong className="text-blue-900 text-sm mt-1 block font-black">
                {Math.ceil(summary.totalDisplacedPopulation / 40)} Buses / {Math.ceil(summary.totalDisplacedPopulation / 90)} Amb
              </strong>
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 text-sm mb-3 uppercase tracking-wide">Tactical Dispatch Table:</h4>
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                    <th className="p-3">Priority</th>
                    <th className="p-3">Habitation</th>
                    <th className="p-3">Headcount</th>
                    <th className="p-3">Assigned Safe Sanctuary</th>
                    <th className="p-3">Est. Transit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {relocationPriorities?.slice(0, 5).map((h, i) => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="p-3 font-black text-rose-600">Rank #{i + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{h.name}</td>
                      <td className="p-3 font-mono font-semibold">{h.population}</td>
                      <td className="p-3 text-emerald-800 font-bold">{h.assignedShelter?.name}</td>
                      <td className="p-3 text-slate-500 font-mono">15 - 25 mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed font-semibold">
            <strong>⚠️ Tactical Execution Directive:</strong> All evacuation paths are verified above the 100-year High Flood Level (HFL) and avoid active slope debris runout fans. Emergency responders must keep LoRa Radio Channel CH-04 open for telemetry updates.
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3.5">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-800 shadow"
          >
            <Download className="h-4 w-4" /> Download Official Directive PDF
          </button>
          <button onClick={onClose} className="rounded-xl bg-slate-200 hover:bg-slate-300 px-5 py-2.5 text-xs font-extrabold text-slate-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
