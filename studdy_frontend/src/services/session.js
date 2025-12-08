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
    const response = await api.get('/api/sessions/get-all');
    return response.data;
  },

  // READ - Get by tutor
  getSessionsByTutor: async (tutorId) => {
    const response = await api.get(`/api/sessions/tutor/${tutorId}`);
    return response.data;
  },

  // READ - Get by tutee (for students)
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
    const response = await api.put(`/api/sessions/status/${id}`, { status });
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
  },

  // NEW: Get upcoming sessions for current user
  // In sessionService.js, update the getUpcomingSessionsForUser method:
  getUpcomingSessionsForUser: async (userId, userType) => {
    try {
      let sessions = [];
      
      // Normalize userType to match backend expectations
      const normalizedUserType = userType.toUpperCase();
      
      if (normalizedUserType === 'TUTOR' || normalizedUserType === 'TUTOR') {
        // First get tutor ID from user ID
        try {
          const tutorResponse = await api.get(`/api/tutors/user/${userId}`);
          if (tutorResponse.data && tutorResponse.data.tutorId) {
            // For tutors, get sessions where they are the tutor
            const response = await api.get(`/api/sessions/tutor/${tutorResponse.data.tutorId}`);
            sessions = response.data || [];
          }
        } catch (tutorError) {
          console.error('Error fetching tutor ID:', tutorError);
        }
      } else if (normalizedUserType === 'TUTEE' || normalizedUserType === 'STUDENT') {
        // First get tutee ID from user ID
        try {
          const tuteeResponse = await api.get(`/api/tutees/user/${userId}`);
          if (tuteeResponse.data && tuteeResponse.data.tuteeId) {
            // For students/tutees, get sessions where they are the tutee
            const response = await api.get(`/api/sessions/tutee/${tuteeResponse.data.tuteeId}`);
            sessions = response.data || [];
          }
        } catch (tuteeError) {
          console.error('Error fetching tutee ID:', tuteeError);
        }
      }
      
      // Filter for upcoming sessions (status = 'Confirmed' or 'Pending')
      const now = new Date();
      const upcoming = sessions.filter(session => {
        if (!session || !session.sessionYear || !session.sessionMonth || !session.sessionDay) {
          return false;
        }
        
        const sessionDate = new Date(
          session.sessionYear,
          session.sessionMonth - 1, // JavaScript months are 0-indexed
          session.sessionDay,
          session.startHour + (session.startAmPm === 'PM' ? 12 : 0),
          session.startMinute || 0
        );
        
        return (
          (session.status === 'Confirmed' || session.status === 'Pending' || session.status === 'pending') &&
          sessionDate >= now
        );
      });
      
      return upcoming;
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      throw error;
    }
  },

  // Helper: Format session time
  formatSessionTime: (session) => {
    const { startHour, startMinute, startAmPm, duration } = session;
    
    // Calculate end time
    let endHour = startHour;
    let endMinute = startMinute + duration;
    let endAmPm = startAmPm;
    
    // Handle minute overflow
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }
    
    // Handle hour overflow (12-hour format)
    if (endHour > 12) {
      endHour -= 12;
      endAmPm = startAmPm === 'AM' ? 'PM' : 'AM';
    } else if (endHour === 12) {
      endAmPm = startAmPm === 'AM' ? 'PM' : 'AM';
    }
    
    const startTime = `${startHour}:${startMinute.toString().padStart(2, '0')} ${startAmPm}`;
    const endTime = `${endHour}:${endMinute.toString().padStart(2, '0')} ${endAmPm}`;
    
    return { startTime, endTime };
  }
};