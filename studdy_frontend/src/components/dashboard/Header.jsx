import React from 'react';
import Button from './common/Button';

const Header = ({ onBookSession }) => {
  const menuItems = ['Home', 'My Sessions', 'Profile'];

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">Studdy</div>
          <nav className="header-nav">
            {menuItems.map((item) => (
              <div key={item} className="nav-item">
                {item}
              </div>
            ))}
          </nav>
        </div>

        <div className="header-right">
          <Button 
            variant="outline" 
            onClick={onBookSession}
            className="book-session-btn"
          >
            Book a session
          </Button>
          
          <div className="header-icons">
            {/* Notification, Messages, Profile icons would go here */}
            <i className="fas fa-bell"></i>
            <i className="fas fa-comments"></i>
            <i className="fas fa-user-circle"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;