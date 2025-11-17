import React from 'react';

export default function SalesRepPerformance({ repMetrics, durationLabel }) {
  if (!repMetrics || repMetrics.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Sales Rep Performance</h2>
        <p className="text-slate-400">No rep data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-xl">
      <h2 className="text-2xl font-semibold text-slate-100 mb-6">Sales Rep Performance</h2>
      <div className="space-y-6">
        {repMetrics.map((rep, index) => (
          <div
            key={rep.repName}
            className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30 hover:border-slate-600/50 transition-all shadow-lg"
          >
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-700/50">
              <h3 className="text-xl font-semibold text-slate-200">{rep.repName}</h3>
              <span className="text-sm text-slate-400">Active for {rep.uniqueDays} day{rep.uniqueDays !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-5">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Total Calls</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {rep.totalCalls.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Calls/Day</p>
                <p className="text-3xl font-bold text-blue-400">{rep.callsPerDay}</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Calls/Week</p>
                <p className="text-3xl font-bold text-blue-400">{rep.callsPerWeek}</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Connect Rate</p>
                <p className="text-3xl font-bold text-green-400">{rep.connectRate}%</p>
                <p className="text-xs text-slate-500 mt-1">Excl. Gatekeeper, Voicemail, No Answer</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Gatekeeper Rate</p>
                <p className="text-3xl font-bold text-purple-400">{rep.gatekeeperRate}%</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Meetings Scheduled</p>
                <p className="text-3xl font-bold text-cyan-400">{rep.meetingsScheduled}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-700/30">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-slate-400">Conversion % (Connect → Meeting Scheduled)</span>
                  <p className="text-xs text-slate-500 mt-1">Meetings / Connects × 100</p>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  {rep.conversionRate}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

