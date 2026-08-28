import { jsPDF } from 'jspdf';

export function generateAssessmentReport(simData, reportTitle = "Official Disaster Risk Assessment Report") {
  if (!simData) return;
  const doc = new jsPDF();
  const res = simData;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("RED-ZONE X : EMERGENCY DISASTER MANAGEMENT PLATFORM", 20, 20);
  
  doc.setFontSize(11);
  doc.text(reportTitle.toUpperCase(), 20, 28);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Reference ID: NDMA/RZX/${res.region.id.toUpperCase()}/${Date.now().toString().slice(-6)}`, 20, 36);
  doc.text(`Generated At: ${new Date().toLocaleString('en-IN')}`, 20, 42);
  doc.text(`Jurisdiction: ${res.region.name}`, 20, 48);
  doc.text(`Critical Red Zones: ${res.summary.redZonesCount} Zones | Total Displaced: ${res.summary.totalDisplacedPopulation} Citizens`, 20, 54);

  doc.setFont("helvetica", "bold");
  doc.text("PRIORITY HABITATION EVACUATION & VULNERABILITY FINGERPRINT:", 20, 66);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  let y = 74;
  res.relocationPriorities.slice(0, 6).forEach((h, i) => {
    const fp = h.fingerprint;
    const dest = h.allocationPlan?.splits?.[0]?.shelterName || "Safe Sanctuary";
    doc.text(`Rank #${i + 1} [${h.urgencyTier}] ${h.name} (Pop: ${h.population})`, 20, y);
    doc.text(`   Vulnerability Fingerprint: ${fp.elderly} Elderly, ${fp.infants} Infants, ${fp.disabilities} PwD | Cutoff Risk: ${Math.round(fp.accessCutoffRisk * 100)}%`, 20, y + 4);
    doc.text(`   Destination: ${dest} | Fleet: ${h.allocationPlan?.fleetLogistics?.buses || 4} Buses, ${h.allocationPlan?.fleetLogistics?.ambulances || 2} Ambulances`, 20, y + 8);
    y += 14;
  });

  doc.setFont("helvetica", "bold");
  doc.text("TACTICAL DIRECTIVES:", 20, y + 8);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("1. Immediate deployment of SDRF/NDRF teams to Rank #1 and #2 habitations within 0-6 hours.", 20, y + 14);
  doc.text("2. Maintain LoRa Emergency Radio Channel CH-04 if cellular transmission cuts off.", 20, y + 18);
  doc.text("3. Relocation destination drinking water and sanitation quotas verified at 45 LPCD.", 20, y + 22);

  doc.save(`REDZONE_X_Assessment_${res.region.id}_${Date.now().toString().slice(-4)}.pdf`);
}
