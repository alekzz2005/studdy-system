import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../../services/auth';
import { userAPI } from '../../../services/user';
import { sessionService } from '../../../services/session';
import { tuteeService } from '../../../services/tutee';
import { tutorService } from '../../../services/tutor';
import { subjectService } from '../../../services/subject';
import { tutorSubjectService } from '../../../services/tutorsubject';
import { messageAPI, getAvatarInitials } from '../../../services/message';

import DashboardHeader from './DashboardHeader';
import WelcomeBanner from './WelcomeBanner';
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

  useEffect(() => {
    const initDashboard = async () => {
      await fetchCurrentUser();
    };
    initDashboard();
  }, []);

  useEffect(() => {
    if (currentUser?.userId) {
      fetchUpcomingSessions();
      fetchAvailableTutors();
      fetchMessages();
    }
  }, [currentUser]);

const fetchCurrentUser = async () => {
  try {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log('LocalStorage userData:', userData);
    
    if (userData && (userData.userId || userData.id)) {
      const userId = userData.userId || userData.id;
      
      const response = await userAPI.getUserById(userId);
      if (response.success) {
        const updatedUser = { ...response.user, userId: response.user.userId || response.user.id };
        setCurrentUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      } else {
        setCurrentUser({ ...userData, userId });
      }
    } else {
      const response = await userAPI.getCurrentUser();
      if (response.success) {
        const user = response.user;
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

    console.log('Fetching sessions for user:', {
      userId: currentUser.userId,
      userType: currentUser.type
    });

    const sessions = await sessionService.getUpcomingSessionsForUser(
      currentUser.userId,
      currentUser.type
    );

    console.log('Sessions from API:', sessions);

    const formattedSessions = await Promise.all(sessions.map(async (session) => {
      try {
        const { startTime, endTime } = sessionService.formatSessionTime(session);

        const sessionDate = new Date(
          session.sessionYear,
          session.sessionMonth - 1,
          session.sessionDay,
          session.startHour + (session.startAmPm === 'PM' && session.startHour !== 12 ? 12 : 0),
          session.startMinute || 0
        );
        
        const now = new Date();
        const isToday = sessionDate.toDateString() === now.toDateString();
        
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const isTomorrow = sessionDate.toDateString() === tomorrow.toDateString();
        
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

        let subjectName = 'General';
        if (session.subjectId) {
          try {
            const subjectResponse = await subjectService.getSubjectById(session.subjectId);
            subjectName = subjectResponse.subjectName || 'General';
          } catch (err) {
            console.error('Error fetching subject:', err);
          }
        }

        let otherPersonName = '';
        
        if (currentUser.type === 'TUTOR') {
          // For tutor, show tutee name
          if (session.tuteeId) {
            try {
              const tuteeResponse = await tuteeService.getTuteeById(session.tuteeId);
              otherPersonName = `${tuteeResponse.firstName || ''} ${tuteeResponse.lastName || ''}`.trim();
              console.log('Tutee for tutor session:', tuteeResponse.firstName);
            } catch (err) {
              console.error('Error fetching tutee:', err);
              otherPersonName = 'Tutee';
            }
          } else {
            otherPersonName = 'Tutee';
          }
        } else {
          // For tutee, show tutor name
          if (session.tutorId) {
            try {
              const tutorResponse = await tutorService.getTutorById(session.tutorId);
              otherPersonName = `${tutorResponse.firstName || ''} ${tutorResponse.lastName || ''}`.trim();
              console.log('Tutor for tutee session:', tutorResponse.firstName);
            } catch (err) {
              console.error('Error fetching tutor:', err);
              otherPersonName = 'Tutor';
            }
          } else {
            otherPersonName = 'Tutor';
          }
        }

        const sessionData = {
          id: session.sessionId || session._id,
          subject: subjectName,
          otherPerson: otherPersonName,
          date: dateDisplay,
          status: (session.status || 'pending').toLowerCase(),
          tutorId: session.tutorId,
          tuteeId: session.tuteeId,
          rawSession: session
        };

        if (currentUser.type === 'TUTEE') {
          sessionData.tutor = otherPersonName;
        } else if (currentUser.type === 'TUTOR') {
          sessionData.tutee = otherPersonName;
        }

        return sessionData;
      } catch (error) {
        console.error('Error formatting session:', error, session);
        return null;
      }
    }));

    const validSessions = formattedSessions.filter(session => session !== null);
    
    setUpcomingSessions(validSessions);
    console.log('Final formatted sessions:', validSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    
    const mockSessions = currentUser?.type === 'TUTOR' 
      ? [
          {
            id: 1,
            subject: 'Mathematics',
            otherPerson: 'John Doe',
            tutee: 'John Doe',
            date: 'Today • 2:00 PM - 3:00 PM',
            status: 'pending',
            tutorId: currentUser.userId,
            tuteeId: 201
          },
          {
            id: 2,
            subject: 'Physics',
            otherPerson: 'Jane Smith',
            tutee: 'Jane Smith',
            date: 'Tomorrow • 10:00 AM - 11:30 AM',
            status: 'confirmed',
            tutorId: currentUser.userId,
            tuteeId: 202
          }
        ]
      : [
          {
            id: 1,
            subject: 'Mathematics',
            otherPerson: 'Alexander Binagatan',
            tutor: 'Alexander Binagatan',
            date: 'Today • 2:00 PM - 3:00 PM',
            status: 'confirmed',
            tutorId: 101,
            tuteeId: currentUser.userId
          },
          {
            id: 2,
            subject: 'Physics',
            otherPerson: 'Charry Mae Atamosa',
            tutor: 'Charry Mae Atamosa',
            date: 'Tomorrow • 10:00 AM - 11:30 AM',
            status: 'confirmed',
            tutorId: 102,
            tuteeId: currentUser.userId
          }
        ];
    
    setUpcomingSessions(mockSessions);
    setError('Using demo data. Real sessions will appear when connected to backend.');
  } finally {
    setLoadingSessions(false);
  }
};

const fetchAvailableTutors = async () => {
  setLoadingTutors(true);
  try {
    const response = await userAPI.getAllUsers();
    if (response.success) {
      const allTutors = response.users.filter(user => 
        user.type === 'TUTOR' && user.active === true
      );
      
      const tutorsWithSubjects = await Promise.all(
        allTutors.map(async (user) => {
          let tutorId = null;
          let tutorRating = '5.0';
          let subjects = [];
          
          try {
            // Get tutor record using userId
            const tutorResponse = await tutorService.getTutorByUserId(user.userId);
            tutorRating = tutorResponse.averageRating;
            // If response is an object with tutorId, use it directly
            if (tutorResponse && tutorResponse.tutorId) {
              tutorId = tutorResponse.tutorId;
            } else {
              // Otherwise, assume the response IS the tutor object
              tutorId = tutorResponse?.tutorId || null;
            }
            
            if (tutorId) {
              // Get subjects for this tutor
              const subjectsResponse = await tutorSubjectService.getSubjectsByTutorId(tutorId);
              subjects = subjectsResponse.subjects || subjectsResponse || [];
            }
          } catch (error) {
            console.error(`Error fetching tutor data for user ${user.userId}:`, error);
          }
          
          // Get primary subject
          const primarySubject = subjects.length > 0 
            ? subjects[0].subjectName || subjects[0].name || 'General'
            : user.major || 'General';
          
          return {
            id: user.userId,
            tutorId: tutorId,
            name: `${user.firstName} ${user.lastName}`,
            subject: primarySubject,
            allSubjects: subjects,
            rating: tutorRating,
            email: user.email,
            phone: user.phoneNumber,
            major: user.major,
            school: user.school,
            bio: user.bio
          };
        })
      );
      
      setAvailableTutors(tutorsWithSubjects);
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
    if (!currentUser?.userId) return;

    const response = await messageAPI.getUserConversations(currentUser.userId);
    
    if (response && Array.isArray(response)) {
      const formattedMessages = response.map(conversation => {
        // Get the other participant (not the current user)
        const participant = conversation.participant || {};
        
        // Format time
        const lastMessageTime = conversation.lastMessage?.timestamp;
        let timeDisplay = 'No messages';
        if (lastMessageTime) {
          const timeDiff = Math.floor((new Date() - new Date(lastMessageTime)) / (1000 * 60));
          
          if (timeDiff < 1) timeDisplay = 'Just now';
          else if (timeDiff < 60) timeDisplay = `${timeDiff}m ago`;
          else if (timeDiff < 1440) timeDisplay = `${Math.floor(timeDiff / 60)}h ago`;
          else timeDisplay = `${Math.floor(timeDiff / 1440)}d ago`;
        }

        return {
          id: conversation.conversationId,
          sender: participant.name || 'Unknown User',
          senderId: participant.userId,
          preview: conversation.lastMessage?.text?.substring(0, 50) + '...' || 'Start a conversation',
          time: timeDisplay,
          unread: conversation.unreadCount > 0,
          avatar: participant.avatar || 
            (participant.name ? getAvatarInitials(participant.name) : 'U')
        };
      });

      // Sort by unread first, then by timestamp
      const sortedMessages = formattedMessages.sort((a, b) => {
        if (a.unread && !b.unread) return -1;
        if (!a.unread && b.unread) return 1;
        return 0;
      });

      setMessages(sortedMessages);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    
    // Fallback to mock data
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
    // Use state instead of URL parameters
    navigate('/messages', { 
      state: { 
        selectedConversationId: message.id,
        senderName: message.sender
      } 
    });
  };

  const handleViewAllMessages = () => {
    navigate('/messages');
  };

  const handleViewAllTutors = () => {
    navigate('/tutors');
  };

  const handleLogout = () => {
    // if (window.confirm("Are you sure you want to logout?")) {
    //   authAPI.logout();
    //   navigate('/login');
    // }
    authAPI.logout();
    navigate('/login');
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <WelcomeBanner currentUser={currentUser} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Sessions
              sessions={upcomingSessions}
              loading={loadingSessions}
              onRefresh={handleRefreshSessions}
              onBookSession={handleBookSession}
              userType={currentUser.type}
              currentUserId={currentUser.userId}
            />
          </div>

          <div className="lg:col-span-1 space-y-8">
            <MessagesSection
              messages={messages}
              onMessageClick={handleMessageClick}
              onViewAll={handleViewAllMessages}
            />
            {currentUser.type === 'TUTEE' && (
            <AvailableTutors
              tutors={availableTutors}
              loading={loadingTutors}
              onBookSession={handleBookSession}
              onViewAll={handleViewAllTutors}
            />)}
          </div>
        </div>
      </main>

      <MobileBookButton onBookSession={handleBookSession} />
    </div>
  );
};

export default Dashboard;