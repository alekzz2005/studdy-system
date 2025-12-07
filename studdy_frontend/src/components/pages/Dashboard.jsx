import React, { useState, useEffect } from 'react';
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
  Search,
  Menu,
  MessageSquare,
  Send,
  ChevronDown,
  Settings,
  LogOut,
  Key
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState({
    name: 'Student',
    major: 'Computer Science',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Simulate fetching user data
  useEffect(() => {
    const mockUser = {
      name: 'John Doe',
      major: 'Computer Science',
      email: 'john.doe@university.edu'
    };
    setCurrentUser(mockUser);
    setLoading(false);
  }, []);

  // Simulate fetching sessions
  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    setLoadingSessions(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock sessions data
    const mockSessions = [
      {
        id: 1,
        subject: 'Mathematics',
        tutor: 'Alexander Binagatan',
        date: 'Today • 2:00 PM - 3:00 PM',
        status: 'confirmed'
      },
      {
        id: 2,
        subject: 'Physics',
        tutor: 'Charry Mae Atamosa',
        date: 'Tomorrow • 10:00 AM - 11:30 AM',
        status: 'confirmed'
      },
      {
        id: 3,
        subject: 'Chemistry',
        tutor: 'John Anthony Besañez',
        date: 'Dec 15 • 4:00 PM - 5:00 PM',
        status: 'pending'
      }
    ];
    
    setUpcomingSessions(mockSessions);
    setLoadingSessions(false);
  };

  const messages = [
    {
      id: 1,
      sender: 'Alexander Binagatan',
      preview: 'Hi! Just confirming our session for today at 2 PM. See you then!',
      time: '10 min ago',
      unread: true,
      avatar: 'AB'
    },
    {
      id: 2,
      sender: 'Charry Mae Atamosa',
      preview: 'I\'ve uploaded the study materials for our next physics session.',
      time: '1 hour ago',
      unread: true,
      avatar: 'CA'
    },
    {
      id: 3,
      sender: 'John Anthony Besañez',
      preview: 'Thanks for the great session! Let me know if you have any questions.',
      time: '2 hours ago',
      unread: false,
      avatar: 'JB'
    },
    {
      id: 4,
      sender: 'Lisa Wang',
      preview: 'The homework assignment is due next Monday. Don\'t forget!',
      time: '1 day ago',
      unread: false,
      avatar: 'LW'
    }
  ];

  const availableTutors = [
    { id: 1, name: 'Alex Rodriguez', subject: 'Computer Science', rating: '4.9' },
    { id: 2, name: 'Lisa Wang', subject: 'Mathematics', rating: '4.7' },
    { id: 3, name: 'James Smith', subject: 'Biology', rating: '4.8' },
    { id: 4, name: 'Maria Garcia', subject: 'Spanish', rating: '4.5' }
  ];

  const handleBookSession = () => {
    navigate('/book-tutor');
  };

  const handleRefreshSessions = () => {
    fetchUpcomingSessions();
  };

  const handleMessageClick = (messageId) => {
    alert(`Open message ${messageId}`);
  };

  const handleViewAllMessages = () => {
    alert('Navigate to Messages page');
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeDropdown = () => {
    setProfileDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600 pt-5">Studdy</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBookSession}
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
                  <User className="w-6 h-6 text-gray-600" />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <>
                    {/* Backdrop overlay */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={closeDropdown}
                    ></div>
                    
                    {/* Dropdown content */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>
                        
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                          <Key className="w-4 h-4" />
                          <span>Change Password</span>
                        </button>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2">
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
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {currentUser.name}! 👋
          </h2>
          <p className="text-green-50 text-lg">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Dashboard Grid - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Sessions (2/3 width) */}
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
                      onClick={handleBookSession}
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

              <div className="divide-y divide-gray-100">
                {messages.map(message => (
                  <button
                    key={message.id}
                    onClick={() => handleMessageClick(message.id)}
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
                    <h3 className="text-lg font-semibold text-gray-900">Available Tutors</h3>
                    <p className="text-xs text-gray-500">Top rated tutors</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {availableTutors.map(tutor => (
                    <div 
                      key={tutor.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-green-300 cursor-pointer bg-white"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{tutor.name}</h4>
                          <p className="text-xs text-gray-600 truncate">{tutor.subject}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium text-gray-700">{tutor.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleBookSession}
                  className="w-full px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
                >
                  View All Tutors
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Book Session Button */}
      <button 
        onClick={handleBookSession}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors z-50"
      >
        <CalendarPlus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;