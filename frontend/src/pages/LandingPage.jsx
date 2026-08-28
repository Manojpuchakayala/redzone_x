import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  Flame,
  Fingerprint,
  UsersRound,
  Map,
  WifiOff,
  Sliders,
  Sparkles,
  Zap,
  LocateFixed,
  Radio,
  PhoneCall
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { detectUserLocation } = useDisaster();

  const handleInstantEmergencyPass = async () => {
    navigate('/dashboard');
    try {
      await detectUserLocation();
    } catch (e) {}
  };

  const capabilities = [
    { title: 'Multi-Hazard Risk Assessment', desc: 'Integrated modeling of landslide, flood, cloudburst, and slope instability into dynamic Red Zones.', icon: Flame, color: 'text-red-500' },
    { title: 'Vulnerability Fingerprinting', desc: 'Deep demographic profiling (elderly, infants, PwD, medical needs, road cutoff risks) beyond raw population counts.', icon: Fingerprint, color: 'text-amber-500' },
    { title: 'Intelligent Relocation Planning', desc: 'Carrying capacity suitability audit with automated multi-site split allocation algorithm.', icon: UsersRound, color: 'text-emerald-500' },
    { title: 'Real-Time Risk Visualization', desc: 'Interactive Leaflet vector map with live GPS geolocation, hospital nodes, and animated safe corridors.', icon: Map, color: 'text-blue-500' },
    { title: 'Offline Emergency Operations', desc: 'Client-side calculation and cached disaster packages that function with zero internet access.', icon: WifiOff, color: 'text-purple-500' },
    { title: 'What-If Disaster Simulation', desc: 'Test climate stress, cloudburst surges, and shelter collapses with dynamic instant re-routing.', icon: Sliders, color: 'text-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Critical Disaster Alert Emergency Bar */}
      <div className="bg-red-600 px-4 py-2 text-white text-xs font-black flex items-center justify-between flex-wrap gap-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 animate-bounce" />
          <span>IN AN ACTIVE DISASTER? ZERO SIGN-UP REQUIRED. INSTANT EVACUATION PASS ACTIVE.</span>
        </div>
        <button
          onClick={handleInstantEmergencyPass}
          className="bg-slate-950 hover:bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all"
        >
          <span>🚨 Instant SOS Mode (1-Click)</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">RED-ZONE <span className="text-red-500">X</span></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2"
          >
            Operator Sign In
          </button>
          <button
            onClick={handleInstantEmergencyPass}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>Instant Dashboard</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-14 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-black uppercase mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" /> SIH26191 National Disaster Decision Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
          RED-ZONE <span className="text-red-500">X</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-slate-300 mt-2">
          Intelligent Disaster Risk &amp; Evacuation Platform
        </h2>

        <p className="text-base md:text-lg text-slate-400 mt-4 max-w-2xl leading-relaxed">
          Immediate hazard detection, demographic vulnerability fingerprinting, and zero-delay safe sanctuary relocation.
        </p>

        {/* Hero Actions: Instant SOS Evacuation Route */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={handleInstantEmergencyPass}
            className="px-7 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white text-sm font-black shadow-2xl shadow-red-600/50 transition-all flex items-center gap-2.5 active:scale-95 animate-pulse"
          >
            <LocateFixed className="h-5 w-5" />
            <span>🚨 1-CLICK INSTANT EVACUATION PASS (NO LOGIN)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => navigate('/map')}
            className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold transition-all"
          >
            🗺️ Live GIS Risk Map
          </button>
        </div>

        {/* Emergency Helpline Numbers */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-400 flex-wrap">
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <PhoneCall className="h-3.5 w-3.5" /> Emergency Helpline: <strong>112</strong>
          </span>
          <span>•</span>
          <span>NDMA Control Room: <strong>1078</strong></span>
          <span>•</span>
          <span>District Disaster Center: <strong>1077</strong></span>
        </div>
      </section>

      {/* Key Capabilities Grid */}
      <section className="px-6 py-16 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-xs font-black uppercase tracking-widest text-red-400">Core Decision Modules</h3>
            <h4 className="text-2xl font-black text-white mt-1">Engineered for Rapid Field &amp; Citizen Action</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="p-3 rounded-xl bg-slate-950 w-fit mb-4 border border-slate-800">
                    <Icon className={`h-6 w-6 ${cap.color}`} />
                  </div>
                  <h5 className="text-base font-bold text-white mb-2">{cap.title}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        RED-ZONE X • Zero-Delay Disaster Risk &amp; Habitation Relocation System • Designed for SIH 2026
      </footer>

    </div>
  );
}
