import api from './auth.js';

export const sessionService = {
  // CREATE
  createSession: async (sessionData) => {
    const response = await api.post('/api/sessions', sessionData);
    return response.data;
  },

  // READ - Get by ID
  getSessionById: async (id) => {
    const response = await api.get(`/api/sessions/get/${id}`);
    return response.data;
  },

  // READ - Get all
  getAllSessions: async () => {
    const response = await api.get('/api/sessions');
    return response.data;
  },

  // READ - Get by tutor
  getSessionsByTutor: async (tutorId) => {
    const response = await api.get(`/api/sessions/tutor/${tutorId}`);
    return response.data;
  },

  // READ - Get by tutee
  getSessionsByTutee: async (tuteeId) => {
    const response = await api.get(`/api/sessions/tutee/${tuteeId}`);
    return response.data;
  },

  // READ - Get by status
  getSessionsByStatus: async (status) => {
    const response = await api.get(`/api/sessions/status/${status}`);
    return response.data;
  },

  // READ - Get by date
  getSessionsByDate: async (year, month, day) => {
    const response = await api.get(`/api/sessions/date/${year}/${month}/${day}`);
    return response.data;
  },

  // READ - Get by month
  getSessionsByMonth: async (year, month) => {
    const response = await api.get(`/api/sessions/month/${year}/${month}`);
    return response.data;
  },

  // UPDATE
  updateSession: async (id, sessionData) => {
    const response = await api.put(`/api/sessions/update/${id}`, sessionData);
    return response.data;
  },

  // UPDATE status only
  updateSessionStatus: async (id, status) => {
    const response = await api.patch(`/api/sessions/status/${id}`, { status });
    return response.data;
  },

  // UPDATE rating
  addSessionRating: async (id, rating, feedback) => {
    const response = await api.patch(`/api/sessions/rating/${id}`, { rating, feedback });
    return response.data;
  },

  // DELETE
  deleteSession: async (id) => {
    const response = await api.delete(`/api/sessions/delete/${id}`);
    return response.data;
  }
};