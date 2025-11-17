import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import AuthLayout from '../layout/AuthLayout';
import Button from '../common/Button';
import BasicInfo from './RegisterSteps/BasicInfo';
import AcademicInfo from './RegisterSteps/AcademicInfo';
import AboutYou from './RegisterSteps/AboutYou';
import { authAPI } from '../../services/api';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    school: '',
    gradeLevel: 0,
    major: '',
    address: '',
    bio: '',
    learningGoals: ''
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

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

      if (formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 13) {
          newErrors.dateOfBirth = 'You must be at least 13 years old';
        }
      }
    }
    
    if (currentStep === 2) {
      if (!formData.school) newErrors.school = 'School is required';
      if (!formData.gradeLevel || formData.gradeLevel === 0) newErrors.gradeLevel = 'Grade level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (step < 3) {
      if (validateStep(step)) {
        setStep(step + 1);
      }
    } else {
      if (validateStep(step)) {
        setIsLoading(true);
        try {
          const response = await authAPI.register(formData);
          console.log('Registration successful:', response);
          // Handle successful registration
          navigate('/'); // Redirect after successful registration
        } catch (error) {
          setErrors({ submit: error.response?.data?.message || error.message || 'Registration failed' });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  const StepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className={`step-circle ${step >= s ? 'step-active' : 'step-inactive'}`}>
            {s}
          </div>
          {s < 3 && <div className={`step-connector ${step > s ? 'step-connector-active' : 'step-connector-inactive'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <AuthLayout 
      title="Join Studdy" 
      subtitle="Start your peer learning journey"
      icon={GraduationCap}
      size="lg"
    >
      <StepIndicator />

      <div>
        {step === 1 && <BasicInfo formData={formData} onChange={handleChange} errors={errors} />}
        {step === 2 && <AcademicInfo formData={formData} onChange={handleChange} errors={errors} />}
        {step === 3 && <AboutYou formData={formData} onChange={handleChange} errors={errors} />}

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 ? (
            <Button variant="secondary" onClick={handleBack} fullWidth={true}>
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={handleSwitchToLogin} fullWidth={true}>
              Back to Login
            </Button>
          )}
          
          <Button 
            onClick={handleSubmit} 
            variant="primary" 
            fullWidth={true}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : step === 3 ? 'Complete Registration' : 'Next'}
          </Button>
        </div>
      </div>

      {step === 1 && (
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={handleSwitchToLogin}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      )}
    </AuthLayout>
  );
};

export default RegisterPage;