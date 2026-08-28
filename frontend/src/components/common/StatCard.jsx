import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = 'red', badge }) {
  const colorMap = {
    red: { border: 'border-l-red-500', text: 'text-red-400', badge: 'bg-red-950 text-red-400 border-red-800' },
    amber: { border: 'border-l-amber-500', text: 'text-amber-400', badge: 'bg-amber-950 text-amber-400 border-amber-800' },
    emerald: { border: 'border-l-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
    blue: { border: 'border-l-blue-500', text: 'text-blue-400', badge: 'bg-blue-950 text-blue-400 border-blue-800' },
  };

  const c = colorMap[color] || colorMap.red;

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 border-l-4 ${c.border} shadow-sm`}>
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
        <span>{title}</span>
        {badge ? (
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-black ${c.badge}`}>
            {badge}
          </span>
        ) : (
          Icon && <Icon className={`h-4 w-4 ${c.text}`} />
        )}
      </div>
      <div className="text-2xl lg:text-3xl font-black text-white mt-2 font-sans tracking-tight">
        {value}
      </div>
      {subtext && <div className="text-xs text-slate-500 mt-1 font-medium">{subtext}</div>}
    </div>
  );
}
