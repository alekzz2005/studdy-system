import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen } from 'lucide-react';
import AuthLayout from '../layout/AuthLayout';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { authAPI } from '../../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authAPI.login(formData);
      console.log('Login successful:', response);
      // Handle successful login (redirect, store token, etc.)
      navigate('/'); // Redirect after successful login
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || error.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <AuthLayout 
      title="Welcome to Studdy" 
      subtitle="Learn together, grow together"
      icon={BookOpen}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          icon={Mail}
          label="Email Address"
          type="email"
          name="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <InputField
          icon={Lock}
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Forgot password?
          </a>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth={true} disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={handleSwitchToRegister}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            Create Account
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;