import axios from 'axios';

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  withCredentials: true, // only if you're using cookies for auth
});

// Attach auth token from localStorage if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Using authToken as in our AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for handling auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token if it's invalid
      localStorage.removeItem('authToken');
      
      // If not on login page already, redirect to login
      if (window.location.pathname !== '/login') {
        // Store the current location to redirect back after login
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
