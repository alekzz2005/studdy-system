// components/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import AuthLayout from '../../layout/AuthLayout';
import Button from '../../common/Button';
import StepIndicator from '../../common/StepIndicator';
import BasicInfo from './RegisterSteps/BasicInfo';
import AcademicInfo from './RegisterSteps/AcademicInfo';
import AboutYou from './RegisterSteps/AboutYou';
import TutorSubjects from './RegisterSteps/TutorSubjects';

import { authAPI } from '../../../services/auth';
import { tutorSubjectService } from '../../../services/tutorsubject';
import { subjectService } from '../../../services/subject';
import { tutorService } from '../../../services/tutor';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // User registration data
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
    goals: '',
    type: '' // 'tutor' or 'tutee'
  });
  const [tutorSubjects, setTutorSubjects] = useState([]); // Stores selected subject IDs
  const [subjects, setSubjects] = useState([]); // All available subjects
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const navigate = useNavigate();

  const registerSteps = [
    { number: 1 },
    { number: 2 },
    { number: 3 },
    { number: 4 } // Additional step for tutor subjects
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleTutorSubjectsChange = (selectedSubjectIds) => {
    setTutorSubjects(selectedSubjectIds);
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

              // Prevent future dates
        if (birthDate > today) {
          newErrors.dateOfBirth = 'Date of birth cannot be in the future';
        } else {
        // Calculate age
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
    }
    
    if (currentStep === 2) {
      if (!formData.school) newErrors.school = 'School is required';
      if (!formData.gradeLevel || formData.gradeLevel === 0) newErrors.gradeLevel = 'Grade level is required';
    }

    if (currentStep === 3) {
      if (!formData.type) newErrors.type = 'Please select your primary role';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.bio) newErrors.bio = 'Bio is required';
    }

    // Only validate tutor subjects for step 4
    if (currentStep === 4) {
      if (tutorSubjects.length === 0) {
        newErrors.tutorSubjects = 'Please select at least one subject you can teach';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to fetch tutorId by userId
  const fetchTutorIdByUserId = async (userId) => {
    try {
      // You'll need to create this endpoint in your backend
      // Or you can get tutor info by userId
      const response = await tutorService.getTutorByUserId(userId);
      return response.tutorId;
    } catch (error) {
      console.error('Error fetching tutorId:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    console.log('=== SUBMIT CLICKED ===');
    console.log('Current step:', step);
    console.log('User type:', formData.type);
    console.log('Tutor subjects:', tutorSubjects.length, tutorSubjects);
    
    // For regular steps (1-2)
    if (step < 3) {
      console.log('Validating step', step);
      if (validateStep(step)) {
        console.log('Step', step, 'valid, moving to step', step + 1);
        setStep(step + 1);
      } else {
        console.log('Step', step, 'validation failed');
      }
      return;
    }

    // Step 3: Complete user registration
    if (step === 3) {
      console.log('Validating step 3');
      const isValid = validateStep(step);
      console.log('Step 3 validation result:', isValid);
      console.log('Step 3 errors:', errors);
      
      if (isValid) {
        console.log('Step 3 is valid, proceeding with registration');
        setIsLoading(true);
        try {
          // 1. Register the user first
          const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            school: formData.school,
            gradeLevel: formData.gradeLevel,
            major: formData.major,
            address: formData.address,
            bio: formData.bio,
            goals: formData.goals,
            type: formData.type.toUpperCase() // Convert to uppercase for backend
          };

          console.log('Sending registration data:', userData);
          const userResponse = await authAPI.register(userData);
          console.log('Registration response:', userResponse);

          // Extract userId from response
          let userId;
          if (userResponse.userId) {
            userId = userResponse.userId;
          } else if (userResponse.user && userResponse.user.userId) {
            userId = userResponse.user.userId;
          } else if (userResponse.data && userResponse.data.userId) {
            userId = userResponse.data.userId;
          } else {
            console.error('No userId found in response structure:', userResponse);
            throw new Error('User registration failed - no user ID returned');
          }

          console.log('Extracted userId:', userId);

          // 2. If user is a tutor, proceed to tutor subjects step
          if (formData.type === 'tutor') {
            console.log('User is tutor, fetching tutorId...');
            
            // Fetch tutorId using userId
            const tutorId = await fetchTutorIdByUserId(userId);
            
            if (!tutorId) {
              throw new Error('Failed to get tutor ID. Please contact support.');
            }
            
            console.log('Fetched tutorId:', tutorId);
            
            // Store BOTH userId and tutorId for next steps
            localStorage.setItem('tempUserData', JSON.stringify({
              userId: userId,
              tutorId: tutorId,
              type: formData.type
            }));
            
            console.log('Moving to step 4...');
            setStep(4); // Go to tutor subjects step

            // Fetch subjects after moving to step 4
            try {
              console.log('Fetching subjects...');
              setLoadingSubjects(true);
              const subjectsResponse = await subjectService.getAllSubjects();
              console.log('Subjects fetched:', subjectsResponse);
              setSubjects(subjectsResponse);
            } catch (error) {
              console.error('Error fetching subjects:', error);
              // Show error but keep user on step 4
              setErrors({ submit: 'Failed to load subjects. Please refresh the page.' });
            } finally {
              setLoadingSubjects(false);
            }
          } else {
            console.log('User is tutee, redirecting to login');
            // If user is tutee, registration is complete
            alert('Registration complete! You can now log in.');
            navigate('/login');
          }
        } catch (error) {
          console.error('Registration error:', error);
          console.error('Error details:', error.response?.data || error.message);
          setErrors({ 
            submit: error.response?.data?.message || error.message || 'Registration failed. Please try again.' 
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('Step 3 validation failed. Errors:', errors);
      }
      return;
    }

    // Step 4: Handle tutor subjects (only for tutors)
    if (step === 4) {
      console.log('Validating step 4');
      const isValid = validateStep(4);
      console.log('Step 4 validation result:', isValid);
      console.log('Step 4 errors:', errors);
      
      if (isValid) {
        console.log('Step 4 valid, creating tutor subjects');
        setIsLoading(true);
        try {
          // Get stored user data
          const tempUserData = JSON.parse(localStorage.getItem('tempUserData'));
          console.log('Retrieved tempUserData:', tempUserData);
          
          if (!tempUserData || tempUserData.type !== 'tutor' || !tempUserData.tutorId) {
            console.error('Invalid tempUserData:', tempUserData);
            throw new Error('Tutor data not found. Please try registering again.');
          }

          const tutorId = tempUserData.tutorId; 
          console.log('Using tutorId:', tutorId);
          console.log('Selected subjects:', tutorSubjects);

          // Create tutor-subject associations
          const tutorSubjectPromises = tutorSubjects.map(subjectId => 
            tutorSubjectService.createTutorSubject({
              tutorId: tutorId,
              subjectId: parseInt(subjectId)
            })
          );

          console.log('Creating', tutorSubjectPromises.length, 'tutor-subject associations');
          await Promise.all(tutorSubjectPromises);
          console.log('Tutor subjects added successfully');

          // Clear temporary data and redirect to login
          localStorage.removeItem('tempUserData');
          alert('Registration complete! You can now log in as a tutor.');
          navigate('/login');

        } catch (error) {
          console.error('Error creating tutor subjects:', error);
          console.error('Error details:', error.response?.data || error.message);
          setErrors({ 
            submit: error.response?.data?.message || error.message || 'Failed to add tutor subjects. Please try again.' 
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('Step 4 validation failed. Errors:', errors);
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

  const getCurrentStepComponent = () => {
    switch(step) {
      case 1:
        return <BasicInfo formData={formData} onChange={handleChange} errors={errors} />;
      case 2:
        return <AcademicInfo formData={formData} onChange={handleChange} errors={errors} />;
      case 3:
        return <AboutYou formData={formData} onChange={handleChange} errors={errors} />;
      case 4:
        return (
          <TutorSubjects 
            subjects={subjects}
            selectedSubjects={tutorSubjects}
            onChange={handleTutorSubjectsChange}
            error={errors.tutorSubjects}
            isLoading={loadingSubjects}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout 
      title="Join Studdy" 
      subtitle="Start your peer learning journey"
      icon={GraduationCap}
      size="lg"
    >
      
      <StepIndicator 
        currentStep={step} 
        steps={formData.type === 'tutor' ? registerSteps : registerSteps.slice(0, 3)} 
      />

      <div>
        {getCurrentStepComponent()}

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
            onClick={() => {
              console.log('Button clicked at step', step);
              handleSubmit();
            }} 
            variant="primary" 
            fullWidth={true}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Processing...' : 
              step === 4 ? 'Complete Tutor Registration' : 
              step === 3 ? formData.type === 'tutor' ? 'Next: Add Subjects' : 'Complete Registration' : 
              'Next'}
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