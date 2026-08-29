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
  Navigation,
  Compass,
  Flame,
  Waves,
  Mountain,
  Radio
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { useLanguage } from '../../context/LanguageContext';
import { generateAssessmentReport } from '../../services/pdfService';

// Comprehensive Indian & Global Disaster-Prone Locations Database with Hazard Tags & Exact Coords
const SPATIAL_DIRECTORY = [
  // Kerala & Western Ghats Sector
  { label: "Wayanad (Meppadi Basin), Kerala", query: "wayanad", tag: "Landslide Core", state: "Kerala", lat: 11.5325, lon: 76.1362, hazard: "Landslide" },
  { label: "Chooralmala Escarpment, Wayanad", query: "chooralmala", tag: "Debris Flow", state: "Kerala", lat: 11.5380, lon: 76.1350, hazard: "Debris Flow" },
  { label: "Mundakkai Valley, Wayanad", query: "mundakkai", tag: "Flash Inundation", state: "Kerala", lat: 11.5320, lon: 76.1450, hazard: "Flash Flood" },
  { label: "Punchirimattam Ridge, Wayanad", query: "punchirimattam", tag: "Ridge Subsidence", state: "Kerala", lat: 11.5460, lon: 76.1320, hazard: "Landslide" },
  { label: "Attamala Hill Settlement, Wayanad", query: "attamala", tag: "Hill Cutoff", state: "Kerala", lat: 11.5180, lon: 76.1550, hazard: "Landslide" },
  { label: "Munnar Tea Highlands, Kerala", query: "munnar", tag: "Ghats Slope", state: "Kerala", lat: 10.0889, lon: 77.0595, hazard: "Landslide" },
  { label: "Idukki Reservoir Catchment, Kerala", query: "idukki", tag: "Dam Spillway", state: "Kerala", lat: 9.8494, lon: 76.9723, hazard: "Flash Flood" },
  { label: "Kochi Coastal Lowlands, Kerala", query: "kochi", tag: "Tidal Inundation", state: "Kerala", lat: 9.9312, lon: 76.2673, hazard: "Coastal Flood" },
  
  // Himalayan Sector (Uttarakhand & HP)
  { label: "Joshimath Urban Core, Uttarakhand", query: "joshimath", tag: "Slope Subsidence", state: "Uttarakhand", lat: 30.5560, lon: 79.5670, hazard: "Subsidence" },
  { label: "Manohar Bagh Settlement, Joshimath", query: "manohar bagh", tag: "Fissure Zone", state: "Uttarakhand", lat: 30.5610, lon: 79.5670, hazard: "Subsidence" },
  { label: "Sunil Village Ward 7, Joshimath", query: "sunil", tag: "Toe Erosion", state: "Uttarakhand", lat: 30.5650, lon: 79.5630, hazard: "Subsidence" },
  { label: "Kedarnath Mandakini Basin, Uttarakhand", query: "kedarnath", tag: "Glacial Outburst", state: "Uttarakhand", lat: 30.7346, lon: 79.0669, hazard: "GLOF" },
  { label: "Badrinath Alaknanda Gorge, Uttarakhand", query: "badrinath", tag: "Avalanche Risk", state: "Uttarakhand", lat: 30.7433, lon: 79.4938, hazard: "Avalanche" },
  { label: "Rishikesh Ganga Floodplain, Uttarakhand", query: "rishikesh", tag: "Riverine Surge", state: "Uttarakhand", lat: 30.0869, lon: 78.2676, hazard: "Flood" },
  { label: "Mandi (Beas River Gorge), HP", query: "mandi", tag: "Cloudburst Flood", state: "Himachal Pradesh", lat: 31.7080, lon: 76.9320, hazard: "Cloudburst" },
  { label: "Shimla Ridge Sector, HP", query: "shimla", tag: "Escarpment Slump", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734, hazard: "Landslide" },
  { label: "Manali Beas Headwaters, HP", query: "manali", tag: "Flash Flood", state: "Himachal Pradesh", lat: 32.2432, lon: 77.1892, hazard: "Cloudburst" },
  { label: "Dharamshala Kangra Fault, HP", query: "dharamshala", tag: "Seismic Slope", state: "Himachal Pradesh", lat: 32.2190, lon: 76.3234, hazard: "Seismic" },
  
  // Andhra Pradesh & Coastal Lowlands Sector
  { label: "Visakhapatnam Coastal Sector, AP", query: "visakhapatnam", tag: "Cyclone Surge", state: "Andhra Pradesh", lat: 17.7200, lon: 83.3100, hazard: "Storm Surge" },
  { label: "Jalaripeta Fishermen Colony, Vizag", query: "jalaripeta", tag: "Tidal Front", state: "Andhra Pradesh", lat: 17.7150, lon: 83.3220, hazard: "Storm Surge" },
  { label: "Kailasagiri Foothill Slopes, Vizag", query: "kailasagiri", tag: "Hillside Slip", state: "Andhra Pradesh", lat: 17.7450, lon: 83.3380, hazard: "Landslide" },
  { label: "Repalle Coastal Floodplain, Bapatla AP", query: "repalle", tag: "Krishna Delta Flood", state: "Andhra Pradesh", lat: 16.0200, lon: 80.8500, hazard: "Flood" },
  { label: "Bapatla Coastal Lowlands, AP", query: "bapatla", tag: "Tidal Inflow", state: "Andhra Pradesh", lat: 15.9040, lon: 80.4670, hazard: "Flood" },
  { label: "Guntur Urban Catchment, AP", query: "guntur", tag: "Urban Inundation", state: "Andhra Pradesh", lat: 16.3060, lon: 80.4360, hazard: "Flood" },
  { label: "Vijayawada Krishna Basin, AP", query: "vijayawada", tag: "Prakasam Spillway", state: "Andhra Pradesh", lat: 16.5060, lon: 80.6480, hazard: "Flood" },
  { label: "Machilipatnam Coastal Estuary, AP", query: "machilipatnam", tag: "Storm Surge", state: "Andhra Pradesh", lat: 16.1875, lon: 81.1389, hazard: "Storm Surge" },
  { label: "Tirupati Seshachalam Foothills, AP", query: "tirupati", tag: "Ghats Flash Flood", state: "Andhra Pradesh", lat: 13.6288, lon: 79.4192, hazard: "Flash Flood" },

  // Metro & Major Regional Hubs
  { label: "Mumbai Mithi River Basin, Maharashtra", query: "mumbai", tag: "Coastal Inundation", state: "Maharashtra", lat: 19.0760, lon: 72.8777, hazard: "Urban Flood" },
  { label: "Pune Mutha Catchment, Maharashtra", query: "pune", tag: "Dam Discharge", state: "Maharashtra", lat: 18.5204, lon: 73.8567, hazard: "Flood" },
  { label: "Darjeeling Hill Tracts, West Bengal", query: "darjeeling", tag: "Active Escarpment", state: "West Bengal", lat: 27.0410, lon: 88.2663, hazard: "Landslide" },
  { label: "Kolkata Hooghly Tidal Basin, WB", query: "kolkata", tag: "Delta Surge", state: "West Bengal", lat: 22.5726, lon: 88.3639, hazard: "Coastal Flood" },
  { label: "Guwahati Brahmaputra Basin, Assam", query: "guwahati", tag: "River Floodplain", state: "Assam", lat: 26.1445, lon: 91.7362, hazard: "River Flood" },
  { label: "Silchar Barak Valley, Assam", query: "silchar", tag: "Severe Inundation", state: "Assam", lat: 24.8170, lon: 92.7937, hazard: "Flood" },
  { label: "Delhi Yamuna Floodplain, NCR", query: "delhi", tag: "Hathnikund Surge", state: "Delhi NCR", lat: 28.6139, lon: 77.2090, hazard: "Flood" },
  { label: "Hyderabad Musi Catchment, Telangana", query: "hyderabad", tag: "Urban Lowlands", state: "Telangana", lat: 17.3850, lon: 78.4867, hazard: "Urban Flood" },
  { label: "Chennai Adyar Coastal Basin, TN", query: "chennai", tag: "Northeast Monsoon", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, hazard: "Storm Surge" },
  { label: "Bengaluru Bellandur Catchment, KA", query: "bengaluru", tag: "Lake Overflow", state: "Karnataka", lat: 12.9716, lon: 77.5946, hazard: "Urban Inundation" },
  { label: "Ooty (Nilgiris Hill Sector), TN", query: "ooty", tag: "Highland Slip", state: "Tamil Nadu", lat: 11.4100, lon: 76.6950, hazard: "Landslide" },
];

// Haversine Distance in Kilometers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export default function Topbar() {
  const {
    searchAndSetLocation,
    searchNotification,
    userLocation,
    liveLocation,
    isLiveTracking,
    toggleLiveTracking,
    locationLoading,
    locationError,
    detectUserLocation,
    simulationData,
  } = useDisaster();

  const { currentLang, setLanguage, availableLanguages, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dynamicOsmResults, setDynamicOsmResults] = useState([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const searchContainerRef = useRef(null);

  // Compute Distance & Sort by Proximity to User GPS
  const processedSuggestions = SPATIAL_DIRECTORY.map(item => {
    let distance = null;
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      distance = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        item.lat,
        item.lon
      );
    }
    return { ...item, distance };
  });

  // Filter & Sort: Nearer results first if GPS is active
  const filteredSuggestions = searchQuery.trim()
    ? processedSuggestions
        .filter(s =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
          return 0;
        })
    : processedSuggestions.sort((a, b) => {
        if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
        return 0;
      });

  // Live OpenStreetMap Geocoding for any custom queries
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setDynamicOsmResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (filteredSuggestions.length < 3 && navigator.onLine) {
        setIsSearchingOnline(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=3`);
          const data = await res.json();
          if (Array.isArray(data)) {
            const formatted = data.map(d => {
              const lat = parseFloat(d.lat);
              const lon = parseFloat(d.lon);
              let distance = null;
              if (userLocation) {
                distance = calculateDistanceKm(userLocation.latitude, userLocation.longitude, lat, lon);
              }
              return {
                label: d.display_name.split(',').slice(0, 3).join(','),
                query: `${lat},${lon}`,
                tag: "Global Location",
                state: "Live Geocoded",
                lat,
                lon,
                distance
              };
            });
            setDynamicOsmResults(formatted);
          }
        } catch (e) {
          // ignore geocode network errors
        } finally {
          setIsSearchingOnline(false);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, userLocation]);

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
    <header className="bg-slate-900 border-b border-slate-800 text-white px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-3 flex-shrink-0 z-[5000] relative shadow-md overflow-visible">
      
      {/* Left: Incident Area & 1-Click SOS Action */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold shadow-inner">
          <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <span className="text-slate-400 hidden sm:inline">Incident Area:</span>
          <span className="text-white font-black truncate max-w-[130px] sm:max-w-[200px]">
            {simulationData?.region?.name || 'Wayanad, Kerala'}
          </span>
        </div>

        {/* 1-Click SOS Emergency Button */}
        <button
          onClick={handleDetectGPS}
          disabled={locationLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-md shadow-red-600/30 transition-all active:scale-95 flex-shrink-0"
        >
          {locationLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Zap className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
          )}
          <span>🚨 SOS: Nearest Shelter</span>
        </button>

        {userLocation && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-[11px] font-mono text-emerald-300 flex-shrink-0">
            <LocateFixed className="h-3.5 w-3.5 text-emerald-400" />
            <span>GPS Active (±{userLocation.accuracy}m)</span>
          </div>
        )}
      </div>

      {/* Center: Live Action Feedback Notification */}
      {searchNotification && (
        <div className="absolute left-1/2 -translate-x-1/2 top-14 z-[2000] bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{searchNotification}</span>
        </div>
      )}

      {/* Right Controls: Unified Intelligent Search with GPS Autocomplete */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Dynamic Location Search Form with Direct GPS Button inside */}
        <div ref={searchContainerRef} className="relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder={userLocation ? "Search near your GPS..." : "Search city, hazard, or coordinates..."}
              className="bg-slate-800 hover:bg-slate-750 focus:bg-slate-900 border-2 border-slate-700 focus:border-red-500 rounded-xl pl-9 pr-14 py-1.5 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none w-44 sm:w-60 lg:w-72 focus:w-80 shadow-inner transition-all"
            />

            {/* Direct GPS Button inside Search Bar */}
            <button
              type="button"
              onClick={handleDetectGPS}
              title="Auto-Detect My GPS Location"
              className="absolute right-7 top-1/2 -translate-y-1/2 p-1 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/60 transition-all"
            >
              <LocateFixed className={`h-3.5 w-3.5 ${locationLoading ? 'animate-spin' : ''}`} />
            </button>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Suggestions Popup with Live Distance & GPS Sorting */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 w-[310px] sm:w-[420px] mt-2 bg-slate-900/98 backdrop-blur-xl border-2 border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[9999] text-xs py-2">
              
              {/* TOP ITEM: 📍 Use Current GPS Location */}
              <button
                type="button"
                onClick={handleDetectGPS}
                className="w-full px-3.5 py-2.5 text-left bg-emerald-950/70 hover:bg-emerald-900/90 border-b border-slate-800 flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {locationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  ) : (
                    <LocateFixed className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  )}
                  <div>
                    <span className="font-black text-emerald-300 block text-xs">📍 Use My Live GPS Coordinates</span>
                    <span className="text-[10px] text-slate-400">
                      {userLocation ? `Active (Lat: ${userLocation.latitude.toFixed(3)}°, Lon: ${userLocation.longitude.toFixed(3)}°)` : 'Detect device location & calculate nearest hazards'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 font-bold border border-emerald-700">
                  GPS Auto
                </span>
              </button>

              <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                <span>{userLocation ? "⚡ Sorted by Nearest to Your GPS" : "Suggested Incident Hotspots"}</span>
                <span className="text-red-400">{filteredSuggestions.length} Found</span>
              </div>

              {/* Suggestions List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                {filteredSuggestions.slice(0, 8).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.query)}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 group-hover:text-amber-300 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-200 group-hover:text-white block truncate">{item.label}</span>
                        <span className="text-[10px] text-slate-400">{item.state} • {item.hazard || 'Risk Zone'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {item.distance !== null && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono font-bold border border-emerald-800">
                          {item.distance} km
                        </span>
                      )}
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-semibold">
                        {item.tag}
                      </span>
                    </div>
                  </button>
                ))}

                {/* Dynamic Online Geocoded Results */}
                {dynamicOsmResults.map((item, idx) => (
                  <button
                    key={`osm-${idx}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.query)}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 bg-blue-950/30 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Navigation className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-blue-200 group-hover:text-white block truncate">{item.label}</span>
                        <span className="text-[10px] text-slate-400">Live Global Geocoded Coordinates</span>
                      </div>
                    </div>

                    {item.distance !== null && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-mono font-bold border border-blue-800 flex-shrink-0">
                        {item.distance} km
                      </span>
                    )}
                  </button>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* Continuous Live GPS Tracker Toggle Button */}
        <button
          type="button"
          onClick={toggleLiveTracking}
          title={isLiveTracking ? "Live GPS Active (Click to Pause)" : "Start Continuous Live GPS Tracking"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all active:scale-95 flex-shrink-0 ${
            isLiveTracking
              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <Radio className={`h-3.5 w-3.5 ${isLiveTracking ? 'text-slate-950 animate-pulse' : 'text-cyan-400'}`} />
          <span className="hidden md:inline">{isLiveTracking ? 'Live GPS: ON' : 'Live GPS'}</span>
          <span className="md:hidden">{isLiveTracking ? 'GPS ON' : 'GPS'}</span>
        </button>

        {/* 🌐 Multilingual Language Switcher Dropdown */}
        <div className="flex items-center bg-slate-950 border border-slate-800 px-2 py-1.5 rounded-xl text-xs font-bold shadow-inner gap-1 flex-shrink-0">
          <Globe className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-md shadow-red-600/30 transition-all active:scale-95 flex-shrink-0 whitespace-nowrap mr-1"
        >
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline">{t('exportPdf')}</span>
          <span className="sm:hidden">PDF</span>
        </button>

      </div>

    </header>
  );
}
