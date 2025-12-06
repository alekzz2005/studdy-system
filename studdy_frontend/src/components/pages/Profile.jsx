import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';
import './styles/Profile.css';
import Sidebar from '../dashboard/Sidebar';
import { userService } from 'C:/Users/John Anthony/studdy-system/studdy_frontend/src/services/UserService.jsx';

const Profile = () => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get user data from userService
  const user = userService.getCurrentUser() || {};
  
  const [userData] = useState({
    firstName: user.firstName || user.name?.split(' ')[0] || "User",
    lastName: user.lastName || user.name?.split(' ')[1] || "",
    email: user.email || "No email provided",
    phoneNumber: user.phoneNumber || "Not provided",
    address: user.address || "Not provided",
    dateOfBirth: user.dateOfBirth || "Not provided",
    bio: user.bio || "No bio provided",
    school: user.school || "Not provided",
    gradeLevel: user.gradeLevel || "Not specified",
    major: user.major || "Not specified",
    goals: user.goals || "No goals set",
    avatar: user.avatar || "",
    role: user.role || "Student",
    stats: user.stats || {
      sessionsCompleted: 0,
      hoursStudied: 0,
      averageRating: 0
    }
  });

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not provided") return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone || phone === "Not provided") return phone;
    return phone;
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.\n\nAll your data will be permanently deleted from our database.")) {
      return;
    }

    setIsDeleting(true);
    try {
      // Delete from database
      const result = await userService.deleteAccount();
      
      alert('Your account has been successfully deleted from our database.');
      navigate('/login');
      
    } catch (error) {
      console.error('Error deleting account from database:', error);
      
      // Ask if user wants to delete from localStorage only
      const shouldDeleteLocal = window.confirm(
        `Failed to delete account from database: ${error.message}\n\n` +
        'Would you like to remove your account data from this device only?'
      );
      
      if (shouldDeleteLocal) {
        try {
          userService.deleteAccountLocal();
          alert('Account data removed from this device.');
          navigate('/login');
        } catch (localError) {
          alert('Failed to remove local data: ' + localError.message);
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      userService.clearUser();
      navigate('/login');
    }
  };

  const handleBookSession = () => {
    navigate('/book-tutor');
  };

  // Get initials for avatar placeholder
  const getInitials = () => {
    const first = userData.firstName?.charAt(0) || '';
    const last = userData.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

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
                      {getInitials() || 'U'}
                    </div>
                  )}
                </div>
                <h3>{userData.firstName} {userData.lastName}</h3>
                <p className="role">{userData.role}</p>
                <p className="email">{userData.email}</p>

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
                        {userData.firstName}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <div className="readonly-field">
                        {userData.lastName}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <div className="readonly-field">
                        {userData.email}
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
                        {userData.address}
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Bio</label>
                      <div className="readonly-field bio-text">
                        {userData.bio}
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
                        {userData.school}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Grade Level</label>
                      <div className="readonly-field">
                        {userData.gradeLevel}
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Major/Field of Study</label>
                      <div className="readonly-field">
                        {userData.major}
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Learning Goals</label>
                      <div className="readonly-field bio-text">
                        {userData.goals}
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
                      className="btn-logout" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                    <button 
                      className="btn-delete-account" 
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
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