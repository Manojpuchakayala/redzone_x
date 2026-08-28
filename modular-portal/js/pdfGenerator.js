/**
 * GeoResilience AI - NDMA Directive PDF Exporter with Vulnerability Fingerprints
 */
export function exportNDMADirectivePdf(simulationResult) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const res = simulationResult;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("NATIONAL DISASTER MANAGEMENT AUTHORITY", 20, 20);
  doc.setFontSize(11);
  doc.text("TACTICAL HABITATION RELOCATION & EVACUATION DIRECTIVE", 20, 28);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Order Ref: NDMA/OPS/${res.region.id.toUpperCase()}/2026/048`, 20, 36);
  doc.text(`Issued At: ${new Date().toLocaleString('en-IN')}`, 20, 42);
  doc.text(`Jurisdiction: ${res.region.name}`, 20, 48);
  doc.text(`Immediate Evacuees (0-48h): ${res.summary.totalDisplacedPopulation} Citizens`, 20, 54);

  doc.setFont("helvetica", "bold");
  doc.text("TACTICAL DISPATCH ROSTER WITH VULNERABILITY FINGERPRINT:", 20, 66);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  let y = 74;
  res.relocationPriorities.slice(0, 5).forEach((h, i) => {
    const alloc = h.allocationPlan?.splits?.[0]?.siteName || "Transit Camp";
    const fp = h.fingerprint;
    doc.text(`Rank #${i + 1} [${h.urgencyTier}] ${h.name} (Pop: ${h.population})`, 20, y);
    doc.text(`  -> Fingerprint: ${fp.elderly} Elderly, ${fp.infants} Infants, ${fp.disabilities} PwD | Cutoff: ${Math.round(fp.accessCutoffRisk*100)}%`, 20, y + 4);
    doc.text(`  -> Allocation: ${alloc} | Fleet: ${h.allocationPlan?.fleetLogistics.buses || 4} Buses, ${h.allocationPlan?.fleetLogistics.ambulances || 2} Amb`, 20, y + 8);
    y += 14;
  });

  doc.setFont("helvetica", "bold");
  doc.text("Directives: Maintain LoRa Radio Frequency Channel CH-04 if cellular towers collapse.", 20, y + 8);

  doc.save(`NDMA_Evacuation_Directive_${res.region.id}.pdf`);
}
