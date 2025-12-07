import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';
import './styles/Profile.css';
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

      <main className="main-content-full">
        <div className="content-wrapper">
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>View your personal information and preferences</p>
          </div>

          <div className="profile-content">
            {/* Profile Overview Card */}
            <div className="profile-overview">
              <div className="avatar-section">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Profile" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder-large">
                    {getInitials()}
                  </div>
                )}
                <div className="user-info">
                  <h2>{userData.firstName || ''} {userData.lastName || ''}</h2>
                  <p className="role">{userData.type || 'User'}</p>
                  <p className="email">{userData.email || 'No email'}</p>
                </div>
              </div>

              <div className="quick-stats">
                <h3>Learning Progress</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Sessions Completed</div>
                    <div className="stat-value">
                      {userData.stats?.sessionsCompleted || 0}
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Hours Studied</div>
                    <div className="stat-value">
                      {userData.stats?.hoursStudied || 0}h
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Average Rating</div>
                    <div className="stat-value">
                      {userData.stats?.averageRating ? `${userData.stats.averageRating} ⭐` : 'No ratings'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Sections */}
            <div className="info-sections">
              {/* Personal Information */}
              <div className="info-section-card">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>First Name</label>
                    <div className="info-value">
                      {userData.firstName || 'Not provided'}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Last Name</label>
                    <div className="info-value">
                      {userData.lastName || 'Not provided'}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <div className="info-value">
                      {userData.email || 'Not provided'}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Phone Number</label>
                    <div className="info-value">
                      {formatPhone(userData.phoneNumber)}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Date of Birth</label>
                    <div className="info-value">
                      {formatDate(userData.dateOfBirth)}
                    </div>
                  </div>
                  <div className="info-item full-width">
                    <label>Address</label>
                    <div className="info-value">
                      {userData.address || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="info-section-card">
                <h3>Academic Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>School</label>
                    <div className="info-value">
                      {userData.school || 'Not provided'}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Grade Level</label>
                    <div className="info-value">
                      {userData.gradeLevel || 'Not provided'}
                    </div>
                  </div>
                  <div className="info-item full-width">
                    <label>Major/Field of Study</label>
                    <div className="info-value">
                      {userData.major || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="info-section-card">
                <h3>Account Settings</h3>
                <div className="account-actions-grid">
                  <button 
                    className="btn-action btn-primary" 
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </button>
                  <button 
                    className="btn-action btn-secondary" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  <button 
                    className="btn-action btn-danger" 
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
  );
};

export default Profile;