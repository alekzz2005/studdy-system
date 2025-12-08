// notification.js
import api from './auth.js';

export const notificationAPI = {
  // Create a new notification
  createNotification: async (notificationData) => {
    const response = await api.post('/api/notifications/create', notificationData);
    return response.data;
  },

  // Get all notifications for a user
  getUserNotifications: async (userId) => {
    const response = await api.get(`/api/notifications/user/${userId}`);
    return response.data;
  },

  // Get unread notifications for a user
  getUnreadNotifications: async (userId) => {
    const response = await api.get(`/api/notifications/user/${userId}/unread`);
    return response.data;
  },

  // Get notification by ID
  getNotificationById: async (notificationId) => {
    const response = await api.get(`/api/notifications/get/${notificationId}`);
    return response.data;
  },

  // Mark notification as read/unread
  markAsRead: async (notificationId, readStatus) => {
    const response = await api.put(`/api/notifications/${notificationId}/read`, {
      isRead: readStatus
    });
    return response.data;
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userId) => {
    const response = await api.put(`/api/notifications/user/${userId}/read-all`);
    return response.data;
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response.data;
  },

  // Count unread notifications for a user
  countUnreadNotifications: async (userId) => {
    const response = await api.get(`/api/notifications/user/${userId}/unread-count`);
    return response.data;
  },

  // Send system notification
  sendSystemNotification: async (userId, title, message) => {
    const response = await api.post(`/api/notifications/system?userId=${userId}&title=${title}&message=${message}`);
    return response.data;
  }
};