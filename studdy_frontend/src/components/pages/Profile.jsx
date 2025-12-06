import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';
import './styles/Profile.css';
import Sidebar from '../dashboard/Sidebar';
import { userAPI, userHelpers } from '../../services/user';
import { authAPI } from '../../services/auth';

const Profile = () => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
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

  const [notificationSettings, setNotificationSettings] = useState({
    upcomingSessions: true,
    tutorMessages: true,
    newsletter: false
  });

  const toggleNotification = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not provided") return '';
    return dateString;
  };

  const formatPhone = (phone) => {
    return phone || "Not provided";
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleDeleteAccount = async () => {
    if (!currentUser?.userId) return;
    
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await userAPI.deleteUser(currentUser.userId);
      if (result.success) {
        authAPI.logout();
        alert('Account deleted successfully.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      authAPI.logout();
      navigate('/login');
    }
  };

  const handleBookSession = () => {
    navigate('/book-tutor');
  };

  const getInitials = () => {
    if (!currentUser) return 'U';
    const first = currentUser.firstName?.charAt(0) || '';
    const last = currentUser.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  const userData = currentUser || {};

  return (
    <div className="profile-container">
      <Header onBookSession={handleBookSession} />

      <div className="main-layout">
        <Sidebar activePage="Account Settings" />

        <main className="main-content">
          <div className="content-wrapper">
            <div className="profile-header">
              <h2>My Profile</h2>
              <p>View your personal information and preferences</p>
            </div>

            <div className="profile-grid">
              {/* Profile Card */}
              <div className="profile-card">
                <div className="avatar">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="Profile" className="avatar-image" />
                  ) : (
                    <div className="avatar-placeholder">
                      {getInitials()}
                    </div>
                  )}
                </div>
                <h3>{userData.firstName || ''} {userData.lastName || ''}</h3>
                <p className="role">{userData.type || 'User'}</p>
                <p className="email">{userData.email || 'No email'}</p>

                <div className="progress-stats">
                  <h4>Learning Progress</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span>Sessions Completed</span>
                      <span className="stat-value">
                        {userData.stats?.sessionsCompleted || 0}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span>Hours Studied</span>
                      <span className="stat-value">
                        {userData.stats?.hoursStudied || 0}h
                      </span>
                    </div>
                    <div className="stat-item">
                      <span>Average Rating</span>
                      <span className="stat-value">
                        {userData.stats?.averageRating ? `${userData.stats.averageRating} ⭐` : 'No ratings'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Section */}
              <div className="info-section">
                {/* Personal Information */}
                <div className="info-card">
                  <h4>Personal Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name</label>
                      <div className="readonly-field">
                        {userData.firstName || 'Not provided'}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <div className="readonly-field">
                        {userData.lastName || 'Not provided'}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <div className="readonly-field">
                        {userData.email || 'Not provided'}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <div className="readonly-field">
                        {formatPhone(userData.phoneNumber)}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <div className="readonly-field">
                        {formatDate(userData.dateOfBirth)}
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Address</label>
                      <div className="readonly-field">
                        {userData.address || 'Not provided'}
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Bio</label>
                      <div className="readonly-field bio-text">
                        {userData.bio || 'No bio provided'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="info-card">
                  <h4>Academic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>School</label>
                      <div className="readonly-field">
                        {userData.school || 'Not provided'}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Grade Level</label>
                      <div className="readonly-field">
                        {userData.gradeLevel || 'Not provided'}
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Major/Field of Study</label>
                      <div className="readonly-field">
                        {userData.major || 'Not provided'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="info-card">
                  <h4>Notification Preferences</h4>
                  <div className="notification-list">
                    <div className="notification-item">
                      <div>
                        <p className="notification-title">Upcoming Sessions</p>
                        <p className="notification-desc">Get reminders for upcoming tutoring sessions</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.upcomingSessions}
                          onChange={() => toggleNotification('upcomingSessions')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="notification-item">
                      <div>
                        <p className="notification-title">Tutor Messages</p>
                        <p className="notification-desc">Receive messages from your tutors</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.tutorMessages}
                          onChange={() => toggleNotification('tutorMessages')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="notification-item">
                      <div>
                        <p className="notification-title">Newsletter</p>
                        <p className="notification-desc">Subscribe to our weekly newsletter</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.newsletter}
                          onChange={() => toggleNotification('newsletter')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="info-card">
                  <h4>Account Settings</h4>
                  <div className="account-actions">
                    <button 
                      className="btn-change-password" 
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </button>
                    <button 
                      className="btn-delete-account" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                    <button 
                      className="btn-delete-account" 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;