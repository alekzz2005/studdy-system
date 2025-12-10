import api from './auth';

export const messageAPI = {
  getUserConversations: async (userId) => {
    try {
      const response = await api.get(`/api/messages/get/conversations`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  searchConversations: async (userId, query) => {
    try {
      const response = await api.get(`/api/messages/conversations/search`, {
        params: { userId, query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }
  },

  getConversationMessages: async (conversationId, userId) => {
    try {
      const response = await api.get(`/api/messages/conversations/${conversationId}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  },

  sendMessage: async (senderId, receiverId, text, subject = 'General', type = 'TEXT') => {
    try {
      const response = await api.post(`/api/messages/send?senderId=${senderId}`, {
        receiverId,
        text,
        subject,
        type
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  markAsRead: async (conversationId, userId) => {
    try {
      const response = await api.put(`/api/messages/conversations/${conversationId}/read`, null, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  },

  getUnreadCount: async (userId) => {
    try {
      const response = await api.get(`/api/messages/unread-count`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  },

  createOrGetConversation: async (user1Id, user2Id, subject = 'General') => {
    try {
      const response = await api.post(`/api/messages/conversations`, null, {
        params: { user1Id, user2Id, subject }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating/getting conversation:', error);
      throw error;
    }
  },

  deleteConversation: async (conversationId, userId) => {
    try {
      const response = await api.delete(`/api/messages/conversations/${conversationId}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  getRecentMessages: async (conversationId, limit = 10) => {
    try {
      const response = await api.get(`/api/messages/conversations/${conversationId}/recent`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recent messages:', error);
      throw error;
    }
  },

  checkUserInConversation: async (conversationId, userId) => {
    try {
      const response = await api.get(`/api/messages/conversations/${conversationId}/check`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking user in conversation:', error);
      throw error;
    }
  },

  getConversationInfo: async (conversationId) => {
    try {
      const response = await api.get(`/api/messages/conversations/${conversationId}/info`);
      return response.data;
    } catch (error) {
      console.error('Error getting conversation info:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await api.get(`/api/messages/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking message service health:', error);
      throw error;
    }
  }
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user ? user.userId : null;
};

export const getUserFullName = () => {
  const user = getCurrentUser();
  return user ? `${user.firstName} ${user.lastName}` : '';
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export const getAvatarInitials = (name) => {
  if (!name) return 'U';
  
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const getAvatarColor = (idOrName) => {
  const colors = [
    'bg-green-600', 'bg-blue-600', 'bg-purple-600', 'bg-pink-600',
    'bg-red-600', 'bg-yellow-600', 'bg-indigo-600', 'bg-teal-600'
  ];
  
  if (typeof idOrName === 'number') {
    return colors[idOrName % colors.length];
  }
  
  if (typeof idOrName === 'string') {
    const charCode = idOrName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  }
  
  return colors[0];
};

export default api;