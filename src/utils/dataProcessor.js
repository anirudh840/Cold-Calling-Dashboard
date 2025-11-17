import { getClientFromRepName, getRepsForClient } from './repClientMapping';
import { format, subDays, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';

/**
 * Processes raw sheet data and calculates metrics
 */
export function processCallData(rawData) {
  if (!rawData || rawData.length === 0) return null;

  // Process each call record
  const processedCalls = rawData.map(row => {
    const timestamp = row['Timestamp'] || row['timestamp'] || '';
    const repName = row['Rep Name'] || row['rep name'] || row['RepName'] || '';
    const disposition = row['Disposition'] || row['disposition'] || '';
    const duration = parseFloat(row['Duration (seconds)'] || row['Duration'] || 0);
    
    // Parse timestamp
    let callDate = null;
    if (timestamp) {
      try {
        callDate = parseISO(timestamp);
      } catch (e) {
        // Try alternative date formats
        callDate = new Date(timestamp);
      }
    }
    
    // Get client from rep name
    const client = getClientFromRepName(repName);
    
    // Determine call outcomes
    const isConnect = isConnectDisposition(disposition);
    const isGatekeeper = isGatekeeperDisposition(disposition);
    const isMeetingScheduled = isMeetingScheduledDisposition(disposition);
    
    return {
      timestamp,
      callDate,
      repName: repName.trim(),
      client,
      disposition: disposition.trim(),
      duration,
      isConnect,
      isGatekeeper,
      isMeetingScheduled,
    };
  });

  return processedCalls;
}

/**
 * Gets date range for different duration options
 */
export function getDateRange(duration) {
  const now = new Date();
  const today = startOfDay(now);
  
  switch (duration) {
    case 'yesterday':
      const yesterday = subDays(today, 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
      };
    case '7days':
      return {
        start: startOfDay(subDays(today, 7)),
        end: endOfDay(now),
      };
    case '14days':
      return {
        start: startOfDay(subDays(today, 14)),
        end: endOfDay(now),
      };
    case '30days':
      return {
        start: startOfDay(subDays(today, 30)),
        end: endOfDay(now),
      };
    default:
      return {
        start: startOfDay(subDays(today, 7)),
        end: endOfDay(now),
      };
  }
}

/**
 * Filters calls by client name
 */
export function filterCallsByClient(calls, clientName) {
  if (!clientName || clientName === 'All') return calls;
  
  const repsForClient = getRepsForClient(clientName);
  return calls.filter(call => {
    if (!call.repName) return false;
    return repsForClient.some(rep => call.repName.includes(rep));
  });
}

/**
 * Filters calls by date range
 */
export function filterCallsByDateRange(calls, dateRange) {
  if (!dateRange) return calls;
  
  return calls.filter(call => {
    if (!call.callDate) return false;
    return isWithinInterval(call.callDate, {
      start: dateRange.start,
      end: dateRange.end,
    });
  });
}

/**
 * Calculates all dashboard metrics
 */
export function calculateMetrics(calls) {
  if (!calls || calls.length === 0) {
    return getEmptyMetrics();
  }
  
  // Overall metrics
  const totalCalls = calls.length;
  
  // Connect Rate: Exclude Gatekeeper, Voicemail, No Answer
  const callsExcludingExcluded = calls.filter(c => !isExcludedFromConnectRate(c.disposition));
  const totalConnects = callsExcludingExcluded.length;
  const connectRate = totalCalls > 0 ? (totalConnects / totalCalls) * 100 : 0;
  
  // Gatekeeper Rate
  const totalGatekeepers = calls.filter(c => c.isGatekeeper).length;
  const gatekeeperRate = totalCalls > 0 ? (totalGatekeepers / totalCalls) * 100 : 0;
  
  // Meetings and Conversion
  const totalMeetings = calls.filter(c => c.isMeetingScheduled).length;
  const conversionRate = totalConnects > 0 ? (totalMeetings / totalConnects) * 100 : 0;

  // Rep-specific metrics with detailed stats
  const repMetrics = calculateDetailedRepMetrics(calls);
  
  // Disposition distribution
  const dispositionDistribution = calculateDispositionDistribution(calls);
  
  // Calls by date
  const callsByDate = calculateCallsByDate(calls);

  return {
    kpis: {
      connectRate: connectRate.toFixed(1),
      gatekeeperRate: gatekeeperRate.toFixed(1),
      conversionRate: conversionRate.toFixed(1),
    },
    totals: {
      calls: totalCalls,
      connects: totalConnects,
      meetings: totalMeetings,
    },
    repMetrics,
    dispositionDistribution,
    callsByDate,
  };
}

/**
 * Calculates detailed metrics for each rep
 */
function calculateDetailedRepMetrics(calls) {
  const repMap = {};
  
  calls.forEach(call => {
    if (!call.repName) return;
    
    if (!repMap[call.repName]) {
      repMap[call.repName] = {
        repName: call.repName,
        calls: 0,
        callsExcludingExcluded: 0,
        connects: 0,
        gatekeepers: 0,
        meetings: 0,
        callDates: new Set(),
      };
    }
    
    repMap[call.repName].calls++;
    
    // Track calls excluding Gatekeeper, Voicemail, No Answer
    if (!isExcludedFromConnectRate(call.disposition)) {
      repMap[call.repName].callsExcludingExcluded++;
    }
    
    // Track connects (calls that are not excluded)
    if (!isExcludedFromConnectRate(call.disposition)) {
      repMap[call.repName].connects++;
    }
    
    // Track gatekeepers
    if (call.isGatekeeper) {
      repMap[call.repName].gatekeepers++;
    }
    
    // Track meetings
    if (call.isMeetingScheduled) {
      repMap[call.repName].meetings++;
    }
    
    // Track unique dates for productivity calculation
    if (call.callDate) {
      const dateKey = call.callDate.toISOString().split('T')[0];
      repMap[call.repName].callDates.add(dateKey);
    }
  });
  
  // Convert to array and calculate additional metrics
  return Object.values(repMap).map(rep => {
    const uniqueDays = rep.callDates.size;
    const days = uniqueDays > 0 ? uniqueDays : 1; // Avoid division by zero
    
    // Connect Rate: calls excluding excluded dispositions / total calls * 100
    const connectRate = rep.calls > 0 ? (rep.callsExcludingExcluded / rep.calls) * 100 : 0;
    
    // Gatekeeper Rate: gatekeeper calls / total calls * 100
    const gatekeeperRate = rep.calls > 0 ? (rep.gatekeepers / rep.calls) * 100 : 0;
    
    // Conversion Rate: meetings / connects * 100
    const conversionRate = rep.connects > 0 ? (rep.meetings / rep.connects) * 100 : 0;
    
    // Productivity: calls per day and calls per week
    const callsPerDay = rep.calls / days;
    const callsPerWeek = callsPerDay * 7;
    
    return {
      repName: rep.repName,
      totalCalls: rep.calls,
      callsPerDay: callsPerDay.toFixed(1),
      callsPerWeek: callsPerWeek.toFixed(1),
      connectRate: connectRate.toFixed(1),
      gatekeeperRate: gatekeeperRate.toFixed(1),
      meetingsScheduled: rep.meetings,
      conversionRate: conversionRate.toFixed(1),
      uniqueDays,
    };
  });
}

/**
 * Calculates disposition distribution
 */
function calculateDispositionDistribution(calls) {
  const distribution = {};
  const total = calls.length;
  
  calls.forEach(call => {
    const disposition = call.disposition || 'Unknown';
    distribution[disposition] = (distribution[disposition] || 0) + 1;
  });
  
  // Convert to percentage and format
  return Object.entries(distribution).map(([name, count]) => ({
    name,
    value: count,
    percentage: total > 0 ? ((count / total) * 100).toFixed(2) : 0,
  })).sort((a, b) => b.value - a.value);
}

/**
 * Calculates calls grouped by date
 */
function calculateCallsByDate(calls) {
  const dateMap = new Map();
  
  calls.forEach(call => {
    if (!call.callDate) return;
    
    // Use the date object as key for proper sorting
    const dateKey = call.callDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const displayDate = format(call.callDate, 'MMM dd');
    
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, { date: displayDate, count: 0, sortDate: call.callDate });
    }
    dateMap.get(dateKey).count++;
  });
  
  // Convert to array and sort by date
  return Array.from(dateMap.values())
    .sort((a, b) => a.sortDate - b.sortDate)
    .map(({ date, count }) => ({ date, count }));
}

/**
 * Determines if a disposition should be excluded from Connect Rate calculation
 * Excludes: Gatekeeper, Voicemail, No Answer
 */
function isExcludedFromConnectRate(disposition) {
  if (!disposition) return true;
  const lower = disposition.toLowerCase();
  return lower.includes('gatekeeper') || 
         lower.includes('gate keeper') ||
         lower.includes('voicemail') ||
         lower.includes('voice mail') ||
         lower.includes('no answer') ||
         lower.includes('noanswer');
}

/**
 * Determines if a disposition indicates a connect
 * A connect means we actually spoke with the decision maker
 * Excludes: Gatekeeper, Voicemail, No Answer
 */
function isConnectDisposition(disposition) {
  if (!disposition) return false;
  if (isExcludedFromConnectRate(disposition)) return false;
  
  const lower = disposition.toLowerCase();
  // Positive indicators - any disposition that's not excluded is considered a connect
  // This includes: Connected, Interested, Meeting Scheduled, etc.
  return !lower.includes('not interested') && 
         !lower.includes('wrong number') &&
         !lower.includes('bad number') &&
         !lower.includes('dnc') &&
         !lower.includes('not me');
}

/**
 * Determines if a disposition indicates a gatekeeper
 */
function isGatekeeperDisposition(disposition) {
  if (!disposition) return false;
  const lower = disposition.toLowerCase();
  return lower.includes('gatekeeper') || 
         lower.includes('gate keeper') ||
         lower.includes('receptionist') ||
         lower.includes('assistant');
}

/**
 * Determines if a disposition indicates a meeting was scheduled
 */
function isMeetingScheduledDisposition(disposition) {
  if (!disposition) return false;
  const lower = disposition.toLowerCase();
  return lower.includes('meeting scheduled') || 
         lower.includes('meeting set') ||
         lower.includes('appointment set') ||
         lower.includes('scheduled') ||
         (lower.includes('meeting') && (lower.includes('set') || lower.includes('scheduled')));
}

/**
 * Returns empty metrics structure
 */
function getEmptyMetrics() {
  return {
    kpis: {
      connectRate: '0.0',
      gatekeeperRate: '0.0',
      conversionRate: '0.0',
    },
    totals: {
      calls: 0,
      connects: 0,
      meetings: 0,
    },
    repMetrics: [],
    dispositionDistribution: [],
    callsByDate: [],
  };
}

