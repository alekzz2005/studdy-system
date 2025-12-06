import api from './auth.js';

export const userAPI = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users/get-all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/users/get/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/api/users/update/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete/Deactivate user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/api/users/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  },

  // Change password
  changePassword: async (id, passwordData) => {
    try {
      const response = await api.post(`/api/users/change-password/${id}`, passwordData);
      return response.data;
    } catch (error) {
      console.error(`Error changing password for user ${id}:`, error);
      throw error;
    }
  },

  // Check email availability
  checkEmailAvailability: async (email) => {
    try {
      const response = await api.get('/api/users/check-email', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking email availability:', error);
      throw error;
    }
  },

  // Get current user info from token
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Test connection
  testConnection: async () => {
    try {
      const response = await api.get('/api/users/test');
      return response.data;
    } catch (error) {
      console.error('Error testing user connection:', error);
      throw error;
    }
  }
};

// Helper functions for user management
export const userHelpers = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Format user data for display
  formatUserForDisplay: (user) => {
    if (!user) return null;
    
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      role: user.role || 'user',
      isActive: user.isActive !== false, // Default to true if not specified
    };
  },

  // Store user data in localStorage after login/registration
  storeUserData: (userData) => {
    if (userData && userData.user) {
      localStorage.setItem('userData', JSON.stringify(userData.user));
    }
  },

  // Clear user data from localStorage
  clearUserData: () => {
    localStorage.removeItem('userData');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get user type
  getUserType: () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      return user.type || null;
    }
    return null;
  }
};

// Export both API methods and helpers
export default {
  ...userAPI,
  ...userHelpers
};