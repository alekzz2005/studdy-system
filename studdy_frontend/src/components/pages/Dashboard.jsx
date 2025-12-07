import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/auth';
import { userAPI } from '../../services/user';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  RefreshCw, 
  CalendarPlus, 
  CalendarX, 
  Star, 
  BookOpen,
  Bell,
  User,
  MessageSquare,
  Settings,
  LogOut,
  Key,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ChevronDown
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [availableTutors, setAvailableTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  // Fetch current user data
  useEffect(() => {
    fetchCurrentUser();
    fetchUpcomingSessions();
    fetchAvailableTutors();
    fetchMessages();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      if (userData && userData.userId) {
        // Fetch fresh user data from API
        const response = await userAPI.getUserById(userData.userId);
        if (response.success) {
          setCurrentUser(response.user);
        } else {
          // Fallback to stored data if API fails
          setCurrentUser(userData);
        }
      } else {
        // Try to get current user from token
        const response = await userAPI.getCurrentUser();
        if (response.success) {
          setCurrentUser(response.user);
          localStorage.setItem('userData', JSON.stringify(response.user));
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingSessions = async () => {
    setLoadingSessions(true);
    try {
      // TODO: Replace with actual sessions API call
      // For now, using mock data
      const mockSessions = [
        {
          id: 1,
          subject: 'Mathematics',
          tutor: 'Alexander Binagatan',
          date: 'Today • 2:00 PM - 3:00 PM',
          status: 'confirmed',
          tutorId: 101
        },
        {
          id: 2,
          subject: 'Physics',
          tutor: 'Charry Mae Atamosa',
          date: 'Tomorrow • 10:00 AM - 11:30 AM',
          status: 'confirmed',
          tutorId: 102
        }
      ];
      
      setUpcomingSessions(mockSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchAvailableTutors = async () => {
    setLoadingTutors(true);
    try {
      // Get all users and filter for tutors
      const response = await userAPI.getAllUsers();
      if (response.success) {
        const tutors = response.users.filter(user => 
          user.type === 'Tutor' && user.active === true
        ).map(tutor => ({
          id: tutor.userId,
          name: `${tutor.firstName} ${tutor.lastName}`,
          subject: tutor.major || 'General',
          rating: '4.8', // TODO: Add rating system to backend
          email: tutor.email,
          phone: tutor.phoneNumber,
          major: tutor.major,
          school: tutor.school,
          bio: tutor.bio
        }));
        setAvailableTutors(tutors);
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError('Failed to load tutors');
    } finally {
      setLoadingTutors(false);
    }
  };

  const fetchMessages = async () => {
    try {
      // TODO: Replace with actual messages API call
      // For now, using mock data
      const mockMessages = [
        {
          id: 1,
          sender: 'Alexander Binagatan',
          senderId: 101,
          preview: 'Hi! Just confirming our session for today at 2 PM.',
          time: '10 min ago',
          unread: true,
          avatar: 'AB'
        },
        {
          id: 2,
          sender: 'Charry Mae Atamosa',
          senderId: 102,
          preview: 'I\'ve uploaded the study materials for our next physics session.',
          time: '1 hour ago',
          unread: true,
          avatar: 'CA'
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleBookSession = (tutorId = null) => {
    if (tutorId) {
      navigate(`/book-tutor?tutor=${tutorId}`);
    } else {
      navigate('/book-tutor');
    }
  };

  const handleRefreshSessions = () => {
    fetchUpcomingSessions();
  };

  const handleMessageClick = (message) => {
    // TODO: Navigate to message thread
    alert(`Opening conversation with ${message.sender}`);
  };

  const handleViewAllMessages = () => {
    navigate('/messages');
  };

  const handleViewAllTutors = () => {
    navigate('/tutors');
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeDropdown = () => {
    setProfileDropdownOpen(false);
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      authAPI.logout();
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">Studdy</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleBookSession()}
                className="hidden sm:flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CalendarPlus className="w-5 h-5" />
                <span>Book Session</span>
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={handleProfileClick}
                  className="p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-1"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {currentUser ? getInitials(currentUser.firstName, currentUser.lastName) : 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={closeDropdown}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {currentUser && (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {currentUser.firstName} {currentUser.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                          <div className="flex items-center mt-1">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              {currentUser.type || 'Student'}
                            </span>
                            {currentUser.major && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                {currentUser.major}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="py-1">
                        <button 
                          onClick={handleEditProfile}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <User className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>
                        
                        <button 
                          onClick={handleChangePassword}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Key className="w-4 h-4" />
                          <span>Change Password</span>
                        </button>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {currentUser?.firstName || 'Student'}! 👋
          </h2>
          <p className="text-green-50 text-lg">
            {currentUser?.type === 'Tutor' 
              ? 'Ready to help students today?' 
              : 'Ready to continue your learning journey?'}
          </p>
          {currentUser?.major && (
            <div className="mt-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              <span>{currentUser.major} • {currentUser.school || 'University'}</span>
            </div>
          )}
        </div>

        {/* User Info Card (Only for tutors or detailed view) */}
        {currentUser && currentUser.type === 'Tutor' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">My Tutor Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">
                      {currentUser.firstName} {currentUser.lastName}
                    </h4>
                    <p className="text-gray-600">{currentUser.email}</p>
                  </div>
                </div>
                
                {currentUser.bio && (
                  <div className="mt-4">
                    <p className="text-gray-700">{currentUser.bio}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {currentUser.phoneNumber && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    <span>{currentUser.phoneNumber}</span>
                  </div>
                )}
                
                {currentUser.address && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3" />
                    <span>{currentUser.address}</span>
                  </div>
                )}
                
                {currentUser.dateStarted && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>Tutoring since: {formatDate(currentUser.dateStarted)}</span>
                  </div>
                )}
                
                {currentUser.gradeLevel > 0 && (
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="w-4 h-4 mr-3" />
                    <span>Grade Level: {currentUser.gradeLevel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h3>
                      <p className="text-sm text-gray-500">Your scheduled tutoring sessions</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleRefreshSessions}
                    disabled={loadingSessions}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Refresh sessions"
                  >
                    <RefreshCw className={`w-5 h-5 text-gray-600 ${loadingSessions ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {loadingSessions ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 text-green-600 animate-spin mb-4" />
                    <p className="text-gray-500">Loading your sessions...</p>
                  </div>
                ) : upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map(session => (
                      <div 
                        key={session.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <BookOpen className="w-5 h-5 text-green-600" />
                              <h4 className="font-semibold text-gray-900">{session.subject}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">with {session.tutor}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {session.date}
                            </div>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : session.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <CalendarX className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No upcoming sessions scheduled</p>
                    <button 
                      onClick={() => handleBookSession()}
                      className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CalendarPlus className="w-5 h-5" />
                      <span>Book Your First Session</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Messages and Available Tutors */}
          <div className="lg:col-span-1 space-y-8">
            {/* Messages Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                      <p className="text-xs text-gray-500">Recent conversations</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    {messages.filter(m => m.unread).length} new
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {messages.map(message => (
                  <button
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                      message.unread ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                        {message.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium truncate ${
                            message.unread ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {message.sender}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {message.time}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${
                          message.unread ? 'text-gray-700 font-medium' : 'text-gray-500'
                        }`}>
                          {message.preview}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={handleViewAllMessages}
                  className="w-full px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium text-sm"
                >
                  View All Messages
                </button>
              </div>
            </div>

            {/* Available Tutors Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Available Tutors ({availableTutors.length})
                    </h3>
                    <p className="text-xs text-gray-500">Top rated tutors</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {loadingTutors ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 text-green-600 animate-spin mb-2" />
                    <p className="text-gray-500 text-sm">Loading tutors...</p>
                  </div>
                ) : availableTutors.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                      {availableTutors.slice(0, 4).map(tutor => (
                        <div 
                          key={tutor.id} 
                          onClick={() => handleBookSession(tutor.id)}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-green-300 cursor-pointer bg-white"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-green-600 font-semibold">
                                {getInitials(tutor.name.split(' ')[0], tutor.name.split(' ')[1] || '')}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">{tutor.name}</h4>
                              <p className="text-xs text-gray-600 truncate">{tutor.subject}</p>
                              {tutor.major && (
                                <p className="text-xs text-gray-500 truncate">{tutor.major}</p>
                              )}
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs font-medium text-gray-700">{tutor.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {availableTutors.length > 4 && (
                      <button 
                        onClick={handleViewAllTutors}
                        className="w-full px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
                      >
                        View All {availableTutors.length} Tutors
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No tutors available at the moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Book Session Button */}
      <button 
        onClick={() => handleBookSession()}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors z-50"
      >
        <CalendarPlus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;