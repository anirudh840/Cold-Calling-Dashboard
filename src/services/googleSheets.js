import axios from 'axios';

// API base URL - use environment variable or default to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Fetches data from Google Sheets via backend API
 */
export async function fetchSheetData() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sheet-data`);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error || 'Failed to fetch data from API');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    
    // Provide more helpful error messages
    if (error.response) {
      if (error.response.status === 500) {
        throw new Error('Server error. Please check if the backend is running.');
      } else if (error.response.status === 404) {
        throw new Error('API endpoint not found. Please check the API URL.');
      }
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to backend server. Please ensure the API is running.');
    }
    
    throw new Error(error.message || 'Failed to fetch data from API');
  }
}


