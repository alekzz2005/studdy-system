import React from 'react';
import { useState, useEffect } from 'react';
import { userAPI } from '../../services/user';

const WelcomeBanner = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('Current token in localStorage:', localStorage.getItem('authToken'));
  
    // Manually test the request
    const testRequest = async () => {
      const token = localStorage.getItem('authToken');
      console.log('Token to send:', token);
      
      try {
        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': token
          }
        });
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    
    testRequest();

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

  if (loading) {
    return (
      <div className="welcome-banner">
        <h1>Loading...</h1>
      </div>
    );
  }

  // Get user name safely
  const getUserName = () => {
    if (!currentUser) return 'Student';
    if (currentUser.firstName) return currentUser.firstName;
    if (currentUser.lastName) return currentUser.lastName;
    return 'Student';
  };

  const userName = getUserName();
  
  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const upcomingSessionsCount = 2;

  return (
    <div className="welcome-banner">
      <h1>{getGreeting()}, {userName}!</h1>
      <p>You have {upcomingSessionsCount} upcoming session(s). Ready to learn?</p>
    </div>
  );
};

export default WelcomeBanner;