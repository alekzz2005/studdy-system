import React, { useState, useEffect, useRef } from 'react';
import { Bell, CalendarPlus, ChevronDown, Check, Clock, AlertCircle, Loader2 } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { Link } from 'react-router-dom';

import { notificationAPI } from '../../services/notification'; // Import the notification API

const DashboardHeader = ({ currentUser, onBookSession, onLogout }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingUnreadCount, setLoadingUnreadCount] = useState(false);
  const notificationsRef = useRef(null);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const isTutee = currentUser?.type === 'TUTOR' || currentUser?.type === 'Tutor' ? false : true;

  // Fetch unread count when component mounts
  useEffect(() => {
    if (currentUser?.userId) {
      fetchUnreadCount();
    }
  }, [currentUser?.userId]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (currentUser?.userId && notificationsDropdownOpen) {
      fetchNotifications();
    }
  }, [currentUser?.userId, notificationsDropdownOpen]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!currentUser?.userId) return;
    
    setLoadingNotifications(true);
    try {
      const data = await notificationAPI.getUserNotifications(currentUser.userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fetch unread count from API
  const fetchUnreadCount = async () => {
    if (!currentUser?.userId) return;
    
    setLoadingUnreadCount(true);
    try {
      const count = await notificationAPI.countUnreadNotifications(currentUser.userId);
      console.log('User ID:', currentUser.userId, 'Unread Count:', count);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    } finally {
      setLoadingUnreadCount(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle notification click (mark as read)
  const handleNotificationClick = async (notificationId) => {
    try {
      // Mark notification as read via API
      await notificationAPI.markAsRead(notificationId);
      
      console.log('Marked notification as read:', notificationId);
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!currentUser?.userId) return;
    
    try {
      await notificationAPI.markAllAsRead(currentUser.userId);

      console.log('Marked all notifications as read for user:', currentUser.userId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Format time ago for display
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    
    if (diffInMs < 0) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      // Format as date if older than a week
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    if (!type) return <Bell className="w-4 h-4 text-gray-500" />;
    
    const upperType = type.toUpperCase();
    switch (upperType) {
      case 'SESSION':
        return <CalendarPlus className="w-4 h-4 text-blue-500" />;
      case 'REMINDER':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'MESSAGE':
        return <Bell className="w-4 h-4 text-green-500" />;
      case 'PAYMENT':
        return <Check className="w-4 h-4 text-emerald-500" />;
      case 'SYSTEM':
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case 'ALERT':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'WARNING':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // Check if there are any unread notifications
  const hasUnreadNotifications = notifications.some(n => !n.isRead);

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-3xl font-bold text-green-600 leading-none pt-5">Studdy</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {isTutee && (
            <button 
              onClick={() => onBookSession()}
              className="hidden sm:flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>Book Session</span>
            </button>)}
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors"
                disabled={loadingUnreadCount}
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {loadingUnreadCount ? (
                  <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
                  </span>
                ) : unreadCount > 0 ? (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                ) : null}
              </button>
              
              {/* Notifications Dropdown Content */}
              {notificationsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <div className="flex-1 text-right">
                        {hasUnreadNotifications && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                            disabled={loadingNotifications}
                          >
                            {loadingNotifications ? 'Processing...' : 'Mark all as read'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-8 text-center">
                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
                        <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                        <p className="text-xs text-gray-400 mt-1">Notifications will appear here</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification.notificationId}
                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !notification.isRead ? 'bg-blue-50/50' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification.notificationId)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="mt-0.5">
                                  {getNotificationIcon(notification.notificationType)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <h4 className={`text-sm ${notification.isRead ? 'font-normal text-gray-900' : 'font-semibold text-gray-900'}`}>
                                        {notification.title}
                                      </h4>
                                      {!notification.isRead && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                      )}
                                    </div>
                                  </div>
                                  <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">
                                      {formatTimeAgo(notification.dateCreated)}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      {notification.userName && (
                                        <span className="text-xs text-gray-500">
                                          {notification.userName}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-gray-200">
                    <button
                      onClick={fetchNotifications}
                      className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium py-1"
                      disabled={loadingNotifications}
                    >
                      {loadingNotifications ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Refreshing...
                        </span>
                      ) : (
                        'Refresh notifications'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-1 transition-colors"
              >
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser ? getInitials(currentUser.firstName, currentUser.lastName) : 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onClose={() => setProfileDropdownOpen(false)}
                currentUser={currentUser}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;