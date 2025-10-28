import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { userAPI } from '../../services/api';
import { FORM_VALIDATION } from '../../utils/constants';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    bio: '',
    school: '',
    gradeLevel: '',
    major: '',
    learningGoals: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert middle initial to uppercase
    let processedValue = value;
    if (name === 'middleInitial') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear confirm password error when either password changes
    if ((name === 'password' || name === 'confirmPassword') && errors.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!FORM_VALIDATION.NAME.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!FORM_VALIDATION.NAME.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!FORM_VALIDATION.EMAIL.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!FORM_VALIDATION.PHONE.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < FORM_VALIDATION.MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${FORM_VALIDATION.MIN_PASSWORD_LENGTH} characters`;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.school.trim()) {
      newErrors.school = 'School is required';
    }

    if (!formData.gradeLevel) {
      newErrors.gradeLevel = 'Grade level is required';
    } else if (formData.gradeLevel < 1 || formData.gradeLevel > 12) {
      newErrors.gradeLevel = 'Grade level must be between 1 and 12';
    }

    // Optional field validation
    if (formData.middleInitial && formData.middleInitial.length > 1) {
      newErrors.middleInitial = 'Middle initial should be one character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare user data for backend
      const userData = {
        firstName: formData.firstName.trim(),
        middleInitial: formData.middleInitial || ' ',
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password, // Add password to backend data
        address: formData.address.trim(),
        bio: formData.bio.trim(),
        school: formData.school.trim(),
        gradeLevel: parseInt(formData.gradeLevel),
        major: formData.major.trim(),
        learningGoals: formData.learningGoals.trim(),
        sessionsCompleted: 0,
        hoursStudied: 0,
        hoursTutored: 0,
        averageRating: 0.0
      };

      console.log('Sending registration data:', userData);
      const response = await userAPI.register(userData);
      console.log('Registration successful:', response);
      
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your email and phone number.',
          registeredEmail: formData.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        // Backend returned an error response
        errorMessage = error.response.data || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Your Account" 
      subtitle="Join Studdy and start your peer-to-peer learning journey"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            error={errors.firstName}
            required
            autoFocus
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            error={errors.lastName}
            required
          />
        </div>

        <InputField
          label="Middle Initial"
          name="middleInitial"
          value={formData.middleInitial}
          onChange={handleChange}
          placeholder="M"
          error={errors.middleInitial}
          maxLength="1"
        />

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            error={errors.password}
            required
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            required
          />
        </div>

        <InputField
          label="School"
          name="school"
          value={formData.school}
          onChange={handleChange}
          placeholder="Enter your school"
          error={errors.school}
          required
        />

        <InputField
          label="Grade Level"
          type="number"
          name="gradeLevel"
          value={formData.gradeLevel}
          onChange={handleChange}
          placeholder="Enter your grade level (1-12)"
          error={errors.gradeLevel}
          min="1"
          max="12"
          required
        />

        <InputField
          label="Major/Field of Study"
          name="major"
          value={formData.major}
          onChange={handleChange}
          placeholder="Enter your major or field of study"
          error={errors.major}
        />

        <InputField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
          error={errors.address}
        />

        <InputField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself, your interests, and what you'd like to learn or teach..."
          error={errors.bio}
          as="textarea"
          rows="3"
        />

        <InputField
          label="Learning Goals"
          name="learningGoals"
          value={formData.learningGoals}
          onChange={handleChange}
          placeholder="What do you want to achieve through peer-to-peer learning? What subjects do you want to improve in?"
          error={errors.learningGoals}
          as="textarea"
          rows="3"
        />

        {errors.submit && (
          <div className="error-message" style={{ 
            textAlign: 'center', 
            padding: '12px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            {errors.submit}
          </div>
        )}

        <div className="form-actions">
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isLoading}
            style={{ fontSize: '16px', padding: '14px' }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>

        <div className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in here
          </Link>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AuthLayout>
  );
};

export default Register;