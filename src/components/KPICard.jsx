import React from 'react';

export default function KPICard({ title, metrics }) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-xl">
      <h3 className="text-lg font-semibold text-slate-100 mb-5">{title}</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
          <span className="text-slate-400 text-sm">Connect Rate</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
            {metrics.connectRate}%
          </span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
          <span className="text-slate-400 text-sm">Gatekeeper Rate</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
            {metrics.gatekeeperRate}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Conversion % (Connect → Meeting Scheduled)</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
            {metrics.conversionRate}%
          </span>
        </div>
      </div>
    </div>
  );
}

