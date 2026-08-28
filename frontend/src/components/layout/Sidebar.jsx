import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  Map,
  Fingerprint,
  UsersRound,
  Home,
  Sliders,
  FileText,
  Bell,
  Settings,
  LogOut,
  Wifi,
  WifiOff,
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { useLanguage } from '../../context/LanguageContext';
import AiAssistantModal from '../common/AiAssistantModal';

export default function Sidebar() {
  const { isOnline, isSyncing, lastSyncedAt, user, managedUsers, alerts } = useDisaster();
  const liveAlertsCount = alerts ? alerts.length : 0;
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const isCitizen = user.role === 'Local Citizen / Volunteer';

  const navItems = [
    { name: t('navDashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('navMap'), path: '/map', icon: Map },
    { name: t('navVulnerability'), path: '/vulnerability', icon: Fingerprint },
    { name: t('navRelocation'), path: '/relocation', icon: UsersRound },
    { name: t('navShelters'), path: '/shelters', icon: Home },
    { name: t('navSimulation'), path: '/simulation', icon: Sliders },
    { name: t('navReports'), path: '/reports', icon: FileText },
    { name: t('navAlerts'), path: '/alerts', icon: Bell, badge: liveAlertsCount > 0 ? liveAlertsCount.toString() : null },
    { name: t('navSettings'), path: '/settings', icon: Settings },
  ];

  return (
    <>
      <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col h-screen flex-shrink-0 select-none z-30">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                {isCitizen ? 'Citizen Safety Portal' : t('emergencySystem')}
              </span>
            </div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1">
              RED-ZONE <span className="text-red-500">X</span>
            </h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/90'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="h-5 px-1.5 rounded-full bg-red-950 text-red-400 border border-red-800 text-[10px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Admin Panel Tab */}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all mt-2 ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-amber-400 hover:bg-slate-900/90 border border-amber-900/40 bg-amber-950/20'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Panel</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono text-[9px] border border-emerald-800">
              DB LIVE
            </span>
          </NavLink>

          {/* AI Tactical Intelligence Assistant Trigger */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="w-full mt-2 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-900/40 to-indigo-900/40 hover:from-blue-900/60 hover:to-indigo-900/60 text-blue-300 border border-blue-700/50 shadow-md transition-all group active:scale-95"
          >
            <div className="flex items-center gap-2.5">
              <Bot className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Ask AI Intelligence</span>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          </button>
        </nav>

        {/* Bottom Status: 100% Fully Automated Background Cloud Sync Indicator */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 space-y-2.5">
          
          <div
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-amber-950/50 border-amber-800/80 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {isOnline ? <Wifi className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" /> : <WifiOff className="h-3.5 w-3.5 text-amber-400 animate-pulse flex-shrink-0" />}
              <div className="truncate">
                <span className="block text-[11px] font-black">{isOnline ? 'Online (Auto-Synced)' : 'Offline (Local Cache)'}</span>
                <span className="text-[9px] text-slate-400 block">Auto-Sync: {lastSyncedAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span>LIVE</span>
            </div>
          </div>

          {/* User Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-200 truncate">{user.name}</div>
                <div className="text-[10px] text-amber-400 truncate font-semibold">{user.role}</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* AI Assistant Modal */}
      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </>
  );
}
