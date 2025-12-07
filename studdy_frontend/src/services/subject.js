import api from './auth.js';

export const subjectService = {
  // CREATE
  createSubject: async (subjectData) => {
    const response = await api.post('/api/subjects', subjectData);
    return response.data;
  },

  // READ - Get all
  getAllSubjects: async () => {
    const response = await api.get('/api/subjects');
    return response.data;
  },

  // READ - Get by ID
  getSubjectById: async (id) => {
    const response = await api.get(`/api/subjects/get/${id}`);
    return response.data;
  },

  // READ - Get by name
  getSubjectByName: async (name) => {
    const response = await api.get(`/api/subjects/subject-name/${name}`);
    return response.data;
  },

  // READ - Get count
  getSubjectCount: async () => {
    const response = await api.get('/api/subjects/count');
    return response.data;
  },

  // READ - Check if exists by ID
  subjectExists: async (id) => {
    const response = await api.get(`/api/subjects/exists/${id}`);
    return response.data;
  },

  // READ - Check if exists by name
  subjectExistsByName: async (name) => {
    const response = await api.get(`/api/subjects/exists/name/${name}`);
    return response.data;
  },

  // UPDATE
  updateSubject: async (id, subjectData) => {
    const response = await api.put(`/api/subjects/${id}`, subjectData);
    return response.data;
  },

  // DELETE
  deleteSubject: async (id) => {
    const response = await api.delete(`/api/subjects/${id}`);
    return response.data;
  }
};