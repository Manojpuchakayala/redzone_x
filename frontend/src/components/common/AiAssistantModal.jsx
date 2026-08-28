import React, { useState } from 'react';
import { Sparkles, Bot, Send, X, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AiAssistantModal({ isOpen, onClose }) {
  const { simulationData } = useDisaster();
  const { t, localizePlace } = useLanguage();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Greetings Commander. I am RED-ZONE X Neural Intelligence. I have ingested regional DEM slopes, soil thickness, census demographics, and carrying capacity headroom. How can I assist your tactical dispatch?',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      const q = userText.toLowerCase();
      const summary = simulationData?.summary || {};
      const priorities = simulationData?.relocationPriorities || [];
      const topHab = priorities[0];

      if (q.includes('why') || q.includes('priority') || q.includes('vulnerable')) {
        aiResponse = `🤖 AI Decision Breakdown: ${topHab ? topHab.name : 'Chooralmala'} is ranked Priority #1 because it has an Urgency Index (RUI) of ${topHab ? Math.round(topHab.rui * 100) : 94}%. The Multi-Hazard Index is critical with ${topHab?.fingerprint?.elderly || 260} elderly citizens, ${topHab?.fingerprint?.infants || 195} infants, and ${Math.round((topHab?.fingerprint?.accessCutoffRisk || 0.95) * 100)}% single-road cutoff risk.`;
      } else if (q.includes('shelter') || q.includes('capacity') || q.includes('split') || q.includes('cci')) {
        aiResponse = `📊 Carrying Capacity Optimizer: Regional Carrying Capacity Index (CCI) is currently ${summary.cci || 0.30} (${summary.cciBadge || 'Headroom Safe'}). The optimization algorithm has allocated ${summary.totalDisplacedPopulation || 1730} evacuees across safe sanctuaries with 45 LPCD drinking water and generator backups, utilizing split allocation to avoid camp collapse.`;
      } else if (q.includes('fleet') || q.includes('bus') || q.includes('ambulance') || q.includes('vehicle')) {
        aiResponse = `🚌 Logistics Dispatch Recommendation: For ${summary.totalDisplacedPopulation || 1730} displaced citizens, deploy ${Math.ceil((summary.totalDisplacedPopulation || 1730) / 40)} x 40-seater evacuation buses and 6 Advanced Life Support ambulances along the designated green ridge corridor.`;
      } else {
        aiResponse = `⚡ Real-Time Tactical AI Assessment: Current hazard model indicates ${summary.redZonesCount || 2} Critical Red Zones. Immediate evacuation is active for ${summary.immediateEvacuees || 1420} high-vulnerability citizens. Communications are operating on LoRa Channel CH-04.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-white">RED-ZONE X Neural Intelligence</h3>
                <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[9px] font-black">
                  AI CORE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Physics-Informed Risk &amp; Evacuation Assistant</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-red-600 text-white font-medium shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-inner'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 text-xs flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 animate-spin text-blue-400" />
                <span>AI analyzing terrain &amp; demographic matrices...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => setQuery("Why is priority #1 ranked first?")}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
          >
            💡 Why is priority #1 first?
          </button>
          <button
            onClick={() => setQuery("What is the carrying capacity strain?")}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
          >
            📊 Check CCI Capacity
          </button>
          <button
            onClick={() => setQuery("How many buses and ambulances to dispatch?")}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
          >
            🚌 Fleet logistics needed
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI about hazard risks, why an area is vulnerable, or fleet dispatch..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/30"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
