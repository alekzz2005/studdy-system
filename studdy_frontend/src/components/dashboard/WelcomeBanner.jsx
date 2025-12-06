import React from 'react';
import { userService } from '../../services/UserService';

const WelcomeBanner = () => {
  const user = userService.getCurrentUser() || {};
  const userName = user.firstName || user.name || 'Student';
  
  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // You could also fetch upcoming sessions count from API
  const upcomingSessionsCount = 2; // This could come from your data

  return (
    <div className="welcome-banner">
      <h1>{getGreeting()}, {userName}!</h1>
      <p>You have {upcomingSessionsCount} upcoming session(s). Ready to learn?</p>
      {user.role === 'Tutor' && (
        <div className="tutor-badge">
          <i className="fas fa-chalkboard-teacher"></i>
          <span>Tutor Account</span>
        </div>
      )}
    </div>
  );
};

export default WelcomeBanner;