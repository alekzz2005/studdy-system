import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/auth/Login';
import RegisterPage from './components/auth/Register';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page - Public route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;