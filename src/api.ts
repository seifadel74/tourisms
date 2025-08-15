import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // إذا استخدمت Sanctum/Cookie اجعلها true
});

// Attach token automatically
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    // Log the error for debugging
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;