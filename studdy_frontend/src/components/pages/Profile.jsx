import React, { useState } from 'react';
import './styles/Profile.css';
import Sidebar from '../dashboard/Sidebar';

const Profile = () => {
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

  const [userData, setUserData] = useState({
    firstName: "Charry Mae",
    lastName: "Atamosa",
    phone: "+63 929 4132 332",
    location: "",
    dob: "06/21/2005",
    bio: "",
    university: "",
    gradeLevel: "",
    major: "",
    learningGoals: ""
  });

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = () => {
    alert("Change password functionality would go here");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion functionality would go here");
    }
  };

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">Studdy</h1>
            <nav className="nav-links">
              <button className="nav-link">Home</button>
              <button className="nav-link">My Sessions</button>
              <button className="nav-link active">Profile</button>
            </nav>
          </div>
          <div className="header-right">
            <button className="btn-book">Book a session</button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar */}
        <Sidebar activePage="Account Settings" />

        {/* Main Content */}
        <main className="main-content">
          <div className="content-wrapper">
            {/* Header Section */}
            <div className="profile-header">
              <h2>My Profile</h2>
              <p>Manage your personal information and preferences</p>
            </div>

            <div className="profile-grid">
              {/* Profile Card */}
              <div className="profile-card">
                <div className="avatar"></div>
                <h3>Charry Mae Atamosa</h3>
                <p className="role">Tutor</p>
                <button className="btn-edit-profile">Edit Profile</button>

                <div className="progress-stats">
                  <h4>Learning Progress</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span>Sessions Completed</span>
                      <span className="stat-value">48</span>
                    </div>
                    <div className="stat-item">
                      <span>Hours Studied</span>
                      <span className="stat-value">48h</span>
                    </div>
                    <div className="stat-item">
                      <span>Average Rating</span>
                      <span className="stat-value">4.8 ⭐</span>
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
                      <input 
                        type="text" 
                        value={userData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input 
                        type="text" 
                        value={userData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        value={userData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input 
                        type="text" 
                        value={userData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Location</label>
                      <input 
                        type="text" 
                        placeholder="Enter your location"
                        value={userData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Bio</label>
                      <textarea 
                        placeholder="Tell us about yourself"
                        value={userData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="info-card">
                  <h4>Academic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>University/School</label>
                      <input 
                        type="text" 
                        placeholder="Enter your institution"
                        value={userData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Grade Level</label>
                      <input 
                        type="text" 
                        placeholder="Enter your grade level"
                        value={userData.gradeLevel}
                        onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Major/Field of Study</label>
                      <input 
                        type="text" 
                        placeholder="Enter your major"
                        value={userData.major}
                        onChange={(e) => handleInputChange('major', e.target.value)}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Learning Goals</label>
                      <textarea 
                        placeholder="What are your learning goals?"
                        value={userData.learningGoals}
                        onChange={(e) => handleInputChange('learningGoals', e.target.value)}
                        rows="3"
                      />
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
                    <button className="btn-change-password" onClick={handleChangePassword}>
                      Change Password
                    </button>
                    <button className="btn-delete-account" onClick={handleDeleteAccount}>
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