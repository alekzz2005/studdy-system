import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  icon: Icon = BookOpen,
  size = 'md'
}) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className={size === 'lg' ? 'auth-card-large' : 'auth-card'}>
        <div className="auth-header">
          <div className="auth-icon">
            <Icon className="text-white" size={32} />
          </div>
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>
        
        {children}

        {/* Minimal back link at the bottom */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBackToHome}
            className="text-gray-500 hover:text-green-600 text-xs transition-colors"
          >
            ← Return to Studdy Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;