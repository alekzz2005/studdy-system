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

          <Route path="/login" element={ <PublicRoute> <LoginPage /> </PublicRoute>} />
          <Route path="/register" element={ <PublicRoute> <RegisterPage /> </PublicRoute>} />

          <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
          <Route path="/book-tutor" element={<ProtectedRoute> <BookTutor /> </ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute> <Sessions /> </ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;