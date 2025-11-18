import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';
import Sidebar from '../dashboard/Sidebar';
import WelcomeBanner from '../dashboard/WelcomeBanner';
import SessionCard from '../dashboard/SessionCard';
import TutorCard from '../dashboard/TutorCard';
import StatsCard from '../dashboard/StatsCard';
import ProgressBar from '../dashboard/ProgressBar';
import './styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock data
  const upcomingSessions = [
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

  const studyStats = [
    { label: 'Sessions Completed', value: '20' },
    { label: 'Hours Studied', value: '20' },
    { label: 'Average Rating', value: '4.8' }
  ];

  const handleBookSession = () => {
    navigate('/book-tutor');
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
              {/* Upcoming Sessions */}
              <div className="dashboard-section">
                <div className="section-header">
                  <div className="section-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="section-title">
                    <h3>Upcoming Sessions</h3>
                    <p>Your scheduled tutoring sessions</p>
                  </div>
                </div>
                
                <div className="sessions-list">
                  {upcomingSessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>

              {/* Available Tutors */}
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
                  <button className="btn-outline">View All Tutors</button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="dashboard-right">
              {/* Stats Cards */}
              <div className="dashboard-section">
                <h3 className="section-title">This Month</h3>
                <div className="stats-cards">
                  {studyStats.map((stat, index) => (
                    <StatsCard key={index} stat={stat} />
                  ))}
                </div>
              </div>

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