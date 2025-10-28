import React from 'react';
import Card from '../common/Card';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Studdy</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {title && <h2 style={{ marginTop: '1rem', color: '#1E293B' }}>{title}</h2>}
        </div>
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;