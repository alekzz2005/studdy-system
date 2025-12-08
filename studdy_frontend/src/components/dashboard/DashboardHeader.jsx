import React, { useState, useEffect, useRef } from 'react';
import { Bell, CalendarPlus, ChevronDown, Check, Clock, AlertCircle } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

// Mock notifications data - backend-friendly structure
const mockNotifications = [
  {
    id: 1,
    userId: 123, // This would match the currentUser's ID
    title: 'Session Scheduled',
    message: 'Your math tutoring session has been scheduled for tomorrow at 2:00 PM',
    type: 'SESSION',
    read: false,
    createdAt: '2024-01-15T10:30:00Z',
    metadata: {
      sessionId: 456,
      tutorName: 'John Doe',
      dateTime: '2024-01-16T14:00:00Z'
    }
  },
  {
    id: 2,
    userId: 123,
    title: 'Session Reminder',
    message: 'Reminder: You have a chemistry session in 1 hour',
    type: 'REMINDER',
    read: false,
    createdAt: '2024-01-15T09:00:00Z',
    metadata: {
      sessionId: 457,
      minutesUntil: 60
    }
  },
  {
    id: 3,
    userId: 123,
    title: 'New Message',
    message: 'You received a new message from your tutor',
    type: 'MESSAGE',
    read: true,
    createdAt: '2024-01-14T16:45:00Z',
    metadata: {
      messageId: 789,
      fromUserId: 456,
      fromUserName: 'Jane Smith'
    }
  },
  {
    id: 4,
    userId: 123,
    title: 'Payment Confirmed',
    message: 'Your payment for the tutoring session has been processed successfully',
    type: 'PAYMENT',
    read: true,
    createdAt: '2024-01-14T11:20:00Z',
    metadata: {
      amount: 50.00,
      sessionId: 455
    }
  },
  {
    id: 5,
    userId: 123,
    title: 'Session Cancelled',
    message: 'Your physics session has been cancelled by the tutor',
    type: 'SESSION',
    read: false,
    createdAt: '2024-01-13T15:10:00Z',
    metadata: {
      sessionId: 454,
      reason: 'Tutor unavailable'
    }
  }
];

const DashboardHeader = ({ currentUser, onBookSession, onLogout }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef(null);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const isTutee = currentUser?.type === 'TUTOR' || currentUser?.type === 'Tutor' ? false : true;

  // Simulate fetching notifications (this would be replaced with actual API call)
  useEffect(() => {
    // In a real app, this would be an API call like:
    // fetchNotifications(currentUser.id).then(data => setNotifications(data));
    
    // Filter notifications for the current user (simulating user-specific data)
    const userNotifications = mockNotifications.filter(
      notification => notification.userId === 123 // Replace with currentUser.id
    );
    
    setNotifications(userNotifications);
    
    // Calculate unread count
    const unread = userNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [currentUser?.id]);

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

  const handleNotificationClick = async (notificationId) => {
    // Mark notification as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );

    // Update unread count
    const updatedUnreadCount = notifications.filter(n => 
      n.id !== notificationId && !n.read
    ).length;
    setUnreadCount(updatedUnreadCount);

    // In a real app, you would also make an API call:
    // await markAsRead(notificationId);
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);

    // In a real app:
    // await markAllAsRead(currentUser.id);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'SESSION':
        return <CalendarPlus className="w-4 h-4 text-blue-500" />;
      case 'REMINDER':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'MESSAGE':
        return <Bell className="w-4 h-4 text-green-500" />;
      case 'PAYMENT':
        return <Check className="w-4 h-4 text-emerald-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-green-600 leading-none">Studdy</h1>
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
                className="p-2 rounded-lg hover:bg-gray-100 relative"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown Content */}
              {notificationsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <div className="flex-1 text-right">
                        {notifications.some(n => !n.read) && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <h4 className={`text-sm ${notification.read ? 'font-normal text-gray-900' : 'font-semibold text-gray-900'}`}>
                                        {notification.title}
                                      </h4>
                                      {!notification.read && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                      )}
                                    </div>
                                  </div>
                                  <p className={`text-sm mt-1 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">
                                      {formatTimeAgo(notification.createdAt)}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      {!notification.read && (
                                        <button
                                          onClick={() => handleNotificationClick(notification.id)}
                                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                          Mark as read
                                        </button>
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
                </div>
              )}
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-1"
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