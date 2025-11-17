import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Extended color palette for more dispositions
const COLORS = [
  '#9333ea', // Purple - No Answer
  '#3b82f6', // Blue - Unknown
  '#64748b', // Gray - Not Interested
  '#eab308', // Yellow - Connected - Negative
  '#1e40af', // Dark Blue - Connect Incomplete
  '#22c55e', // Green - Wrong Number
  '#f59e0b', // Orange - Gatekeeper
  '#dc2626', // Red - Bad / Wrong Number
  '#06b6d4', // Cyan - Meeting Scheduled
  '#94a3b8', // Light Gray - Connected - Neutral
  '#ca8a04', // Dark Yellow - Nurture
  '#a855f7', // Light Purple - Not Me
  '#16a34a', // Dark Green - Connected - Positive
  '#ea580c', // Dark Orange - DNC
  '#84cc16', // Light Green - Activated Lead
  '#d97706', // Light Brown - Not Now
  '#475569', // Dark Gray - No Longer with Company
  '#cbd5e1', // Very Light Gray - Left Voicemail
];

export default function DispositionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-xl h-full flex items-center justify-center">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map((item, index) => ({
    name: item.name,
    value: parseFloat(item.percentage),
    count: item.value,
    percentage: item.percentage,
  }));

  // Get the largest segment for highlighting
  const maxSegment = chartData.reduce((max, item) => 
    item.value > max.value ? item : max, chartData[0]
  );

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-xl">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Disposition Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={1}
            dataKey="value"
            label={({ name, value }) => {
              // Only show label for segments > 5%
              if (value > 5) {
                return `${value.toFixed(2)}%`;
              }
              return '';
            }}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke={entry.name === maxSegment.name ? '#fff' : 'none'}
                strokeWidth={entry.name === maxSegment.name ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [
              `${value.toFixed(2)}% (${props.payload.count} calls)`,
              props.payload.name
            ]}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
              padding: '8px 12px'
            }}
          />
          <Legend 
            formatter={(value, entry) => {
              const percentage = entry.payload.percentage || '0.00';
              return `${value}: ${percentage}%`;
            }}
            wrapperStyle={{ 
              color: '#cbd5e1', 
              fontSize: '11px',
              paddingTop: '20px'
            }}
            iconType="circle"
            layout="vertical"
            verticalAlign="bottom"
            align="left"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

