import api from './auth.js';

export const tutorSubjectService = {
  // CREATE
  createTutorSubject: async (tutorSubjectData) => {
    const response = await api.post('/api/tutor-subjects/create-tutor-subject', tutorSubjectData);
    return response.data;
  },

  // READ - Get all
  getAllTutorSubjects: async () => {
    const response = await api.get('/api/tutor-subjects/get-all');
    return response.data;
  },

  // READ - Get by ID
  getTutorSubjectById: async (id) => {
    const response = await api.get(`/api/tutor-subjects/get/${id}`);
    return response.data;
  },

  // READ - Get by tutor ID
  getSubjectsByTutorId: async (tutorId) => {
    const response = await api.get(`/api/tutor-subjects/get-tutor/${tutorId}`);
    return response.data;
  },

  // READ - Get by subject ID
  getTutorsBySubjectId: async (subjectId) => {
    const response = await api.get(`/api/tutor-subjects/get-subject/${subjectId}`);
    return response.data;
  },

  // DELETE
  deleteTutorSubject: async (id) => {
    const response = await api.delete(`/api/tutor-subjects/delete-tutor/${id}`);
    return response.data;
  },

  // Check existence
  existsByTutorAndSubject: async (tutorId, subjectId) => {
    const response = await api.get('/api/tutor-subjects/exists', {
      params: { tutorId, subjectId }
    });
    return response.data;
  }
};