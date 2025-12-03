import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/auth/Login';
import RegisterPage from './components/auth/Register';
import Dashboard from './components/pages/Dashboard';
import BookTutor from './components/pages/BookTutor';
import Sessions from './components/pages/Sessions'; 
import Profile from './components/pages/Profile'; 

import './styles/index.css';

/*const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user; 
};*/

const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  console.log('User in localStorage:', user);
  console.log('Is authenticated:', !!user);
  return !!user; 
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page - Public route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes - temporarily remove PublicRoute */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes - temporarily remove ProtectedRoute */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-tutor" element={<BookTutor />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/profile" element={<Profile />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;