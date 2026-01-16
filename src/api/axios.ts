import axios from 'axios';

const envApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const baseURL = envApiUrl.replace(/\/$/, '') + '/api';

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
