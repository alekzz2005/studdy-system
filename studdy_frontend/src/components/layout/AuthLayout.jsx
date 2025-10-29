import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  icon: Icon = BookOpen,
  size = 'md'
}) => {
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
      </div>
    </div>
  );
};

export default AuthLayout;