import React, { useState, useRef, useEffect } from 'react';
import {
  LocateFixed,
  Search,
  FileDown,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Globe,
  X,
  MapPin,
  Zap,
  PhoneCall
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { useLanguage } from '../../context/LanguageContext';
import { generateAssessmentReport } from '../../services/pdfService';

export default function Topbar() {
  const {
    searchAndSetLocation,
    searchNotification,
    userLocation,
    locationLoading,
    locationError,
    detectUserLocation,
    simulationData,
  } = useDisaster();

  const { currentLang, setLanguage, availableLanguages, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const quickSuggestions = [
    { label: "Wayanad, Kerala", query: "wayanad", tag: "Landslide Hub" },
    { label: "Joshimath, Uttarakhand", query: "joshimath", tag: "Subsidence Core" },
    { label: "Visakhapatnam, AP", query: "visakhapatnam", tag: "Cyclone Lowlands" },
    { label: "Repalle, Bapatla AP", query: "repalle", tag: "Coastal Floodplain" },
    { label: "Mandi, HP", query: "mandi", tag: "Cloudburst Flood" },
    { label: "Shimla, HP", query: "shimla", tag: "Ridge Hazard" },
    { label: "Mumbai, Maharashtra", query: "mumbai", tag: "Coastal Flood" },
    { label: "Darjeeling, WB", query: "darjeeling", tag: "Escarpment" },
    { label: "Munnar, Kerala", query: "munnar", tag: "Ghats Sector" },
  ];

  const filteredSuggestions = searchQuery.trim()
    ? quickSuggestions.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.query.includes(searchQuery.toLowerCase()))
    : quickSuggestions;

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsDropdownOpen(false);
    await searchAndSetLocation(searchQuery);
  };

  const handleSelectSuggestion = async (query) => {
    setSearchQuery('');
    setIsDropdownOpen(false);
    await searchAndSetLocation(query);
  };

  const handleDetectGPS = async () => {
    setIsDropdownOpen(false);
    await detectUserLocation();
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-2.5 flex items-center justify-between gap-4 flex-shrink-0 z-20 relative shadow-md">
      
      {/* Left: Incident Area & 1-Click SOS Action */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold shadow-inner">
          <MapPin className="h-4 w-4 text-amber-400" />
          <span className="text-slate-400">Incident Area:</span>
          <span className="text-white font-black">{simulationData?.region?.name || 'Wayanad, Kerala'}</span>
        </div>

        {/* 1-Click SOS Emergency Button (Immediate GPS Safe Shelter Routing) */}
        <button
          onClick={handleDetectGPS}
          disabled={locationLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-md shadow-red-600/30 transition-all active:scale-95"
        >
          {locationLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Zap className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
          )}
          <span>🚨 SOS: Nearest Shelter</span>
        </button>

        {userLocation && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-[11px] font-mono text-emerald-300">
            <LocateFixed className="h-3.5 w-3.5 text-emerald-400" />
            <span>GPS Active (±{userLocation.accuracy}m)</span>
          </div>
        )}

        {locationError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-800">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate max-w-[180px]">{locationError}</span>
          </div>
        )}
      </div>

      {/* Center: Live Action Feedback Notification */}
      {searchNotification && (
        <div className="absolute left-1/2 -translate-x-1/2 top-14 z-[2000] bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{searchNotification}</span>
        </div>
      )}

      {/* Right Controls: Unified Search with 1st Option "Detect Current Location", Language, Export */}
      <div className="flex items-center gap-3">
        
        {/* Dynamic Location Search Form with GPS Option on Top of Dropdown */}
        <div ref={searchContainerRef} className="relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder="Search city, ward, or coordinates..."
              className="bg-slate-800 hover:bg-slate-750 focus:bg-slate-900 border-2 border-slate-700 focus:border-red-500 rounded-xl pl-9 pr-8 py-1.5 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none w-72 sm:w-80 shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Suggestions Popup with GPS Option as #1 Top Item */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[3000] text-xs py-2">
              
              {/* TOP ITEM: 📍 Use Current GPS Location */}
              <button
                type="button"
                onClick={handleDetectGPS}
                className="w-full px-3.5 py-2.5 text-left bg-blue-950/60 hover:bg-blue-900/80 border-b border-slate-800 flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {locationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  ) : (
                    <LocateFixed className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  )}
                  <div>
                    <span className="font-black text-blue-300 block text-xs">📍 {t('detectLocation')}</span>
                    <span className="text-[10px] text-slate-400">Use live device GPS coordinates</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900 text-blue-200 font-bold border border-blue-700">
                  GPS Auto
                </span>
              </button>

              <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                <span>Suggested Jurisdictions</span>
                <span className="text-red-400">Press Enter ↵</span>
              </div>

              <div className="max-h-56 overflow-y-auto">
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.query)}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 group-hover:text-amber-300" />
                      <span className="font-bold text-slate-200 group-hover:text-white">{item.label}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 🌐 Multilingual Language Switcher Dropdown */}
        <div className="flex items-center bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-inner gap-1.5">
          <Globe className="h-4 w-4 text-blue-400 flex-shrink-0" />
          <select
            value={currentLang}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1 text-xs"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Export Report Action */}
        <button
          onClick={() => generateAssessmentReport(simulationData)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-md shadow-red-600/30 transition-all active:scale-95 flex-shrink-0"
        >
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline">{t('exportPdf')}</span>
          <span className="sm:hidden">PDF</span>
        </button>

      </div>

    </header>
  );
}
