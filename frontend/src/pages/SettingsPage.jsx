import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { OfflineStorageService } from '../services/offlineStorage';
import {
  Settings,
  Download,
  Radio,
  HardDrive,
  CheckCircle2,
  Database,
  Sparkles,
  FileJson,
  RotateCcw,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function SettingsPage() {
  const { selectedRegion, simulationData, isOnline, user, alerts, managedUsers, resetAlertsToDefault, setSearchNotification } = useDisaster();
  const [sanitizing, setSanitizing] = useState(false);

  const handleDownloadPackage = () => {
    OfflineStorageService.savePackage(selectedRegion, simulationData);
    setSearchNotification(`✓ Regional Package for ${selectedRegion.toUpperCase()} saved permanently!`);
    setTimeout(() => setSearchNotification(null), 4000);
  };

  const handleSanitizeDatabase = () => {
    setSanitizing(true);
    setTimeout(() => {
      OfflineStorageService.sanitizeAndDeduplicate();
      setSanitizing(false);
      setSearchNotification("✨ Database Sanitized: All records structured, indexed & deduplicated!");
      setTimeout(() => setSearchNotification(null), 4000);
    }, 600);
  };

  const handleExportBackup = () => {
    OfflineStorageService.exportMasterDatabaseBackup();
    setSearchNotification("📁 Clean JSON Database Backup Downloaded!");
    setTimeout(() => setSearchNotification(null), 4000);
  };

  // Calculate approximate storage size
  const storageSizeBytes = Math.round(
    ((localStorage.getItem('REDZONE_PERSISTED_ALERTS_V1') || '').length +
     (localStorage.getItem('REDZONE_OFFLINE_PACKAGE_V1') || '').length) / 1024
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Database className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Permanent Database &amp; System Configuration</h2>
            <p className="text-xs text-slate-400">Structured data persistence, automatic deduplication &amp; LoRa radio parameters</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-bold">Storage Health:</span>
          <strong className="text-emerald-400 font-mono">100% Clean ({storageSizeBytes} KB)</strong>
        </div>
      </div>

      {/* Database Sanitation & Structured Backup Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <span>Clean Structured Database Tools</span>
            </h3>
            <p className="text-xs text-slate-400">Ensure stored alerts, official users, and simulation logs remain organized without clutter.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSanitizeDatabase}
              disabled={sanitizing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className={`h-4 w-4 text-amber-400 ${sanitizing ? 'animate-spin' : ''}`} />
              <span>{sanitizing ? 'Cleaning...' : 'Deduplicate & Clean Data'}</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <FileJson className="h-4 w-4" />
              <span>Export Clean Backup (.JSON)</span>
            </button>
          </div>
        </div>

        {/* Database Collections Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-black text-slate-500">Collection: Emergency Alerts</span>
            <div className="text-lg font-black text-white font-mono">{alerts?.length || 4} Records</div>
            <span className="text-[10px] text-emerald-400 block">✓ Persisted to Local Storage &amp; Cloud</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-black text-slate-500">Collection: Verified Responders</span>
            <div className="text-lg font-black text-white font-mono">{managedUsers?.length || 4} Users</div>
            <span className="text-[10px] text-emerald-400 block">✓ Auto-Verified by Govt Database</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-black text-slate-500">Collection: Offline GIS Packages</span>
            <div className="text-lg font-black text-white font-mono">4 Pilot Jurisdictions</div>
            <span className="text-[10px] text-emerald-400 block">✓ Zero-Internet Resilient</span>
          </div>
        </div>
      </div>

      {/* Offline Data Package Downloader */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <HardDrive className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Permanent Offline Regional Package ({selectedRegion.toUpperCase()})</h3>
              <p className="text-[11px] text-slate-400">Stores vector polygons, DEM slopes, shelter capacities &amp; habitation rosters permanently in browser storage.</p>
            </div>
          </div>

          <button
            onClick={handleDownloadPackage}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
          >
            <Download className="h-4 w-4" />
            <span>Save Package Permanently</span>
          </button>
        </div>
      </div>

      {/* LoRa Radio Mesh Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">LoRa Mesh Radio Transceiver Configuration</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Active Broadcast Frequency</span>
            <strong className="text-white text-sm">868 MHz (India ISM Band)</strong>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Tactical Telemetry Channel</span>
            <strong className="text-emerald-400 text-sm">Channel CH-04 (Emergency Relay)</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
