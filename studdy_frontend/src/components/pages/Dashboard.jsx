import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';
import Sidebar from '../dashboard/Sidebar';
import WelcomeBanner from '../dashboard/WelcomeBanner';
import SessionCard from '../dashboard/SessionCard';
import TutorCard from '../dashboard/TutorCard';
import StatsCard from '../dashboard/StatsCard';
import ProgressBar from '../dashboard/ProgressBar';
import './styles/Dashboard.css';
import { userAPI } from '../../services/user';
import { sessionService } from '../../services/session';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userAPI.getCurrentUser();
        if (response.success) {
          setCurrentUser(response.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);
  
  
  // State for upcoming sessions
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Fetch upcoming sessions on component mount
  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      setLoadingSessions(true);
      // Fetch real upcoming sessions from the session service
      const sessions = await sessionService.getUpcomingSessions();
      
      // Transform the data to match your SessionCard component format
      const formattedSessions = sessions.map(session => ({
        id: session.sessionId,
        subject: session.subject?.name || 'General',
        tutor: session.tutor?.name || 'Tutor',
        date: formatSessionDate(session.sessionDate, session.startTime, session.endTime),
        status: mapSessionStatus(session.status)
      }));
      
      setUpcomingSessions(formattedSessions);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      // Fallback to mock data if API fails
      setUpcomingSessions(getMockUpcomingSessions());
    } finally {
      setLoadingSessions(false);
    }
  };

  // Helper function to format session date and time
  const formatSessionDate = (dateString, startTime, endTime) => {
    if (!dateString) return 'Date not set';
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const sessionDate = new Date(dateString);
    const formattedDate = sessionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Check if session is today, tomorrow, or another day
    const isToday = sessionDate.toDateString() === today.toDateString();
    const isTomorrow = sessionDate.toDateString() === tomorrow.toDateString();
    
    let dayPrefix = '';
    if (isToday) dayPrefix = 'Today • ';
    else if (isTomorrow) dayPrefix = 'Tomorrow • ';
    else dayPrefix = `${formattedDate} • `;
    
    // Format time
    const formatTime = (time) => {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };
    
    const startFormatted = formatTime(startTime);
    const endFormatted = formatTime(endTime);
    
    return `${dayPrefix}${startFormatted} - ${endFormatted}`;
  };

  // Helper function to map API status to frontend status
  const mapSessionStatus = (apiStatus) => {
    const statusMap = {
      'SCHEDULED': 'confirmed',
      'CONFIRMED': 'confirmed',
      'PENDING': 'pending',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled'
    };
    return statusMap[apiStatus] || 'pending';
  };

  // Mock data fallback
  const getMockUpcomingSessions = () => {
    return [
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
  };

  const availableTutors = [
    { id: 1, name: 'Alex Rodriguez', subject: 'Computer Science', rating: '4.9' },
    { id: 2, name: 'Lisa Wang', subject: 'Mathematics', rating: '4.7' },
    { id: 3, name: 'James Smith', subject: 'Biology', rating: '4.8' },
    { id: 4, name: 'Maria Garcia', subject: 'Spanish', rating: '4.5' }
  ];

  const studyProgress = [
    { subject: 'Mathematics', percentage: 85 },
    { subject: 'Physics', percentage: 72 },
    { subject: 'Chemistry', percentage: 90 }
  ];

  const handleBookSession = () => {
    navigate('/book-tutor');
  };

  const handleViewAllTutors = () => {
    navigate('/book-tutor');
  };

  const handleRefreshSessions = () => {
    fetchUpcomingSessions();
  };

  return (
    <div className="dashboard">
      <Header onBookSession={handleBookSession} />
      
      <div className="dashboard-content">
        <Sidebar />
        
        <div className="dashboard-main">
          <WelcomeBanner />
          
          <div className="dashboard-grid">
            {/* Left Column */}
            <div className="dashboard-left">
              {/* Upcoming Sessions - UPDATED WITH REAL DATA */}
              <div className="dashboard-section">
                <div className="section-header">
                  <div className="section-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="section-title">
                    <h3>Upcoming Sessions</h3>
                    <p>Your scheduled tutoring sessions</p>
                  </div>
                  <button 
                    className="refresh-btn"
                    onClick={handleRefreshSessions}
                    disabled={loadingSessions}
                    title="Refresh sessions"
                  >
                    <i className={`fas fa-sync ${loadingSessions ? 'fa-spin' : ''}`}></i>
                  </button>
                </div>
                
                {loadingSessions ? (
                  <div className="loading-sessions">
                    <div className="loading-spinner"></div>
                    <p>Loading your sessions...</p>
                  </div>
                ) : upcomingSessions.length > 0 ? (
                  <div className="sessions-list">
                    {upcomingSessions.map(session => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                ) : (
                  <div className="no-sessions">
                    <div className="no-sessions-icon">
                      <i className="far fa-calendar-times"></i>
                    </div>
                    <p>No upcoming sessions scheduled</p>
                    <button 
                      className="btn-book-now"
                      onClick={handleBookSession}
                    >
                      <i className="fas fa-calendar-plus"></i>
                      Book Your First Session
                    </button>
                  </div>
                )}
              </div>

              {/* Available Tutors (unchanged) */}
              <div className="dashboard-section">
                <div className="section-header">
                  <div className="section-title">
                    <h3>Available Tutors</h3>
                    <p>Find and book tutors for your subjects</p>
                  </div>
                </div>
                
                <div className="tutors-grid">
                  {availableTutors.map(tutor => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>
                
                <div className="view-all-container">
                  <button className="btn-outline" onClick={handleViewAllTutors}>
                    View All Tutors
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (unchanged) */}
            <div className="dashboard-right">
              {/* Stats Cards */}
              

              {/* Study Progress */}
              <div className="dashboard-section">
                <h3 className="section-title">Study Progress</h3>
                <div className="progress-list">
                  {studyProgress.map((progress, index) => (
                    <ProgressBar 
                      key={index}
                      label={progress.subject}
                      percentage={progress.percentage}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;