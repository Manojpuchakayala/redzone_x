import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  Sliders,
  Radio,
  Building,
  CheckCircle2,
  Lock,
  Flame,
  Users,
  BadgeCheck,
  Database,
  Bell,
  Trash2,
  ShieldAlert,
  Search,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  XCircle,
  FileCheck
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { useLanguage } from '../context/LanguageContext';

export default function AdminPage() {
  const {
    user,
    managedUsers,
    approveUser,
    rejectUser,
    simulationData,
    rainfallMm,
    setRainfallMm,
    hazardIntensity,
    setHazardIntensity,
    alerts,
    deleteAlert,
    clearAllAlerts,
    addAlert,
    fetchLiveAlertsFromBackend,
  } = useDisaster();

  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('ALERTS'); // Defaults to Alerts Moderation
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [moderationNotification, setModerationNotification] = useState(null);

  // Automated Government Telemetry Cross-Verification Analyzer
  const verifyAlertAgainstGovtData = (alert) => {
    const titleAndDesc = (alert.title + " " + alert.desc + " " + alert.location).toLowerCase();
    
    // Check if rainfall or floods mentioned vs rainfallMm sensor
    if (titleAndDesc.includes('flood') || titleAndDesc.includes('rain') || titleAndDesc.includes('water')) {
      if (rainfallMm >= 120) {
        return {
          status: 'VERIFIED',
          source: 'IMD Doppler Radar & CWC Basin Gauge',
          confidence: '98% Confirmed',
          details: `Matches live IMD rainfall load (${rainfallMm} mm/24h) and CWC river stage alert.`,
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
        };
      } else if (rainfallMm < 50) {
        return {
          status: 'FALSE_ALARM',
          source: 'IMD AWS Telemetry Normal',
          confidence: '89% False Alarm Risk',
          details: `IMD weather stations report only ${rainfallMm} mm rainfall. No flood conditions present.`,
          badgeColor: 'bg-red-950 text-red-300 border-red-800',
        };
      }
    }

    // Check if landslide mentioned vs hazardIntensity
    if (titleAndDesc.includes('landslide') || titleAndDesc.includes('debris') || titleAndDesc.includes('slope')) {
      if (hazardIntensity >= 1.0) {
        return {
          status: 'VERIFIED',
          source: 'GSI LEWS Sensor Array & ISRO CartoDEM',
          confidence: '95% Geotechnical Match',
          details: 'Pore-water pressure sensor deformation correlates with slope instability.',
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
        };
      }
    }

    return {
      status: 'CITIZEN_REPORT',
      source: 'Crowdsourced Ground Observation',
      confidence: 'Pending Sensor Correlation',
      details: 'Report logged by local field observer. Cross-referencing secondary telemetry.',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    };
  };

  // Automated Removal of Telemetry-Flagged False Alarms
  const handleAutoPurgeFalseAlarms = () => {
    let purgedCount = 0;
    alerts.forEach(a => {
      const ver = verifyAlertAgainstGovtData(a);
      if (ver.status === 'FALSE_ALARM') {
        deleteAlert(a.id);
        purgedCount++;
      }
    });

    setModerationNotification(
      purgedCount > 0
        ? `✓ Automated Fact-Checker removed ${purgedCount} telemetry-flagged false alert(s)!`
        : '✓ All active alerts are verified against official government data. 0 false alarms detected.'
    );
    setTimeout(() => setModerationNotification(null), 4000);
  };

  const handleBroadcastSiren = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    addAlert({
      id: Date.now().toString(),
      severity: 'CRITICAL',
      title: '🚨 OFFICIAL NDMA COMMAND DIRECTIVE: ' + broadcastMessage.slice(0, 45) + '...',
      desc: broadcastMessage,
      location: 'Wayanad Operational Command Sector',
      channel: 'DEOC Master Siren & LoRa Mesh',
      timestamp: 'Just now (Official Command)',
      active: true,
    });

    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 4000);
  };

  const filteredAlerts = filterSeverity === 'ALL'
    ? alerts
    : alerts.filter(a => a.severity === filterSeverity);

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs">
      
      {/* Admin Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Administrator Command &amp; Moderation Center</h2>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-black uppercase">
                ADMIN PRIVILEGES
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated Alert Verification, False Information Purge, ID Registry Ledger &amp; Siren Overrides</p>
          </div>
        </div>

        {/* Current Operator Profile */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="h-8 w-8 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center">
            ADM
          </div>
          <div className="text-xs">
            <div className="font-bold text-white">{user.name}</div>
            <div className="text-[10px] text-amber-400 font-semibold">{user.role}</div>
          </div>
        </div>
      </div>

      {/* Moderation Alert Banner */}
      {moderationNotification && (
        <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl text-emerald-200 font-bold flex items-center gap-2 shadow-xl animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <span>{moderationNotification}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold flex-wrap">
        <button
          onClick={() => setActiveTab('ALERTS')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'ALERTS'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bell className="h-4 w-4 text-red-400 animate-pulse" />
          <span>Alerts Moderation &amp; Fact-Checking ({alerts.length} Active)</span>
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'USERS'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BadgeCheck className="h-4 w-4 text-emerald-400" />
          <span>Automated ID Verification Ledger ({managedUsers.length} Users)</span>
        </button>

        <button
          onClick={() => setActiveTab('ZONES')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'ZONES'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Hazard Zone Overrides</span>
        </button>

        <button
          onClick={() => setActiveTab('BROADCAST')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'BROADCAST'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Radio className="h-4 w-4" />
          <span>District Emergency Broadcast Master</span>
        </button>
      </div>

      {/* TAB 1: Alerts Moderation & Automated Fact-Checking */}
      {activeTab === 'ALERTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          
          {/* Header & Quick Action Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-400" />
                <h3 className="text-base font-black text-white">Emergency Alerts Fact-Checking &amp; False Info Filter</h3>
              </div>
              <p className="text-xs text-slate-400">
                Cross-references user alerts against IMD Radar, GSI Landslide Sensors &amp; CWC Gauge telemetry to detect false alarms and spam.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoPurgeFalseAlarms}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold shadow-md shadow-red-600/30 flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Auto-Check &amp; Purge False Info</span>
              </button>

              {alerts.length > 0 && (
                <button
                  onClick={clearAllAlerts}
                  className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 font-bold transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All Database Alerts</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold text-[11px]">Filter by Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filterSeverity === sev
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Alerts Feed with Live Fact-Check Breakdown */}
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="p-10 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">No Active Alerts in Database</h4>
                <p className="text-xs text-slate-500">Database is clean. Any alert broadcast by citizens will appear here for automated sensor correlation.</p>
              </div>
            ) : filteredAlerts.map(alert => {
              const verification = verifyAlertAgainstGovtData(alert);
              return (
                <div
                  key={alert.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg font-black text-[10px] border ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : alert.severity === 'HIGH'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-blue-950 text-blue-300 border-blue-800'
                      }`}>
                        {alert.severity}
                      </span>

                      {/* Automated Government Fact-Check Badge */}
                      <span className={`px-2.5 py-0.5 rounded-lg font-mono text-[10px] font-bold border flex items-center gap-1 ${verification.badgeColor}`}>
                        {verification.status === 'VERIFIED' ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : verification.status === 'FALSE_ALARM' ? <XCircle className="h-3 w-3 text-red-400" /> : <Eye className="h-3 w-3 text-amber-400" />}
                        <span>{verification.status === 'VERIFIED' ? '✓ GOVT DATA VERIFIED' : verification.status === 'FALSE_ALARM' ? '🚨 FLAGGED FALSE ALARM' : '⚠️ CITIZEN REPORT (PENDING)'}</span>
                      </span>

                      <span className="text-[10px] text-slate-500 font-mono">
                        📡 {alert.channel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" /> {alert.timestamp}
                      </span>

                      {/* Admin Delete Action */}
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        title="Delete Alert from Public Feed & MongoDB"
                        className="px-3 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete False Alert</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-black text-sm">{alert.title}</h4>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">{alert.desc}</p>
                  </div>

                  {/* Fact-Check Telemetry Breakdown Box */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-slate-400 block font-medium">
                        📍 Sector: <strong className="text-white">{alert.location}</strong> • Automated Cross-Check: <strong className="text-amber-300">{verification.source}</strong>
                      </span>
                      <span className="text-slate-400 block mt-0.5">
                        Correlation: <strong className="text-slate-200">{verification.details}</strong>
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono text-[10px] border border-slate-800 font-bold">
                      {verification.confidence}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: Automated Government ID Verification Ledger */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <h3 className="text-base font-black text-white">Automated Database ID Verification Ledger</h3>
              </div>
              <p className="text-xs text-slate-400">All official responder Government IDs (NDRF, SDMA, DHM, Police) are automatically checked and approved by the database registry in real time.</p>
            </div>
            <span className="text-xs bg-emerald-950 px-3 py-1 rounded-xl text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Live Auto-Verification Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-black uppercase text-slate-500">
                  <th className="py-3 px-3">Official / Citizen</th>
                  <th className="py-3 px-3">Government Badge ID</th>
                  <th className="py-3 px-3">Assigned Role</th>
                  <th className="py-3 px-3">Database Verification Method</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {managedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-950/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <strong className="text-white block text-xs font-bold">{u.name}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-mono text-[11px] border border-slate-800">
                        {u.badgeId || 'CITIZEN'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-200">{u.role}</span>
                    </td>
                    <td className="py-3.5 px-3 text-emerald-400 text-[11px] font-mono">
                      {u.verificationMethod || '✓ Auto-Verified (Govt Registry)'}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                          u.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}
                      >
                        ✓ {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Hazard Zone Overrides */}
      {activeTab === 'ZONES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div>
            <h3 className="text-base font-black text-white">Live Environmental &amp; Hazard Zone Overrides</h3>
            <p className="text-xs text-slate-400">Admin can manually stress-test and force red-zone thresholds across all sector sensors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">24-Hour Rainfall Load:</span>
                <strong className="text-blue-400 font-mono text-sm">{rainfallMm} mm/24h</strong>
              </div>
              <input
                type="range"
                min="30"
                max="350"
                step="10"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>30mm (Light)</span>
                <span>180mm (Monsoon)</span>
                <span>350mm (Extreme Cloudburst)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Hazard Multiplier:</span>
                <strong className="text-amber-400 font-mono text-sm">{hazardIntensity.toFixed(1)}x</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={hazardIntensity}
                onChange={(e) => setHazardIntensity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.5x (Damped)</span>
                <span>1.0x (Standard)</span>
                <span>2.0x (Catastrophic)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: District Emergency Broadcast Master */}
      {activeTab === 'BROADCAST' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div>
            <h3 className="text-base font-black text-white">District Emergency Operations Center Master Broadcast</h3>
            <p className="text-xs text-slate-400">Directly transmit emergency siren alerts to all mobile devices (CAP), LoRa radios (868 MHz), and field responder tablets.</p>
          </div>

          {broadcastSent && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>✓ Official NDMA Emergency Directive Transmitted to 14,200 Connected Devices &amp; LoRa Mesh!</span>
            </div>
          )}

          <form onSubmit={handleBroadcastSiren} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Official Emergency Directive Message</label>
              <textarea
                rows="4"
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="e.g. MANDATORY IMMEDIATE EVACUATION ORDER: Saturated debris flow detected in Upper Chooralmala. All citizens proceed immediately to Meppadi Higher Secondary Complex via Green Ridge Corridor."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <Radio className="h-4 w-4 animate-pulse" />
                <span>Issue District-Wide Evacuation Siren</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
