import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Send,
  Radio,
  Filter,
  PlusCircle,
  X,
  Trash2,
  Database,
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  XCircle,
  Users
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { useLanguage } from '../context/LanguageContext';

export default function AlertsPage() {
  const { alerts, addAlert, deleteAlert, clearAllAlerts, user } = useDisaster();
  const { t, localizePlace } = useLanguage();
  const [activeTab, setActiveTab] = useState('ALL');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [justBroadcasted, setJustBroadcasted] = useState(false);

  const isAdmin = user && user.role === 'Administrator';

  const [newAlert, setNewAlert] = useState({
    severity: 'CRITICAL',
    title: '',
    desc: '',
    location: '',
    channel: 'DEOC Master Broadcast (LoRa + Web)',
  });

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!newAlert.title || !newAlert.location) return;

    const alertObj = {
      id: Date.now().toString(),
      severity: newAlert.severity,
      title: (isAdmin ? '🚨 OFFICIAL COMMAND: ' : '👤 CITIZEN REPORT: ') + newAlert.title,
      desc: newAlert.desc || 'Emergency ground report registered into district database.',
      location: newAlert.location,
      channel: newAlert.channel,
      timestamp: 'Just now (MongoDB Synced)',
      active: true,
      isOfficial: isAdmin,
    };

    await addAlert(alertObj);
    setIsBroadcastModalOpen(false);
    setActiveTab('ALL');
    setJustBroadcasted(true);
    setTimeout(() => setJustBroadcasted(false), 4000);
    setNewAlert({ severity: 'CRITICAL', title: '', desc: '', location: '', channel: 'DEOC Master Broadcast (LoRa + Web)' });
  };

  const officialDirectives = (alerts || []).filter(a => a.isOfficial || a.title.includes('OFFICIAL') || a.title.includes('🚨'));
  const citizenReports = (alerts || []).filter(a => !a.isOfficial && !a.title.includes('OFFICIAL') && !a.title.includes('🚨'));

  const displayedAlerts = activeTab === 'OFFICIAL'
    ? officialDirectives
    : activeTab === 'CITIZEN'
    ? citizenReports
    : (alerts || []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      
      {/* Success Notification Banner */}
      {justBroadcasted && (
        <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>✓ Emergency Alert Successfully Broadcasted &amp; Stored Permanently in MongoDB Database!</span>
          </div>
          <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded font-mono">MONGODB LIVE</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">District Emergency Broadcast Directives</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono flex items-center gap-1">
                <Database className="h-3 w-3" /> MongoDB Shared Network
              </span>
            </div>
            <p className="text-xs text-slate-400">Strict separation of Official NDMA Command Orders vs Verified Citizen Field Reports.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && alerts && alerts.length > 0 && (
            <button
              onClick={clearAllAlerts}
              title="Administrator Only: Clear All Alerts"
              className="px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Admin: Clear All</span>
            </button>
          )}

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Radio className="h-4 w-4 animate-pulse" />
            <span>Broadcast Ground Alert</span>
          </button>
        </div>
      </div>

      {/* Role Permission Badge */}
      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>Administrator Mode: Your broadcasts are pinned as Official Command Directives with siren priority.</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-blue-300">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>Citizen Mode: Broadcasts are logged as Citizen Field Reports and correlated against live IMD/GSI radar sensors.</span>
            </span>
          )}
        </div>
        <span className="font-mono text-slate-500">Role: {user?.role || 'Citizen'}</span>
      </div>

      {/* Category Tabs: ALL | OFFICIAL DIRECTIVES | CITIZEN REPORTS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-1.5 rounded-xl font-black transition-all ${
            activeTab === 'ALL'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Incident Directives ({alerts?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('OFFICIAL')}
          className={`px-3.5 py-1.5 rounded-xl font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'OFFICIAL'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
              : 'bg-slate-900 text-amber-400/80 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Official Command Directives ({officialDirectives.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CITIZEN')}
          className={`px-3.5 py-1.5 rounded-xl font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'CITIZEN'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'bg-slate-900 text-blue-400/80 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Citizen Ground Reports ({citizenReports.length})</span>
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {displayedAlerts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl space-y-3 shadow-lg">
            <div className="h-12 w-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">No Active Directives in Category</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
                No reports registered under "{activeTab}". All regional corridors operating normally.
              </p>
            </div>
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-red-600/30 transition-all active:scale-95"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>Broadcast Incident Report</span>
            </button>
          </div>
        ) : (
          displayedAlerts.map((alert) => {
            const isOfficial = alert.isOfficial || alert.title.includes('OFFICIAL') || alert.title.includes('🚨');
            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border text-xs space-y-3 transition-all relative group ${
                  isOfficial
                    ? 'bg-red-950/40 border-red-700/80 shadow-lg shadow-red-950/50'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-lg font-black text-[10px] border ${
                        isOfficial
                          ? 'bg-red-900 text-red-100 border-red-600'
                          : 'bg-blue-900 text-blue-100 border-blue-700'
                      }`}
                    >
                      {isOfficial ? '🛡️ OFFICIAL DIRECTIVE' : '👥 CITIZEN REPORT'}
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      📡 {alert.channel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-500" /> {alert.timestamp}
                    </span>

                    {isAdmin && (
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        title="Administrator Only: Delete Alert"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-white text-base leading-snug">{alert.title}</h3>
                  <p className="text-slate-300 leading-relaxed mt-1">{alert.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-slate-400 font-semibold text-[11px]">
                  <span>📍 Location: <strong className="text-white">{alert.location}</strong></span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Live in MongoDB Database
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                <h3 className="text-base font-black text-white">Broadcast Emergency Incident Alert</h3>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Severity Level</label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-red-500"
                >
                  <option value="CRITICAL">🔴 CRITICAL (Immediate Evacuation)</option>
                  <option value="HIGH">🟠 HIGH (Capacity Overload / Cutoff)</option>
                  <option value="MODERATE">🟡 MODERATE (Advisory Notice)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Incident Alert Title</label>
                <input
                  type="text"
                  required
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  placeholder="e.g. Flash Flood Surcharge on Meppadi Bridge"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Location / Sector</label>
                <input
                  type="text"
                  required
                  value={newAlert.location}
                  onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                  placeholder="e.g. Meppadi Sector, Wayanad"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Detailed Directive Instructions</label>
                <textarea
                  rows="3"
                  value={newAlert.desc}
                  onChange={(e) => setNewAlert({ ...newAlert, desc: e.target.value })}
                  placeholder="Specific actions for responders and citizens..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black shadow-lg shadow-red-600/30 flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Transmit &amp; Store Permanently</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
