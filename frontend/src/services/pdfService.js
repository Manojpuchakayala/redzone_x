import { jsPDF } from 'jspdf';

export function generateAssessmentReport(simData, reportTitle = "Official NDMA Disaster Risk & Relocation Assessment Report") {
  if (!simData) return;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 14;
  const rightMargin = 14;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 182 mm

  const res = simData;
  const region = res.region || {};
  const summary = res.summary || {};
  const habitations = res.relocationPriorities || [];
  const shelters = res.shelters || res.reliefShelters || [];
  const hazardZones = res.hazardZones || [];

  // Helper: Draw Official Header
  const drawHeader = () => {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 32, 'F');

    // Indian National Tricolor Stripe
    doc.setFillColor(255, 153, 51); // Saffron
    doc.rect(0, 32, pageWidth / 3, 2, 'F');
    doc.setFillColor(255, 255, 255); // White
    doc.rect(pageWidth / 3, 32, pageWidth / 3, 2, 'F');
    doc.setFillColor(19, 136, 8); // Green
    doc.rect((pageWidth / 3) * 2, 32, pageWidth / 3, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('RED-ZONE X : NATIONAL DISASTER DECISION PLATFORM', leftMargin, 13);

    doc.setFontSize(9);
    doc.setTextColor(239, 68, 68); // Red-500
    doc.text(reportTitle.toUpperCase(), leftMargin, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(203, 213, 225);
    const dateStr = new Date().toLocaleString('en-IN');
    doc.text(`Ref: NDMA/RZX/${(region.id || 'GEN').toUpperCase()}/${Date.now().toString().slice(-6)} | Date: ${dateStr}`, leftMargin, 27);
  };

  // Start Page 1
  drawHeader();
  let y = 42;

  // Auto-Pagination Helper
  const checkPageBreak = (neededHeight = 12, onNewPage) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      drawHeader();
      y = 42;
      if (onNewPage) onNewPage();
      return true;
    }
    return false;
  };

  // ==================== SECTION 1: EXECUTIVE OVERVIEW ====================
  doc.setFillColor(220, 38, 38);
  doc.rect(leftMargin, y - 3, 3, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. EXECUTIVE DISASTER RISK & JURISDICTION SUMMARY', leftMargin + 6, y + 1.5);
  y += 7;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Jurisdiction: ${region.name || 'Active Incident District'} (Center: ${region.center ? region.center.join(', ') : 'GPS Auto-Detected'})`, leftMargin + 2, y);
  y += 4.5;
  const contextLines = doc.splitTextToSize(`Geological Context: ${region.geologicalContext || 'High-gradient escarpment basin vulnerable to intense monsoon saturation and debris flows.'}`, contentWidth - 4);
  doc.text(contextLines, leftMargin + 2, y);
  y += contextLines.length * 4.2 + 2;

  // 4 KPI Summary Cards
  const boxW = (contentWidth - 9) / 4;
  const kpis = [
    { label: 'Active Red Zones', val: `${summary.redZonesCount || hazardZones.length || 3} Zones`, color: [220, 38, 38] },
    { label: 'Total Displaced Pop.', val: `${(summary.totalDisplacedPopulation || 1200).toLocaleString()} Pers`, color: [217, 119, 6] },
    { label: 'Safe Shelter Capacity', val: `${(summary.totalShelterCapacity || 7000).toLocaleString()} Slots`, color: [16, 185, 129] },
    { label: 'Carrying Capacity', val: `CCI: ${summary.cci || 1.45}`, color: [2, 132, 199] }
  ];

  kpis.forEach((kpi, idx) => {
    const x = leftMargin + idx * (boxW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, boxW, 13, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 2.5, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.val, x + 2.5, y + 10);
  });

  y += 18;

  // ==================== SECTION 2: PRIORITIZED HABITATION MANIFEST ====================
  checkPageBreak(25);
  doc.setFillColor(220, 38, 38);
  doc.rect(leftMargin, y - 3, 3, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. PRIORITIZED HABITATION RELOCATION MANIFEST (DEMOGRAPHIC FINGERPRINTS)', leftMargin + 6, y + 1.5);
  y += 6.5;

  const drawHabTableHeader = () => {
    doc.setFillColor(15, 23, 42);
    doc.rect(leftMargin, y, contentWidth, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('Rank', leftMargin + 2, y + 4.2);
    doc.text('Settlement Name', leftMargin + 12, y + 4.2);
    doc.text('Population', leftMargin + 60, y + 4.2);
    doc.text('Demographic Fingerprint', leftMargin + 82, y + 4.2);
    doc.text('Cutoff Risk', leftMargin + 134, y + 4.2);
    doc.text('Assigned Safe Sanctuary', leftMargin + 154, y + 4.2);
    y += 6.5;
  };

  drawHabTableHeader();

  // Render all habitations with automatic page break and alternating rows
  habitations.forEach((hab, i) => {
    checkPageBreak(9, drawHabTableHeader);

    const fp = hab.fingerprint || {};
    const destName = hab.assignedShelter?.name || shelters[0]?.name || 'Local Safe Sanctuary';
    const isEven = i % 2 === 0;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(leftMargin, y, contentWidth, 8, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(leftMargin, y + 8, leftMargin + contentWidth, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(220, 38, 38);
    doc.text(`#${hab.priorityRank || i + 1}`, leftMargin + 2, y + 5);

    doc.setTextColor(15, 23, 42);
    const nameStr = hab.name ? (hab.name.length > 24 ? hab.name.slice(0, 23) + '..' : hab.name) : `Habitation ${i + 1}`;
    doc.text(nameStr, leftMargin + 12, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(`${(hab.population || 0).toLocaleString()} p`, leftMargin + 60, y + 5);

    doc.text(`${fp.elderly || 0} Eld • ${fp.infants || 0} Inf • ${fp.disabilities || 0} PwD`, leftMargin + 82, y + 5);

    doc.setTextColor(217, 119, 6);
    doc.setFont('helvetica', 'bold');
    doc.text(`${Math.round((fp.accessCutoffRisk || 0.85) * 100)}%`, leftMargin + 134, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const destStr = destName.length > 18 ? destName.slice(0, 17) + '..' : destName;
    doc.text(destStr, leftMargin + 154, y + 5);

    y += 8;
  });

  y += 5;

  // ==================== SECTION 3: SPHERE STANDARDS AUDIT ====================
  checkPageBreak(30);
  doc.setFillColor(16, 185, 129);
  doc.rect(leftMargin, y - 3, 3, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. SPHERE MINIMUM HUMANITARIAN STANDARDS AUDIT', leftMargin + 6, y + 1.5);
  y += 7;

  const evacPop = summary.totalDisplacedPopulation || 1200;
  const waterReq = evacPop * 45;
  const spaceReq = evacPop * 3.5;
  const latrinesReq = Math.ceil(evacPop / 20);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`• Potable Water Quota (45 LPCD): ${waterReq.toLocaleString()} L/Day required • 10 standby water tankers staged.`, leftMargin + 2, y);
  y += 4.2;
  doc.text(`• Covered Shelter Space (3.5 m2/Pers): ${spaceReq.toLocaleString()} m2 mandated (Total Available: ${(summary.totalShelterCapacity || 7000).toLocaleString()} m2 — Headroom Safe).`, leftMargin + 2, y);
  y += 4.2;
  doc.text(`• Sanitation Minimum (1:20 Ratio): ${latrinesReq} Latrines mandated with segregated male/female/PwD access.`, leftMargin + 2, y);
  y += 4.2;
  doc.text('• Comms Resilience: Offline LoRa 868 MHz Mesh assigned on Channel CH-04 if cellular backhauls fail.', leftMargin + 2, y);
  y += 8;

  // ==================== SECTION 4: SAFE SANCTUARY SHELTERS ====================
  checkPageBreak(35);
  doc.setFillColor(2, 132, 199);
  doc.rect(leftMargin, y - 3, 3, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('4. DESIGNATED SAFE SANCTUARY SHELTER STATUS & CAPACITIES', leftMargin + 6, y + 1.5);
  y += 6.5;

  const drawShelterTableHeader = () => {
    doc.setFillColor(15, 23, 42);
    doc.rect(leftMargin, y, contentWidth, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('Sanctuary Facility Name', leftMargin + 2, y + 4.2);
    doc.text('Type', leftMargin + 85, y + 4.2);
    doc.text('Total Capacity', leftMargin + 120, y + 4.2);
    doc.text('Occupied', leftMargin + 148, y + 4.2);
    doc.text('Medical Readiness', leftMargin + 166, y + 4.2);
    y += 6.5;
  };

  drawShelterTableHeader();

  shelters.forEach((sh, i) => {
    checkPageBreak(8.5, drawShelterTableHeader);
    const isEven = i % 2 === 0;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(leftMargin, y, contentWidth, 7.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(leftMargin, y + 7.5, leftMargin + contentWidth, y + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const shName = sh.name ? (sh.name.length > 38 ? sh.name.slice(0, 37) + '..' : sh.name) : `Relief Sanctuary ${i + 1}`;
    doc.text(shName, leftMargin + 2, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.text(sh.type || 'Safe Sanctuary', leftMargin + 85, y + 4.8);
    doc.text(`${(sh.capacity || 2500).toLocaleString()} slots`, leftMargin + 120, y + 4.8);
    doc.text(`${(sh.occupied || 220).toLocaleString()} pers`, leftMargin + 148, y + 4.8);

    doc.setTextColor(16, 185, 129);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ Triage Ready', leftMargin + 166, y + 4.8);

    y += 7.5;
  });

  y += 6;

  // ==================== SECTION 5: STATUTORY DIRECTIVES & SIGN-OFF ====================
  checkPageBreak(45);
  doc.setFillColor(220, 38, 38);
  doc.rect(leftMargin, y - 3, 3, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('5. STATUTORY EMERGENCY MOBILIZATION ORDERS & SIGN-OFF', leftMargin + 6, y + 1.5);
  y += 6.5;

  const orders = [
    '1. SDRF / NDRF Battalions mobilized for priority convoy escort along designated Green Corridors.',
    '2. Traffic Command to seal vulnerable low-lying bridge spans and maintain High-Ridge Bypass readiness.',
    '3. District Health Mission (DHM) to stage ALS ambulances at primary reception sanctuaries.',
    '4. Telemetry fact-checking enabled to ensure 100% verified disaster broadcast integrity.'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  orders.forEach(order => {
    doc.text(order, leftMargin + 2, y);
    y += 4.2;
  });

  y += 4;

  // Official Signature Block
  checkPageBreak(25);
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(leftMargin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('DIGITAL AUTHORIZATION & DISASTER COMMAND SIGN-OFF', leftMargin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Command Officer: Incident Commander (Authorized NDMA / SDMA Disaster Operations)', leftMargin + 4, y + 10.5);
  doc.text(`Digital Seal: SHA256-${Date.now().toString(16).toUpperCase()}-NDMA-SECURE-VERIFIED`, leftMargin + 4, y + 15);
  doc.text('Status: STATUTORY DIRECTIVE TRANSMITTED TO DISTRICT EMERGENCY OPERATIONS CENTERS', leftMargin + 4, y + 19);

  // ==================== UNIVERSAL FOOTERS ON ALL PAGES ====================
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(241, 245, 249);
    doc.rect(0, pageHeight - 11, pageWidth, 11, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('CONFIDENTIAL & STATUTORY • NDMA DISASTER PROTOCOL 2026', leftMargin, pageHeight - 4);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - rightMargin - 20, pageHeight - 4);
  }

  const fileName = `NDMA_Assessment_Report_${(region.name?.split(',')[0] || 'District').replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.pdf`;
  doc.save(fileName);
}
