const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets configuration
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1OuqXln6GViPNHDdhjUxOJwPhfIv_TFhGP1vVQlFU1PE';

/**
 * Parses CSV data into an array of objects
 */
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }
  
  return data;
}

/**
 * Parses a CSV line, handling quoted fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  return result;
}

/**
 * Fetches data from Google Sheets
 */
async function fetchSheetData() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'text/csv',
      },
    });
    
    if (!response.data || response.data.trim().length === 0) {
      throw new Error('Empty response from Google Sheets');
    }
    
    return parseCSV(response.data);
  } catch (error) {
    console.error('Error fetching sheet data:', error.message);
    throw new Error(`Failed to fetch data from Google Sheets: ${error.message}`);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API endpoint to fetch sheet data
app.get('/api/sheet-data', async (req, res) => {
  try {
    const data = await fetchSheetData();
    res.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch sheet data' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 API endpoint: http://localhost:${PORT}/api/sheet-data`);
});

