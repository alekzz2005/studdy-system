import React, { useState } from 'react';
import LoginPage from './components/auth/Login';
import RegisterPage from './components/auth/Register';
import './styles/index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <div>
      {currentPage === 'login' ? (
        <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />
      ) : (
        <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />
      )}
    </div>
  );
}

export default App;