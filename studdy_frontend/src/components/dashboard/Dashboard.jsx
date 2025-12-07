import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/auth';
import { userAPI } from '../../services/user';
import { sessionService } from '../../services/session';
import { tuteeService } from '../../services/tutee';
import { tutorService } from '../../services/tutor';
import { subjectService } from '../../services/subject';

import DashboardHeader from './DashboardHeader';
import WelcomeBanner from './WelcomeBanner';
import TutorProfileCard from './TutorProfileCard';
import Sessions from './Sessions';
import MessagesSection from './MessagesSection';
import AvailableTutors from './AvailableTutors';
import MobileBookButton from './MobileBookButton';
import LoadingState from './LoadingState';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [availableTutors, setAvailableTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  // REPLACE your useEffect with this:
  useEffect(() => {
    const initDashboard = async () => {
      await fetchCurrentUser();
      // Wait for currentUser to be set before fetching sessions
    };
    initDashboard();
  }, []);

  // ADD this useEffect to run when currentUser changes:
  useEffect(() => {
    if (currentUser?.userId) {
      fetchUpcomingSessions();
      fetchAvailableTutors();
      fetchMessages();
    }
  }, [currentUser]); // This runs AFTER currentUser is set

const fetchCurrentUser = async () => {
  try {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log('LocalStorage userData:', userData); // Add this
    
    if (userData && (userData.userId || userData.id)) {
      // Use existing userId from localStorage
      const userId = userData.userId || userData.id;
      
      // Fetch fresh user data from API
      const response = await userAPI.getUserById(userId);
      if (response.success) {
        // Ensure userId is set
        const updatedUser = { ...response.user, userId: response.user.userId || response.user.id };
        setCurrentUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      } else {
        // Fallback to stored data if API fails
        setCurrentUser({ ...userData, userId });
      }
    } else {
      // Try to get current user from token
      const response = await userAPI.getCurrentUser();
      if (response.success) {
        const user = response.user;
        // Ensure userId is set
        const userWithId = { ...user, userId: user.userId || user.id };
        setCurrentUser(userWithId);
        localStorage.setItem('userData', JSON.stringify(userWithId));
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
    if (!currentUser || !currentUser.userId) {
      throw new Error('User not found');
    }

    let typeId;
    let tutorData = null;
    let tuteeData = null;
    
    // Get tutor/tutee ID and data
    if (currentUser.type === 'TUTOR') {
      const tutorResponse = await tutorService.getTutorByUserId(currentUser.userId);
      tutorData = tutorResponse;
      typeId = tutorData.tutorId;
      console.log('Tutor Data:', tutorData);
    } else {
      const tuteeResponse = await tuteeService.getTuteeByUserId(currentUser.userId);
      tuteeData = tuteeResponse;
      typeId = tuteeData.tuteeId;
      console.log('Tutee Data:', tuteeData);
    }

    // Use the new service method
    const sessions = await sessionService.getUpcomingSessionsForUser(
      typeId,
      currentUser.type
    );

    // Transform the data to match the frontend format
    const formattedSessions = await Promise.all(sessions.map(async (session) => {
      try {
        const { startTime, endTime } = sessionService.formatSessionTime(session);

        // Format date display
        const sessionDate = new Date(
          session.sessionYear,
          session.sessionMonth - 1,
          session.sessionDay
        );
        const now = new Date();
        const isToday = sessionDate.toDateString() === now.toDateString();
        const isTomorrow = new Date(now.setDate(now.getDate() + 1)).toDateString() === sessionDate.toDateString();
        
        let dateDisplay;
        if (isToday) {
          dateDisplay = `Today • ${startTime} - ${endTime}`;
        } else if (isTomorrow) {
          dateDisplay = `Tomorrow • ${startTime} - ${endTime}`;
        } else {
          dateDisplay = `${sessionDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })} • ${startTime} - ${endTime}`;
        }

        // Get subject details
        let subjectName = 'General';
        if (session.subjectId) {
          try {
            const subjectResponse = await subjectService.getSubjectById(session.subjectId);
            subjectName = subjectResponse.subjectName || 'General';
          } catch (err) {
            console.error('Error fetching subject:', err);
          }
        }

        // Get tutor/tutee name based on user type
        let otherPersonName = '';
        let otherPersonId = null;
        
        if (currentUser.type === 'TUTOR') {
          // If current user is tutor, show tutee name
          if (session.tuteeId) {
            try {
              const tuteeResponse = await tuteeService.getTuteeById(session.tuteeId);
              otherPersonName = `${tuteeResponse.firstName || ''} ${tuteeResponse.lastName || ''}`.trim() || 'Tutee';
              otherPersonId = tuteeResponse.userId || session.tuteeId;

              console.log('Other Person (Tutee) Data:', tuteeResponse.firstName, otherPersonId);
            } catch (err) {
              console.error('Error fetching tutee:', err);
              otherPersonName = 'Tutee';
            }
          } else {
            otherPersonName = 'Tutee';
          }
        } else {
          // If current user is tutee, show tutor name
          if (session.tutorId) {
            try {
              const tutorResponse = await tutorService.getTutorById(session.tutorId);
              otherPersonName = `${tutorResponse.firstName || ''} ${tutorResponse.lastName || ''}`.trim() || 'Tutor';
              otherPersonId = tutorResponse.userId || session.tutorId;
            } catch (err) {
              console.error('Error fetching tutor:', err);
              otherPersonName = 'Tutor';
            }
          } else {
            otherPersonName = 'Tutor';
          }
        }

        return {
          id: session.sessionId,
          subject: subjectName,
          tutor: otherPersonName,
          date: dateDisplay,
          status: (session.status || 'pending').toLowerCase(),
          tutorId: currentUser.type === 'TUTOR' ? currentUser.userId : otherPersonId,
          tuteeId: currentUser.type === 'TUTOR' ? otherPersonId : currentUser.userId,
          rawSession: session // Keep original data for reference
        };
      } catch (error) {
        console.error('Error formatting session:', error, session);
        return null;
      }
    }));

    // Filter out null sessions
    const validSessions = formattedSessions.filter(session => session !== null);
    
    setUpcomingSessions(validSessions);
    console.log('Formatted Sessions:', validSessions);
    console.log('Raw Sessions from API:', sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    
    // Fallback to mock data if API fails (for development)
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
    setError('Using demo data. Real sessions will appear when connected to backend.');
  } finally {
    setLoadingSessions(false);
  }
};

// Add these helper functions after your existing functions in Dashboard.jsx
const formatSessionDate = (session) => {
  const { sessionYear, sessionMonth, sessionDay, startHour, startMinute, startAmPm, duration } = session;
  
  const sessionDate = new Date(sessionYear, sessionMonth - 1, sessionDay);
  const now = new Date();
  
  // Check if it's today or tomorrow
  if (sessionDate.toDateString() === now.toDateString()) {
    return 'Today';
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (sessionDate.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  // Format as "Mon, Jan 1"
  return sessionDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatSessionTime = (session) => {
  const { startHour, startMinute, startAmPm, duration } = session;
  
  // Calculate end time
  let endHour = startHour;
  let endMinute = startMinute + duration;
  let endAmPm = startAmPm;
  
  // Handle minute overflow
  if (endMinute >= 60) {
    endHour += Math.floor(endMinute / 60);
    endMinute = endMinute % 60;
  }
  
  // Handle hour overflow and AM/PM conversion
  if (endHour >= 12) {
    if (endHour > 12) {
      endHour -= 12;
    }
    endAmPm = 'PM';
  }
  
  const startTime = `${startHour}:${startMinute.toString().padStart(2, '0')} ${startAmPm}`;
  const endTime = `${endHour}:${endMinute.toString().padStart(2, '0')} ${endAmPm}`;
  
  return `${startTime} - ${endTime}`;
};


  const fetchAvailableTutors = async () => {
    setLoadingTutors(true);
    try {
      const response = await userAPI.getAllUsers();
      if (response.success) {
        const tutors = response.users.filter(user => 
          user.type === 'Tutor' && user.active === true
        ).map(tutor => ({
          id: tutor.userId,
          name: `${tutor.firstName} ${tutor.lastName}`,
          subject: tutor.major || 'General',
          rating: '4.8',
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
    alert(`Opening conversation with ${message.sender}`);
  };

  const handleViewAllMessages = () => {
    navigate('/messages');
  };

  const handleViewAllTutors = () => {
    navigate('/tutors');
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      authAPI.logout();
      navigate('/login');
    }
  };

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        currentUser={currentUser}
        onBookSession={handleBookSession}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <WelcomeBanner currentUser={currentUser} />
        
        {currentUser?.type === 'Tutor' && (
          <TutorProfileCard currentUser={currentUser} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Sessions
              sessions={upcomingSessions}
              loading={loadingSessions}
              onRefresh={handleRefreshSessions}
              onBookSession={handleBookSession}
            />
          </div>

          <div className="lg:col-span-1 space-y-8">
            <MessagesSection
              messages={messages}
              onMessageClick={handleMessageClick}
              onViewAll={handleViewAllMessages}
            />
            
            <AvailableTutors
              tutors={availableTutors}
              loading={loadingTutors}
              onBookSession={handleBookSession}
              onViewAll={handleViewAllTutors}
            />
          </div>
        </div>
      </main>

      <MobileBookButton onBookSession={handleBookSession} />
    </div>
  );
};

export default Dashboard;