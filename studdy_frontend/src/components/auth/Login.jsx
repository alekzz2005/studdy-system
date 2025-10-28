import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { userAPI } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get success message from registration redirect
  const successMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Get all users to find matching credentials
      const users = await userAPI.getAllUsers();
      
      // Find user with matching email and phone number
      const user = users.find(u => 
        u.email === formData.email && u.phoneNumber === formData.phoneNumber
      );

      if (user) {
        // Store user data in localStorage (in a real app, you'd use proper auth tokens)
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Login successful:', user);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setErrors({ submit: 'Invalid email or phone number' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue your learning journey"
    >
      {successMessage && (
        <div style={{
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
          required
        />

        <InputField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter your phone number"
          error={errors.phoneNumber}
          required
        />

        {errors.submit && (
          <div className="error-message" style={{ textAlign: 'center' }}>
            {errors.submit}
          </div>
        )}

        <div className="form-actions">
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>

        <div className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create one here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;