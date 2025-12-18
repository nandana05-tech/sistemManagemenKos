import axios from 'axios';
import { useAuthStore } from '../features/auth/authStore';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    // Handle 401 Unauthorized - logout user
    if (response?.status === 401) {
      const authStore = useAuthStore.getState();
      authStore.logout();
      window.location.href = '/login';
    }

    // Format error message
    const errorMessage = response?.data?.message || error.message || 'Terjadi kesalahan';
    
    return Promise.reject({
      status: response?.status,
      message: errorMessage,
      errors: response?.data?.data || null,
    });
  }
);

export default api;
