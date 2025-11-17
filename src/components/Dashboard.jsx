import React, { useState, useEffect, useMemo } from 'react';
import { fetchSheetData } from '../services/googleSheets';
import { 
  processCallData, 
  calculateMetrics, 
  getDateRange, 
  filterCallsByClient, 
  filterCallsByDateRange 
} from '../utils/dataProcessor';
import KPICard from './KPICard';
import StatCard from './StatCard';
import DispositionChart from './DispositionChart';
import CallsByDateChart from './CallsByDateChart';
import SalesRepPerformance from './SalesRepPerformance';
import Tabs from './Tabs';

const CLIENT_TABS = [
  { label: 'NewCo Capital', value: 'NewCo Capital' },
  { label: 'Baton Market', value: 'Baton Market' },
  { label: 'Kodem Security', value: 'Kodem Security' },
];

const DURATION_TABS = [
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 14 days', value: '14days' },
  { label: 'Last 30 days', value: '30days' },
];

export default function Dashboard() {
  const [allCalls, setAllCalls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState('NewCo Capital');
  const [selectedDuration, setSelectedDuration] = useState('7days');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rawData = await fetchSheetData();
      const processedCalls = processCallData(rawData);
      
      setAllCalls(processedCalls);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please check the Google Sheet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter and calculate metrics based on selected filters
  const metrics = useMemo(() => {
    if (!allCalls) return null;

    // Filter by client
    const clientFiltered = filterCallsByClient(allCalls, selectedClient);
    
    // Filter by date range
    const dateRange = getDateRange(selectedDuration);
    const filteredCalls = filterCallsByDateRange(clientFiltered, dateRange);
    
    // Calculate metrics
    return calculateMetrics(filteredCalls);
  }, [allCalls, selectedClient, selectedDuration]);

  if (loading && !allCalls) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error && !allCalls) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4 text-lg">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const durationLabel = DURATION_TABS.find(t => t.value === selectedDuration)?.label || 'Last 7 days';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {selectedClient}
          </h1>
          <p className="text-slate-400 text-sm">Cold Calling Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 rounded-lg hover:from-slate-600 hover:to-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
          <span className="text-sm text-slate-400">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700/50 rounded-xl text-red-400 backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 space-y-4">
        <Tabs
          label="Client"
          tabs={CLIENT_TABS}
          activeTab={selectedClient}
          onTabChange={setSelectedClient}
        />
        <Tabs
          label="Time Period"
          tabs={DURATION_TABS}
          activeTab={selectedDuration}
          onTabChange={setSelectedDuration}
        />
      </div>

      {/* Overview Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* KPI Card */}
          <div className="lg:col-span-1">
            <KPICard title="Key Performance Indicators" metrics={metrics.kpis} />
          </div>

          {/* Total Stats */}
          <StatCard title={`Total Calls (${durationLabel})`} value={metrics.totals.calls} />
          <StatCard title={`Total Connects (${durationLabel})`} value={metrics.totals.connects} />
          <StatCard title={`Meetings Scheduled (${durationLabel})`} value={metrics.totals.meetings} />
        </div>
      </div>

      {/* Sales Rep Performance Section */}
      <div className="mb-6">
        <SalesRepPerformance repMetrics={metrics.repMetrics} durationLabel={durationLabel} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DispositionChart data={metrics.dispositionDistribution} />
        <CallsByDateChart data={metrics.callsByDate} />
      </div>
    </div>
  );
}

