import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const summarizeURL = async (url) => {
  try {
    const response = await axios.post(`${API_URL}/api/summarize`, { url });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to summarize URL');
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please make sure the backend is running.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};
