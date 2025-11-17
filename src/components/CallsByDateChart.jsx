import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CallsByDateChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-xl h-full flex items-center justify-center">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map(item => ({
    date: item.date,
    calls: item.count,
  }));

  // Calculate max value for Y-axis
  const maxValue = Math.max(...chartData.map(d => d.calls));
  const yAxisMax = Math.ceil(maxValue * 1.1);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-xl">
      <h3 className="text-lg font-semibold text-slate-100 mb-2">Calls by Date</h3>
      <p className="text-sm text-slate-400 mb-4">Tasks</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8"
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            axisLine={{ stroke: '#475569' }}
            domain={[0, yAxisMax]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
              padding: '8px 12px'
            }}
            formatter={(value) => [`${value} calls`, 'Calls']}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar 
            dataKey="calls" 
            fill="url(#colorGradient)"
            radius={[6, 6, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

