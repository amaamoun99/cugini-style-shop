import axios from 'axios';

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  withCredentials: true, // only if you're using cookies for auth
});

// Optional: attach token if logged in (e.g. from localStorage or Redux)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or get from Redux
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
