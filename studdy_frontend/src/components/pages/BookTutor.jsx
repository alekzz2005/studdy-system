import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from '../common/Button';
import StepIndicator from '../common/StepIndicator';
import SubjectSelection from './BookTutorSteps/SubjectSelection';
import TutorSelection from './BookTutorSteps/TutorSelection';
import ScheduleSession from './BookTutorSteps/ScheduleSession';
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
        const mockSubjects = [
          { subjectId: 1, name: 'Mathematics', category: 'Science' },
          { subjectId: 2, name: 'Physics', category: 'Science' },
          { subjectId: 3, name: 'English Literature', category: 'Arts' },
          { subjectId: 4, name: 'Computer Science', category: 'Technology' },
          { subjectId: 5, name: 'Chemistry', category: 'Science' }
        ];
        setSubjects(mockSubjects);

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
      const mockSlots = [
        { startTime: '09:00', endTime: '10:00', available: true },
        { startTime: '10:30', endTime: '11:30', available: true },
        { startTime: '14:00', endTime: '15:00', available: true },
        { startTime: '15:30', endTime: '16:30', available: false },
        { startTime: '17:00', endTime: '18:00', available: true }
      ];
      setAvailableSlots(mockSlots);
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

    if (name === 'subjectId') {
      setFormData(prev => ({ 
        ...prev, 
        tutorId: '', 
        sessionDate: '', 
        startTime: '', 
        endTime: '' 
      }));
    } else if (name === 'tutorId') {
      setFormData(prev => ({ 
        ...prev, 
        sessionDate: '', 
        startTime: '', 
        endTime: '' 
      }));
    }

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
          const sessionData = {
            tutorId: parseInt(formData.tutorId),
            tuteeId: 1,
            subjectId: parseInt(formData.subjectId),
            sessionDate: formData.sessionDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            status: 'SCHEDULED'
          };

          console.log('Booking session:', sessionData);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          navigate('/dashboard');
          
        } catch (error) {
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
    return tutors.filter(tutor => 
      tutor.expertise.includes(selectedSubject?.name)
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
            >
              {step === 1 ? 'Back to Dashboard' : 'Back'}
            </Button>
            
            <Button 
              onClick={handleSubmit} 
              variant="primary" 
              fullWidth={true}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : step === 3 ? 'Confirm Booking' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTutor;