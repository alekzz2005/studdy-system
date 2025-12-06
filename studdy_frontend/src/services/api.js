import axios from 'axios';

// Use proxy in development, direct URL in production
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api'  // This will be proxied to http://localhost:8080/api
  : 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  }
};

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (userData) => api.put('/api/users/profile', userData),
};

export const fetchLandingPageStats = async () => {
  try {
    const response = await api.get('/api/landing-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching landing page stats:', error);
    throw error;
  }
};

export default api;