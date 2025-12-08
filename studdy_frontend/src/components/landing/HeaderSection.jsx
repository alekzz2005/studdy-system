import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleFindTutors = (e) => {
    e.preventDefault();
    navigate('/tutors');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          <a 
            href="/" 
            className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors no-underline flex-shrink-0"
            onClick={handleLogoClick}
          >
            Studdy
          </a>
          
          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <a 
              href="#features" 
              onClick={(e) => handleSmoothScroll(e, 'features')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors no-underline text-sm"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors no-underline text-sm"
            >
              How It Works
            </a>
            <a 
              href="/tutors" 
              onClick={handleFindTutors}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors no-underline text-sm"
            >
              Find Tutors
            </a>
          </nav>

          {/* Buttons on the right */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button
              onClick={onSignIn}
              className="px-6 py-2.5 border border-green-600 text-green-600 hover:bg-green-50 rounded-lg font-medium text-sm transition-colors"
            >
              Sign In
            </button>
            
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium text-sm transition-colors shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;