import React from 'react';

export default function Tabs({ tabs, activeTab, onTabChange, label }) {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
      )}
      <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
              ${
                activeTab === tab.value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}


