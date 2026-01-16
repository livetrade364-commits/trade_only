import axios from 'axios';

const envApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// Ensure we don't have double slashes and handle empty env var gracefully
const baseURL = (envApiUrl.endsWith('/') ? envApiUrl.slice(0, -1) : envApiUrl) + '/api';

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
