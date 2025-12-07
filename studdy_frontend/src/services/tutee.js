// services/tutee.js
import api from './auth.js';

export const tuteeService = {
  // Get tutee by userId
  getTuteeByUserId: async (userId) => {
    const response = await api.get(`/api/tutees/user/${userId}`);
    return response.data;
  },
  
  // Get tutee by ID
  getTuteeById: async (tuteeId) => {
    const response = await api.get(`/api/tutees/get/${tuteeId}`);
    return response.data;
  },
  
  // Create tutee
  createTutee: async (tuteeData) => {
    const response = await api.post('/api/tutees/create', tuteeData);
    return response.data;
  },
  
  // Get tutee sessions
  getTuteeSessions: async (tuteeId) => {
    const response = await api.get(`/api/tutees/sessions/${tuteeId}`);
    return response.data;
  }
};