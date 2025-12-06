import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from '../common/Button';
import StepIndicator from '../common/StepIndicator';
import SubjectSelection from './BookTutorSteps/SubjectSelection';
import TutorSelection from './BookTutorSteps/TutorSelection';
import ScheduleSession from './BookTutorSteps/ScheduleSession';
import { sessionService } from '../../services/session';
import { userAPI } from '../../services/user';
import './styles/BookTutor.css';

const BookTutor = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subjectId: '',
    tutorId: '',
    sessionDate: '',
    startTime: '',
    endTime: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const bookTutorSteps = [
    { number: 1 },
    { number: 2 },
    { number: 3 }
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch subjects from API (mock for now)
        const mockSubjects = [
          { subjectId: 1, name: 'Mathematics', category: 'Science' },
          { subjectId: 2, name: 'Physics', category: 'Science' },
          { subjectId: 3, name: 'English Literature', category: 'Arts' },
          { subjectId: 4, name: 'Computer Science', category: 'Technology' },
          { subjectId: 5, name: 'Chemistry', category: 'Science' }
        ];
        setSubjects(mockSubjects);

        // Fetch tutors from API (mock for now)
        const mockTutors = [
          { userId: 1, name: 'John Smith', expertise: ['Mathematics', 'Physics'], rating: 4.8 },
          { userId: 2, name: 'Sarah Johnson', expertise: ['English Literature'], rating: 4.9 },
          { userId: 3, name: 'Mike Chen', expertise: ['Computer Science', 'Mathematics'], rating: 4.7 },
          { userId: 4, name: 'Emily Davis', expertise: ['Chemistry', 'Physics'], rating: 4.6 }
        ];
        setTutors(mockTutors);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setErrors({ fetch: 'Failed to load initial data' });
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.tutorId && formData.sessionDate) {
      fetchAvailableSlots(formData.tutorId, formData.sessionDate);
    }
  }, [formData.tutorId, formData.sessionDate]);

  const fetchAvailableSlots = async (tutorId, date) => {
    setIsLoading(true);
    try {
      const slots = await sessionService.getAvailableSlots(tutorId, date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setErrors({ slots: 'Failed to load available time slots' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset dependent fields when parent field changes
    if (name === 'subjectId') {
      setFormData(prev => ({ 
        ...prev, 
        tutorId: '', 
        sessionDate: '', 
        startTime: '', 
        endTime: '' 
      }));
      setAvailableSlots([]);
    } else if (name === 'tutorId') {
      setFormData(prev => ({ 
        ...prev, 
        sessionDate: '', 
        startTime: '', 
        endTime: '' 
      }));
      setAvailableSlots([]);
    } else if (name === 'sessionDate') {
      setFormData(prev => ({ 
        ...prev, 
        startTime: '', 
        endTime: '' 
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.subjectId) newErrors.subjectId = 'Please select a subject';
    }

    if (currentStep === 2) {
      if (!formData.tutorId) newErrors.tutorId = 'Please select a tutor';
    }

    if (currentStep === 3) {
      if (!formData.sessionDate) newErrors.sessionDate = 'Please select a date';
      if (!formData.startTime) newErrors.startTime = 'Please select start time';
      if (!formData.endTime) newErrors.endTime = 'Please select end time';

      if (formData.startTime && formData.endTime) {
        if (formData.startTime >= formData.endTime) {
          newErrors.endTime = 'End time must be after start time';
        }
      }
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
          // Get current user ID
          const currentUser = userAPI.getCurrentUser();
          if (!currentUser || !currentUser.userId) {
            throw new Error('Please log in to book a session');
          }

          // Calculate duration in minutes
          const [startHour, startMinute] = formData.startTime.split(':').map(Number);
          const [endHour, endMinute] = formData.endTime.split(':').map(Number);
          const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

          // Prepare session data
          const sessionData = {
            tutorId: parseInt(formData.tutorId),
            tuteeId: currentUser.userId,
            subjectId: parseInt(formData.subjectId),
            sessionDate: formData.sessionDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            duration: duration,
            status: 'SCHEDULED'
          };

          console.log('Booking session with data:', sessionData);
          
          // Call session service to book session
          const result = await sessionService.bookSession(sessionData);
          
          console.log('Session booked successfully:', result);
          
          // Show success message
          alert(`Session booked successfully! You'll receive a confirmation email.`);
          
          // Navigate to dashboard
          navigate('/dashboard');
          
        } catch (error) {
          console.error('Booking error:', error);
          setErrors({ 
            submit: error.response?.data?.message || error.message || 'Booking failed. Please try again.' 
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const getTutorsForSubject = () => {
    if (!formData.subjectId) return [];
    
    const selectedSubject = subjects.find(sub => sub.subjectId === parseInt(formData.subjectId));
    if (!selectedSubject) return [];
    
    return tutors.filter(tutor => 
      tutor.expertise.includes(selectedSubject.name)
    );
  };

  return (
    <div className="book-tutor-container">
      <div className="book-tutor-card">
        <div className="book-tutor-header">
          <div className="book-tutor-icon">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="book-tutor-title">Book a Tutoring Session</h1>
          <p className="book-tutor-subtitle">Find the perfect tutor and schedule your learning session</p>
        </div>
        
        <StepIndicator currentStep={step} steps={bookTutorSteps} />

        <div className="booking-content">
          {step === 1 && (
            <SubjectSelection
              formData={formData}
              onChange={handleChange}
              errors={errors}
              subjects={subjects}
            />
          )}

          {step === 2 && (
            <TutorSelection
              formData={formData}
              onChange={handleChange}
              errors={errors}
              tutors={getTutorsForSubject()}
            />
          )}

          {step === 3 && (
            <ScheduleSession
              formData={formData}
              onChange={handleChange}
              errors={errors}
              availableSlots={availableSlots}
              isLoading={isLoading}
            />
          )}

          {errors.submit && (
            <div className="error-banner">
              <p className="error-message">{errors.submit}</p>
            </div>
          )}

          <div className="button-group">
            <Button 
              variant="secondary" 
              onClick={handleBack} 
              fullWidth={true}
              disabled={isLoading}
            >
              {step === 1 ? 'Back to Dashboard' : 'Back'}
            </Button>
            
            <Button 
              onClick={handleSubmit} 
              variant="primary" 
              fullWidth={true}
              disabled={isLoading}
              loading={isLoading}
            >
              {step === 3 ? 'Confirm Booking' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTutor;