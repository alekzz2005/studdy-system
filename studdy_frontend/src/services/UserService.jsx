import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const userData = JSON.parse(userStr);
      return userData;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get user ID
  getUserId: () => {
    const user = userService.getCurrentUser();
    return user ? (user.userId || user.id || null) : null;
  },

  // Delete account from database
  deleteAccount: async () => {
    try {
      const currentUser = userService.getCurrentUser();
      const userId = userService.getUserId();
      
      if (!currentUser || !userId) {
        throw new Error('No user logged in');
      }

      console.log('Deleting account for user:', currentUser.email || 'Unknown', 'ID:', userId);
      
      // Make DELETE request to backend API
      const response = await api.delete(`/users/${userId}`);
      
      // Check if deletion was successful
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || 'Failed to delete account');
      }
      
      // Clear local storage after successful deletion from database
      userService.clearUser();
      
      return {
        success: true,
        message: 'Account deleted successfully from database',
        userId: userId,
        data: response.data
      };
    } catch (error) {
      console.error('Error deleting account from database:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Backend responded with error status
        throw new Error(error.response.data?.message || 'Failed to delete account from database');
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error. Could not connect to server.');
      } else {
        // Other errors
        throw new Error('Failed to delete account: ' + error.message);
      }
    }
  },


  // Delete account with fallback to localStorage only (for development)
  deleteAccountWithFallback: async () => {
    try {
      // First try to delete from database
      return await userService.deleteAccount();
    } catch (error) {
      console.warn('Database deletion failed, falling back to localStorage:', error.message);
      
      // Fallback: Just clear localStorage
      const userId = userService.getUserId();
      userService.clearUser();
      
      return {
        success: true,
        message: 'Account removed from local storage (database deletion failed)',
        userId: userId,
        warning: error.message
      };
    }
  },

  // Delete account from localStorage only (for testing/development)
  deleteAccountLocal: () => {
    try {
      const currentUser = userService.getCurrentUser();
      const userId = userService.getUserId();
      
      console.log('Deleting account from local storage for user:', currentUser?.email || 'Unknown', 'ID:', userId);
      
      userService.clearUser();
      
      return {
        success: true,
        message: 'Account removed from local storage only',
        userId: userId
      };
    } catch (error) {
      console.error('Error deleting local account:', error);
      throw new Error('Failed to delete account from local storage: ' + error.message);
    }
  },

  // Update user data (sync with database)
  updateUser: async (updatedData) => {
    try {
      const currentUser = userService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const userId = userService.getUserId();
      
      // First update local storage for immediate UI update
      const updatedUser = { ...currentUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Then send to backend database
      try {
        const response = await api.put(`/users/${userId}`, updatedData);
        return response.data;
      } catch (apiError) {
        console.warn('Backend update failed, using local storage only:', apiError.message);
        return updatedUser;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Clear user data (for logout)
  clearUser: () => {
    // Remove all user-related data
    localStorage.removeItem('user');
    
    // Optional: Clear other user-specific data
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('userSettings');
    localStorage.removeItem('sessionHistory');
    localStorage.removeItem('bookedSessions');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    console.log('User data cleared from storage');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!userService.getCurrentUser();
  },

  // Login user (store in localStorage and optionally sync with backend)
  login: async (credentials) => {
    try {
      // Send login request to backend
      const response = await api.post('/auth/login', credentials);
      const userData = response.data;
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Register user (create in database and store locally)
  register: async (userData) => {
    try {
      // Send registration request to backend
      const response = await api.post('/auth/register', userData);
      const newUser = response.data;
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    userService.clearUser();
    return { success: true, message: 'Logged out successfully' };
  },

  // Fetch user data from database
  fetchUserFromDatabase: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      const userData = response.data;
      
      // Update local storage with fresh data
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error fetching user from database:', error);
      // Return local data if database fetch fails
      return userService.getCurrentUser();
    }
  }
};