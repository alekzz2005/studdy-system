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
  // Get current user info from token (enhanced version)
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/users/me');
      // Check the response structure
      if (response.data && response.data.success) {
        return response.data.user;
      } else {
        throw new Error(response.data?.message || 'Failed to get current user');
      }
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
  },

  // Get user profile with all related data (updated)
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/api/users/profile/${userId}`);
      if (response.data && response.data.success) {
        return response.data.profile;
      } else {
        throw new Error(response.data?.message || 'Failed to get user profile');
      }
    } catch (error) {
      console.error(`Error fetching user profile ${userId}:`, error);
      throw error;
    }
  },

  // Update user profile (updated)
  updateUserProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/api/users/profile/${userId}`, profileData);
      if (response.data && response.data.success) {
        return response.data.user;
      } else {
        throw new Error(response.data?.message || 'Failed to update user profile');
      }
    } catch (error) {
      console.error(`Error updating user profile ${userId}:`, error);
      throw error;
    }
  },
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
  },

  // Get user from localStorage
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  },

  // Get user ID from localStorage
  getUserId: () => {
    const user = userHelpers.getStoredUser();
    return user?.id || user?.userId || null;
  },

  // Format user data for profile
  formatUserForProfile: (user) => {
    if (!user) return null;
    
    return {
      userId: user.id || user.userId,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || '',
      school: user.school || '',
      gradeLevel: user.gradeLevel || '',
      major: user.major || '',
      bio: user.bio || '',
      type: user.type || 'TUTEE',
      dateStarted: user.createdAt || user.dateStarted || new Date().toISOString(),
      active: user.isActive !== false
    };
  },

  // Check if user has completed profile
  hasCompleteProfile: (user) => {
    if (!user) return false;
    
    const requiredFields = ['firstName', 'lastName', 'email', 'school'];
    return requiredFields.every(field => user[field] && user[field].trim());
  },

  // Get profile completion percentage
  getProfileCompletion: (user) => {
    if (!user) return 0;
    
    const fields = [
      'firstName', 'lastName', 'email', 'phoneNumber', 
      'dateOfBirth', 'address', 'school', 'gradeLevel', 
      'major', 'bio'
    ];
    
    const completed = fields.filter(field => 
      user[field] && user[field].toString().trim()
    ).length;
    
    return Math.round((completed / fields.length) * 100);
  }
};

// Export both API methods and helpers
export default {
  ...userAPI,
  ...userHelpers
};