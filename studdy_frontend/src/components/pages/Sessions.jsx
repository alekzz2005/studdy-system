import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  User,
  Home,
  Settings,
  Bell,
  MessageCircle,
  Search
} from 'lucide-react';
import './styles/Sessions.css';

const Sessions = () => {
  const navigate = useNavigate();
  // Hardcoded data - backend friendly structure
  const stats = [
    { id: 1, label: 'Total Sessions', value: '4', icon: Calendar, color: '#1F2937' },
    { id: 2, label: 'Different Subjects', value: '4', icon: BookOpen, color: '#1F2937' },
    { id: 3, label: 'Unique Tutors', value: '4', icon: Users, color: '#1F2937' }
  ];

  const filterTabs = [
    { id: 'live', label: '1 Live', count: 1, color: '#16A34A' },
    { id: 'upcoming', label: '2 Upcoming', count: 2, color: '#2563EB' },
    { id: 'history', label: 'View History (1)', count: 1, color: '#000000' }
  ];

  const liveSessions = [
    {
      id: 1,
      tutorName: 'Charry Mae Atamosa',
      role: 'Tutor',
      subject: 'Physical Development - Modern Dance',
      date: 'Today',
      time: '3:00 PM - 5:00 PM',
      location: 'Gym',
      status: 'ongoing',
      statusText: 'In progress',
      joinable: true
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      tutorName: 'Alexander Jr. Binagatan',
      role: 'Tutor',
      subject: "Rizal's Life and Stories",
      date: 'Tomorrow',
      time: '12:00 PM - 1:30 PM',
      location: 'Gle - 306',
      status: 'upcoming'
    },
    {
      id: 2,
      tutorName: 'John Anthony Besañez',
      role: 'Tutor',
      subject: 'App Development',
      date: 'Wednesday',
      time: '8:00 AM - 10:00 AM',
      location: 'Caseroom',
      status: 'upcoming'
    }
  ];

  const quickActions = [
    { id: 1, label: 'Book Tutor', icon: Search, active: false },
    { id: 2, label: 'Session History', icon: Calendar, active: true },
    { id: 3, label: 'Account Settings', icon: Settings, active: false }
  ];

  const handleBookSession = () => {
    navigate('/book-tutor');
  };

  return (
    <div className="sessions-container">
      {/* Header */}
      <Header onBookSession={handleBookSession} />

      <div className="main-layout-wrapper">
        {/* Full-height Sidebar */}
        <div className="sidebar-full-height">
          <aside className="sidebar">
            <h2 className="sidebar-title">Quick Actions</h2>
            <div className="quick-actions">
              {quickActions.map(action => (
                <button 
                  key={action.id} 
                  className={`action-btn ${action.active ? 'active' : ''}`}
                >
                  <action.icon size={16} />
                  {action.label}
                </button>
              ))}
            </div>
          </aside>
        </div>

        {/* Main Content Area */}
        <main className="content-full-height">
          {/* Page Header */}
          <section className="page-header">
            <h1 className="page-title">My Sessions</h1>
            <p className="page-subtitle">Manage your peer learning sessions</p>
          </section>

          {/* Filter Tabs */}
          <section className="filter-tabs">
            {filterTabs.map(tab => (
              <button key={tab.id} className="filter-tab">
                <div 
                  className="tab-indicator" 
                  style={{ backgroundColor: tab.color }}
                ></div>
                {tab.label}
              </button>
            ))}
          </section>

          {/* Stats Cards */}
          <section className="stats-section">
            {stats.map(stat => (
              <div key={stat.id} className="stat-card">
                <div className="stat-content">
                  <stat.icon size={16} className="stat-icon" />
                  <span className="stat-value">{stat.value}</span>
                </div>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Live Sessions */}
          <section className="sessions-section">
            <div className="section-header">
              <div className="live-indicator"></div>
              <h2 className="section-title">Live Sessions</h2>
            </div>
            <div className="sessions-grid">
              {liveSessions.map(session => (
                <SessionCard key={session.id} session={session} type="live" />
              ))}
            </div>
          </section>

          {/* Upcoming Sessions */}
          <section className="sessions-section">
            <div className="section-header">
              <div className="upcoming-indicator"></div>
              <h2 className="section-title">Upcoming Sessions</h2>
            </div>
            <div className="sessions-grid two-column">
              {upcomingSessions.map(session => (
                <SessionCard key={session.id} session={session} type="upcoming" />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

// Session Card Component
const SessionCard = ({ session, type }) => {
  return (
    <div className={`session-card ${type}`}>
      <div className="session-header">
        <div className="tutor-avatar">
          <User size={16} />
        </div>
        <div className="session-info">
          <div className="tutor-info">
            <Calendar size={16} />
            <h3 className="tutor-name">{session.tutorName}</h3>
            <span className={`status-badge ${session.status}`}>
              {session.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
            </span>
          </div>
          <p className="tutor-role">{session.role}</p>
        </div>
      </div>

      <h4 className="session-subject">{session.subject}</h4>

      <div className="session-details">
        <div className="detail-row">
          <Clock size={14} />
          <span className="detail-text">{session.date}</span>
          <Clock size={14} />
          <span className="detail-text">{session.time}</span>
        </div>
        <div className="detail-row">
          <MapPin size={14} />
          <span className="detail-text">{session.location}</span>
        </div>
      </div>

      <div className="session-footer">
        {type === 'live' && session.joinable && (
          <>
            <div className="status-indicator">
              <div className="live-dot"></div>
              <span className="status-text">{session.statusText}</span>
            </div>
            <button className="join-btn">Join Session</button>
          </>
        )}
        {type === 'upcoming' && (
          <>
            <span className="starting-soon">Starting soon</span>
            <button className="view-details-btn">View Details</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sessions;