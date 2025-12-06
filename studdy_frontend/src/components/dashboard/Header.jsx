import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';

const Header = ({ onBookSession }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'My Sessions', path: '/sessions' },
    { label: 'Profile', path: '/profile' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleBookSession = () => {
    // If onBookSession prop is provided, use it
    // Otherwise, navigate to book-tutor page
    if (onBookSession) {
      onBookSession();
    } else {
      navigate('/book-tutor');
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            Studdy
          </div>
          <nav className="header-nav">
            {menuItems.map((item) => (
              <div 
                key={item.label} 
                className="nav-item"
                onClick={() => handleNavigation(item.path)}
                style={{ 
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {item.label}
              </div>
            ))}
          </nav>
        </div>

        <div className="header-right">
          <Button 
            variant="outline" 
            onClick={handleBookSession}
            className="book-session-btn"
          >
            Book a session
          </Button>
          
          <div className="header-icons">
            {/* Notification icon */}
            <i 
              className="fas fa-bell" 
              style={{ cursor: 'pointer', marginRight: '20px' }}
              onClick={() => console.log('Notifications clicked')}
            ></i>
            
            {/* Messages icon */}
            <i 
              className="fas fa-comments" 
              style={{ cursor: 'pointer', marginRight: '20px' }}
              onClick={() => console.log('Messages clicked')}
            ></i>
            
            {/* Profile icon - navigate to profile */}
            <i 
              className="fas fa-user-circle" 
              style={{ 
                cursor: 'pointer', 
                fontSize: '24px',
                color: '#4a90e2'
              }}
              onClick={() => navigate('/profile')}
            ></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;