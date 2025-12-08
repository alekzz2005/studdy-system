import api from './auth.js';

export const tutorService = {
  // Get tutor by userId
  getTutorByUserId: async (userId) => {
    const response = await api.get(`/api/tutors/user/${userId}`);
    return response.data;
  },
  
  // Update tutor (NEW METHOD)
  updateTutor: async (tutorId, tutorData) => {
    const response = await api.put(`/api/tutors/update/${tutorId}`, tutorData);
    return response.data;
  },
  
  // Other tutor methods if needed
  createTutor: async (tutorData) => {
    const response = await api.post('/api/tutors/create', tutorData);
    return response.data;
  },
  
  getTutorById: async (tutorId) => {
    const response = await api.get(`/api/tutors/get/${tutorId}`);
    return response.data;
  }
};