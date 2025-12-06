import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
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

export const sessionService = {
  // Book a new session
  bookSession: async (sessionData) => {
    try {
      console.log('Sending session data:', sessionData);
      const response = await api.post('/sessions', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error booking session:', error);
      throw error;
    }
  },

  // Get all upcoming sessions for current user
  getUpcomingSessions: async () => {
    try {
      const response = await api.get('/sessions/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      // Return mock data for development
      return getMockUpcomingSessions();
    }
  },

  // Get session history
  getSessionHistory: async () => {
    try {
      const response = await api.get('/sessions/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching session history:', error);
      return getMockSessionHistory();
    }
  },

  // Cancel a session
  cancelSession: async (sessionId) => {
    try {
      const response = await api.put(`/sessions/${sessionId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling session:', error);
      throw error;
    }
  },

  // Reschedule a session
  rescheduleSession: async (sessionId, newDate, newTime) => {
    try {
      const response = await api.put(`/sessions/${sessionId}/reschedule`, {
        newDate,
        newTime
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling session:', error);
      throw error;
    }
  },

  // Get available slots for a tutor on a specific date
  getAvailableSlots: async (tutorId, date) => {
    try {
      const response = await api.get(`/sessions/tutors/${tutorId}/availability`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Return mock slots for development
      return getMockAvailableSlots();
    }
  }
};

// Mock data for development (remove when backend is ready)
const getMockUpcomingSessions = () => {
  return [
    {
      sessionId: 1,
      subject: { name: 'Mathematics' },
      tutor: { name: 'Alexander Binagatan' },
      sessionDate: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      status: 'SCHEDULED'
    },
    {
      sessionId: 2,
      subject: { name: 'Physics' },
      tutor: { name: 'Charry Mae Atamosa' },
      sessionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      startTime: '10:00',
      endTime: '11:30',
      status: 'CONFIRMED'
    }
  ];
};

const getMockSessionHistory = () => {
  return [
    {
      sessionId: 3,
      subject: { name: 'Chemistry' },
      tutor: { name: 'John Anthony' },
      sessionDate: '2024-11-15',
      startTime: '16:00',
      endTime: '17:00',
      status: 'COMPLETED',
      rating: 4.8,
      feedback: 'Great session, very helpful!'
    }
  ];
};

const getMockAvailableSlots = () => {
  return [
    { startTime: '09:00', endTime: '10:00', available: true },
    { startTime: '10:30', endTime: '11:30', available: true },
    { startTime: '14:00', endTime: '15:00', available: true },
    { startTime: '15:30', endTime: '16:30', available: false },
    { startTime: '17:00', endTime: '18:00', available: true }
  ];
};