import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/auth/Login';
import RegisterPage from './components/auth/Register';
import Dashboard from './components/pages/Dashboard';
import BookTutor from './components/pages/BookTutor';
import Sessions from './components/pages/Sessions'; 
import Profile from './components/pages/Profile'; 
import MessagesPage from './components/pages/MessagesPage';

import './styles/index.css';

const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
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

          <Route path="/login" element={ <LoginPage /> } />
          <Route path="/register" element={ <RegisterPage /> } />

          <Route path="/dashboard" element={ <Dashboard /> } />
          <Route path="/book-tutor" element={ <BookTutor /> } />
          <Route path="/sessions" element={ <Sessions /> } />
          <Route path="/profile" element={ <Profile /> } />
          <Route path="/messages" element={ <MessagesPage /> } />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;