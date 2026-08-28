# 🚨 RED-ZONE X — Intelligent Hazard Red-Zoning, Carrying Capacity & Relocation DSS

> **SIH 2026 Problem Statement (SIH26191):** Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs for Vulnerable Habitations.

---

## 🌟 Key Features & Innovations

1. **Intelligent Multi-Hazard Red-Zoning ($MHI$)**:
   - Computes Multi-Hazard Index ($MHI$) using terrain slope, soil thickness, drainage distance, landslide susceptibility, flood inundation, and cloudburst stress.
   - Categorizes sectors into 🔴 **Red Zones ($MHI ge 68%$)**, 🟠 **Orange Alert Zones**, and 🟢 **Green Safe Sanctuaries**.

2. **Demographic Vulnerability Fingerprint ($VFS$)**:
   - 6-Axis SVG Radar Chart modeling human vulnerability beyond raw headcount:
     - Elderly (65+), Infants (<5y), Women, Persons with Disabilities (PwD), Medical dependencies, House structural fragility, and Single-road access cutoff risk.

3. **Carrying Capacity & Split Relocation Optimizer ($CSS$ & $CCI$)**:
   - Constrained mathematical optimizer that balances evacuee loads across multiple safe sanctuaries ($1,420 ightarrow 1,050 + 370$) so camps never suffer from water (45 LPCD) or medical shortages.
   - Calculates dynamic **Carrying Capacity Index ($CCI$)**.

4. **What-If Disaster Digital Twin**:
   - Real-time simulation of $30	ext{mm} - 350	ext{mm}$ rainfall loads and shelter inundation/failure cutoffs with instant automated re-routing.

5. **Universal Location Engine & Multilingual Support**:
   - Real browser GPS auto-detection + Search for any Indian mandal (*Repalle, Wayanad, Vizag, Joshimath, Mandi, Mumbai, etc.*) or world city (*Tokyo, Japan*).
   - 12 Languages with automatic place-name transliteration for tourists and emergency responders.

6. **1-Click NDMA Directive Exporter (PDF)**:
   - Exports legally binding official Evacuation Orders with full manifests and LoRa 868 MHz Channel CH-04 radio frequency configurations.

---

## 🚀 How to Run Locally

### 1. Frontend (React + Vite + Leaflet)
```bash
cd frontend
npm install
npm run dev
```
👉 Runs at: **http://localhost:5175/** (or 5173)

### 2. Backend (Node.js + Express + MongoDB)
```bash
cd backend
npm install
node server.js
```
👉 Runs at: **http://localhost:5001/api/health**

---

## 📁 Project Directory Structure
```
hazard-redzone-system/
├── frontend/             # React 18 + Vite + Tailwind + Leaflet GIS SPA
│   ├── src/
│   │   ├── components/   # Map, Layout, Radar, Directives, AI Assistant
│   │   ├── pages/        # 11 full routing pages (Dashboard, Map, Vulnerability, etc.)
│   │   ├── services/     # Simulation engine, Geolocation, PDF Exporter, Offline
│   │   ├── context/      # DisasterContext, LanguageContext
│   │   └── data/         # Disaster data & multilingual translations
│   └── vercel.json       # 1-click Vercel deployment config
│
├── backend/              # Node.js + Express + MongoDB REST API
│   ├── models/           # Mongoose schemas (User, HazardZone, Habitation, etc.)
│   ├── controllers/      # Auth & Simulation controllers
│   ├── algorithms/       # Multi-hazard & carrying capacity algorithms
│   ├── config/           # MongoDB connection with auto-fallback
│   ├── server.js         # Express entry point
│   └── render.yaml       # 1-click Render deployment config
│
├── docker-compose.yml    # 1-command full-stack containerization
└── DEPLOYMENT_GUIDE.md   # Step-by-step hosting guide
```
