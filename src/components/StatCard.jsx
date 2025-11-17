import React from 'react';

export default function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-600">
      <h3 className="text-sm font-medium text-slate-400 mb-3">{title}</h3>
      <p className="text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

