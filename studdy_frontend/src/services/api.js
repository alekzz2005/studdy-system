import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with default configs
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add headers
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.baseURL + config.url);
    console.log('Full URL would be:', 'http://localhost:8080' + config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error Details:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.response) {
      // Server responded with error status
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received. Request details:', error.request);
      console.error('Is backend running on http://localhost:8080?');
    } else {
      // Something else happened
      console.error('Error config:', error.config);
    }
    
    return Promise.reject(error);
  }
);

export const userAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      console.log('Sending user data to /api/postNewUser:', userData);
      const response = await api.post('/api/postNewUser', userData);
      console.log('Registration successful response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration API error details:', error);
      const errorMessage = error.response?.data || error.message || 'Registration failed';
      throw errorMessage;
    }
  },

  // Get all users (for login validation)
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/getAllUsers');
      return response.data;
    } catch (error) {
      console.error('Get users API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/api/updateUser?userId=${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user API error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/api/deleteUser/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Delete user API error:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default api;