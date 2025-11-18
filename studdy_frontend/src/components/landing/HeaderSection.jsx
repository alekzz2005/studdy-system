import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

// Header Component
const Header = ({ onSignIn, onGetStarted }) => {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleSmoothScroll = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="/" className="logo" onClick={handleLogoClick}>Studdy</a>
          <nav>
            <ul>
              <li><a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')}>Features</a></li>
              <li><a href="#subjects" onClick={(e) => handleSmoothScroll(e, 'subjects')}>Subjects</a></li>
              <li><a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')}>How It Works</a></li>
            </ul>
          </nav>
          <div className="header-actions">
            <Button variant="outline" onClick={onSignIn}>Sign In</Button>
            <Button variant="primary" onClick={onGetStarted}>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;