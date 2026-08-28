import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  UsersRound,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Activity,
  Navigation,
  Radio,
  Building
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { useLanguage } from '../context/LanguageContext';
import StatCard from '../components/common/StatCard';
import EmergencyActionBanner from '../components/common/EmergencyActionBanner';
import InteractiveMap from '../components/map/InteractiveMap';
import GovtTelemetryBanner from '../components/common/GovtTelemetryBanner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { simulationData, toggleRoute, activeRouteHabId } = useDisaster();
  const { t, localizePlace } = useLanguage();

  if (!simulationData) return null;
  const { summary, relocationPriorities, region } = simulationData;

  return (
    <div className="space-y-6">
      
      {/* 5 High-Level Metric Cards (Dynamically Computed CCI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title={t('kpiActiveHazards')}
          value="3 Critical"
          subtext="Landslide, Flood, Cloudburst"
          icon={Flame}
          color="red"
          badge="High Severity"
        />
        <StatCard
          title={t('kpiCriticalRedZones')}
          value={`${summary.redZonesCount} Zones`}
          subtext="MHI > 68% Unsafe"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title={t('kpiPeopleAtRisk')}
          value={summary.totalDisplacedPopulation.toLocaleString()}
          subtext={`${summary.immediateEvacuees} Immediate`}
          icon={UsersRound}
          color="amber"
          badge={t('kpiMandatory')}
        />
        <StatCard
          title={t('kpiShelterCapacity')}
          value={summary.totalShelterCapacity.toLocaleString()}
          subtext="Safe Headroom"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title={t('kpiCarryingCapacity')}
          value={`CCI: ${summary.cci}`}
          subtext={`${summary.cciStrainPercent}% Capacity Load`}
          icon={Activity}
          color={summary.cciColor || 'emerald'}
          badge={summary.cciBadge || 'Headroom Safe'}
        />
      </div>

      {/* Official Government Data Sources & Solved Guidelines Telemetry */}
      <GovtTelemetryBanner />

      {/* Emergency Action Directives Panel */}
      <EmergencyActionBanner habitations={relocationPriorities} />

      {/* Main Workspace Split: Map + Priority Evacuation Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: GIS Map Card */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[540px] shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                {t('mapTitle')}
              </h3>
              <p className="text-xs text-slate-400">{region.name}</p>
            </div>

            <button
              onClick={() => navigate('/map')}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
            >
              <span>{t('navMap')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden">
            <InteractiveMap />
          </div>
        </div>

        {/* Right: Prioritized Relocation Manifest & Action Dispatch */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Priority Settlement Relocations Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                {t('immediateEvac')}
              </span>
              <button
                onClick={() => navigate('/relocation')}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
              >
                <span>{t('viewManifest')}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3">
              {relocationPriorities?.slice(0, 4).map((hab) => {
                const isRouteActive = activeRouteHabId === hab.id;
                return (
                  <div
                    key={hab.id}
                    className={`p-3.5 rounded-xl border text-xs transition-all ${
                      isRouteActive
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <strong className="text-white block text-sm font-black">
                          #{hab.priorityRank} {localizePlace(hab.name)}
                        </strong>
                        <span className="text-[11px] text-slate-400">
                          {t('kpiPeopleAtRisk')}: <strong className="text-slate-200">{hab.population}</strong> • {t('elderly')}: <strong className="text-rose-400">{hab.fingerprint.elderly}</strong>
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-950 text-red-400 border border-red-800 flex-shrink-0">
                        RUI: {Math.round(hab.rui * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 mt-2">
                      <span className="text-[11px] text-amber-400 font-bold">
                        {t('cutoffRisk')}: {Math.round(hab.fingerprint.accessCutoffRisk * 100)}%
                      </span>

                      <button
                        onClick={() => toggleRoute(hab.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                          isRouteActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <Navigation className="h-3 w-3" />
                        <span>{isRouteActive ? t('showingRoute') : t('drawRoute')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tactical Dispatch Readiness */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-rose-400">
                <Radio className="h-4 w-4 animate-pulse" />
                <span>{t('logisticsRadio')}</span>
              </div>
              <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-emerald-400 font-mono border border-slate-800">
                LoRa CH-04 Active
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Evacuation Convoys:</span>
              <strong className="text-white">12 Buses + 4 Ambulances Standby</strong>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Carrying Capacity Status:</span>
              <strong className="text-emerald-300">CCI {summary.cci} ({summary.cciStrainPercent}% Load)</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
