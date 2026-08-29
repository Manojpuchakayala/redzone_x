import React, { useState } from 'react';
import InteractiveMap from '../components/map/InteractiveMap';
import { useDisaster } from '../context/DisasterContext';
import { useLanguage } from '../context/LanguageContext';
import { X } from 'lucide-react';

export default function RiskMapPage() {
  const { simulationData, activeRouteHabId, toggleRoute } = useDisaster();
  const { t } = useLanguage();
  const [inspectedZone, setInspectedZone] = useState(null);

  return (
    <div className="h-full flex flex-col space-y-4">
      
      {/* Map Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div>
          <h2 className="text-base font-black text-white">{t('mapTitle')}</h2>
          <p className="text-xs text-slate-400">{t('brandSubtitle')}</p>
        </div>

        {/* Habitation Quick Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">{t('drawRoute')}:</span>
          <select
            value={activeRouteHabId || ''}
            onChange={(e) => toggleRoute(e.target.value || null)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
          >
            <option value="">-- {t('drawRoute')} --</option>
            {simulationData?.relocationPriorities?.map((h) => (
              <option key={h.id} value={h.id}>
                #{h.priorityRank} {h.name} ({h.population} {t('kpiPeopleAtRisk')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Full Map Canvas with Slide-out Drawer */}
      <div className="flex-1 relative min-h-[550px] rounded-2xl overflow-hidden border border-slate-800">
        <InteractiveMap onSelectZone={(zone) => setInspectedZone(zone)} />

        {/* Selected Zone Inspection Panel */}
        {inspectedZone && (
          <div className="absolute bottom-12 left-4 z-[1000] w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-3.5 shadow-2xl text-xs space-y-2.5 max-h-[65vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <strong className="text-xs font-black text-white truncate pr-2">{inspectedZone.name}</strong>
              <button onClick={() => setInspectedZone(null)} className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="flex justify-between">
                <span>Classification:</span>
                <span style={{ color: inspectedZone.colorHex }} className="font-bold">{inspectedZone.zoneCategory?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Multi-Hazard Index:</span>
                <strong className="text-white font-mono">{Math.round((inspectedZone.mhi || 0.8) * 100)}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Slope Angle:</span>
                <strong className="text-white">{inspectedZone.baseSlope}°</strong>
              </div>
              <div className="flex justify-between">
                <span>Soil:</span>
                <strong className="text-white truncate max-w-[130px]">{inspectedZone.soilType}</strong>
              </div>
              <div className="flex justify-between">
                <span>Landslide Risk:</span>
                <strong className="text-red-400">{inspectedZone.landslideRisk}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Flood Risk:</span>
                <strong className="text-amber-400">{inspectedZone.floodRisk}%</strong>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
              <strong className="text-amber-400 block mb-0.5">{t('actionTitle')}:</strong>
              {inspectedZone.actionRecommendation}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
