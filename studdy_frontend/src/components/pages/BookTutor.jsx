import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from '../common/Button';
import StepIndicator from '../common/StepIndicator';
import SubjectSelection from './BookTutorSteps/SubjectSelection';
import TutorSelection from './BookTutorSteps/TutorSelection';

import { sessionService } from '../../services/session';
import { subjectService } from '../../services/subject';
import { tutorSubjectService } from '../../services/tutorsubject';
import { userAPI } from '../../services/user';
import './styles/BookTutor.css';

const BookTutor = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    medium: '',
    duration: '', // in hours
    sessionMonth: '',
    sessionDay: '',
    sessionYear: '',
    startHour: '',
    startMinute: '',
    startAmPm: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();

  // Get current year and next year for year dropdown
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  // Generate month options
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  
  // Generate day options based on selected month and year
  const getDaysInMonth = () => {
    if (!formData.sessionMonth || !formData.sessionYear) return 31; // Default to 31 if no month/year selected
    
    const month = parseInt(formData.sessionMonth);
    const year = parseInt(formData.sessionYear);
    
    // Check for leap year if February
    if (month === 2) {
      return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }
    0
    // Months with 30 days
    const thirtyDayMonths = [4, 6, 9, 11];
    return thirtyDayMonths.includes(month) ? 30 : 31;
  };
  
  const daysInMonth = getDaysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    return { value: day, label: day };
  });
  
  // Year options
  const years = [
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: nextYear.toString(), label: nextYear.toString() }
  ];
  
  // Hour options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString().padStart(2, '0');
    return { value: hour, label: hour };
  });
  
  // Minute options (00, 15, 30, 45)
  const minutes = [
    { value: '00', label: '00' },
    { value: '15', label: '15' },
    { value: '30', label: '30' },
    { value: '45', label: '45' }
  ];
  
  // AM/PM options
  const ampmOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
  ];
  
  // Duration options (in hours)
  const durationOptions = [
    { value: '1', label: '1 hour' },
    { value: '1.5', label: '1.5 hours' },
    { value: '2', label: '2 hours' },
    { value: '2.5', label: '2.5 hours' },
    { value: '3', label: '3 hours' }
  ];

  const bookTutorSteps = [
    { number: 1 },
    { number: 2 },
    { number: 3 }
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingData(true);
        
        // Fetch subjects from real API
        const subjectsResponse = await subjectService.getAllSubjects();
        const subjectsData = subjectsResponse.map(subject => ({
          subjectId: subject.subjectId,
          name: subject.subjectName,
          category: subject.subjectDesc || 'General', // Use description as category
          description: subject.subjectDesc
        }));
        setSubjects(subjectsData);

        // Fetch tutors from tutor-subject API
        // First, get all tutor-subject associations
        const tutorSubjectsResponse = await tutorSubjectService.getAllTutorSubjects();
        
        // Group tutors by their ID and collect their subjects
        const tutorsMap = new Map();
        
        tutorSubjectsResponse.forEach(tutorSubject => {
          const tutorId = tutorSubject.tutorId;
          const subjectName = tutorSubject.subjectName || tutorSubject.subject?.subjectName || 'Unknown';
          
          if (!tutorsMap.has(tutorId)) {
            // Initialize tutor data
            tutorsMap.set(tutorId, {
              tutorId: tutorId,
              name: tutorSubject.tutorName || `Tutor ${tutorId}`,
              expertise: [subjectName],
              rating: 4.5, // Default rating - you might want to fetch actual ratings
              // Add other tutor properties if available
              user: tutorSubject.tutor?.user || null
            });
          } else {
            // Add subject to existing tutor's expertise
            const tutor = tutorsMap.get(tutorId);
            if (!tutor.expertise.includes(subjectName)) {
              tutor.expertise.push(subjectName);
            }
          }
        });

        // Convert map to array
        const tutorsData = Array.from(tutorsMap.values());
        setTutors(tutorsData);

        console.log('Fetched real data:', { subjects: subjectsData, tutors: tutorsData });
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setErrors({ fetch: 'Failed to load initial data. Please try again.' });
        
        // Fallback to mock data if API fails (optional)
        const mockSubjects = [
          { subjectId: 1, name: 'Mathematics', category: 'Science', description: 'Mathematics subject' },
          { subjectId: 2, name: 'Physics', category: 'Science', description: 'Physics subject' },
          { subjectId: 3, name: 'English Literature', category: 'Arts', description: 'English Literature subject' },
          { subjectId: 4, name: 'Computer Science', category: 'Technology', description: 'Computer Science subject' },
          { subjectId: 5, name: 'Chemistry', category: 'Science', description: 'Chemistry subject' }
        ];
        setSubjects(mockSubjects);

        const mockTutors = [
          { tutorId: 1, name: 'John Smith', expertise: ['Mathematics', 'Physics'], rating: 4.8 },
          { tutorId: 2, name: 'Sarah Johnson', expertise: ['English Literature'], rating: 4.9 },
          { tutorId: 3, name: 'Mike Chen', expertise: ['Computer Science', 'Mathematics'], rating: 4.7 },
          { tutorId: 4, name: 'Emily Davis', expertise: ['Chemistry', 'Physics'], rating: 4.6 }
        ];
        setTutors(mockTutors);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchInitialData();
  }, []);

  // Update days when month or year changes
  useEffect(() => {
    if (formData.sessionDay && formData.sessionMonth && formData.sessionYear) {
      const dayNum = parseInt(formData.sessionDay);
      if (dayNum > daysInMonth) {
        // Reset to first day if current day is invalid for the month
        handleChange('sessionDay', '01');
      }
    }
  }, [formData.sessionMonth, formData.sessionYear, daysInMonth]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
      if (!formData.learningGoals) newErrors.learningGoals = 'Please describe your learning goals';
      if (!formData.medium) newErrors.medium = 'Please select a tutoring medium';
    }

    if (currentStep === 3) {
      if (!formData.tutorId) newErrors.tutorId = 'Please select a tutor';
      if (!formData.sessionMonth) newErrors.sessionMonth = 'Please select month';
      if (!formData.sessionDay) newErrors.sessionDay = 'Please select day';
      if (!formData.sessionYear) newErrors.sessionYear = 'Please select year';
      if (!formData.startHour) newErrors.startHour = 'Please select hour';
      if (!formData.startMinute) newErrors.startMinute = 'Please select minute';
      if (!formData.startAmPm) newErrors.startAmPm = 'Please select AM/PM';
      if (!formData.duration) newErrors.duration = 'Please select duration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Update handleSubmit to use correct tutorId
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
          if (!currentUser || !currentUser.tuteeId) {
            throw new Error('Please log in as a tutee to book a session');
          }

          // Convert duration from hours to minutes
          const durationMinutes = parseFloat(formData.duration) * 60;
          
          // Prepare session data
          const sessionData = {
            tutorId: parseInt(formData.tutorId),
            tuteeId: parseInt(currentUser.tuteeId),
            subjectId: parseInt(formData.subjectId),
            goal: formData.learningGoals,
            medium: formData.medium,
            duration: durationMinutes,
            sessionMonth: parseInt(formData.sessionMonth),
            sessionDay: parseInt(formData.sessionDay),
            sessionYear: parseInt(formData.sessionYear),
            startHour: parseInt(formData.startHour),
            startMinute: parseInt(formData.startMinute),
            startAmPm: formData.startAmPm,
            status: 'Pending'
          };

          console.log('Booking session with data:', sessionData);
          
          // Call session service to create session
          const result = await sessionService.createSession(sessionData);
          
          console.log('Session created successfully:', result);
          
          // Show success message
          alert(`Session booked successfully! Status: Pending. You'll receive a confirmation email.`);
          
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

    // Add a loading state for the initial data fetch
  if (isLoadingData) {
    return (
      <div className="book-tutor-container">
        <div className="book-tutor-card">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading subjects and tutors...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/dashboard');
    }
  };

  // Update getTutorsForSubject to work with real data
  const getTutorsForSubject = () => {
    if (!formData.subjectId) return [];
    
    const selectedSubject = subjects.find(sub => sub.subjectId === parseInt(formData.subjectId));
    if (!selectedSubject) return [];
    
    // Filter tutors who have this subject in their expertise
    return tutors.filter(tutor => 
      tutor.expertise.includes(selectedSubject.name)
    );
  };

  // Format date for display
  const formatDateDisplay = () => {
    if (!formData.sessionMonth || !formData.sessionDay || !formData.sessionYear) {
      return 'Select date';
    }
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(formData.sessionMonth) - 1;
    return `${monthNames[monthIndex]} ${formData.sessionDay}, ${formData.sessionYear}`;
  };

  // Format time for display
  const formatTimeDisplay = () => {
    if (!formData.startHour || !formData.startMinute || !formData.startAmPm) {
      return 'Select time';
    }
    return `${formData.startHour}:${formData.startMinute} ${formData.startAmPm}`;
  };

  // Format end time for display
  const formatEndTimeDisplay = () => {
    if (!formData.startHour || !formData.startMinute || !formData.startAmPm || !formData.duration) {
      return '';
    }
    
    // Convert 12-hour to 24-hour for calculation
    let hour24 = parseInt(formData.startHour);
    if (formData.startAmPm === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (formData.startAmPm === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    const startDate = new Date(`2000-01-01T${hour24.toString().padStart(2, '0')}:${formData.startMinute}`);
    const durationHours = parseFloat(formData.duration);
    const endDate = new Date(startDate.getTime() + (durationHours * 60 * 60 * 1000));
    
    // Convert back to 12-hour format for display
    let endHour = endDate.getHours();
    const endMinute = endDate.getMinutes().toString().padStart(2, '0');
    const endAmPm = endHour >= 12 ? 'PM' : 'AM';
    
    endHour = endHour % 12;
    endHour = endHour === 0 ? 12 : endHour;
    
    return `${endHour}:${endMinute} ${endAmPm}`;
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
            <>
              <div className="step-content">
                <h3 className="step-title">Learning Goals</h3>
                <p className="step-description">Tell us about your learning objectives</p>
                
                <div className="form-group">
                  <label htmlFor="learningGoals" className="form-label">
                    Why do you want to study this subject? *
                  </label>
                  <textarea
                    id="learningGoals"
                    name="learningGoals"
                    value={formData.learningGoals}
                    onChange={(e) => handleChange('learningGoals', e.target.value)}
                    placeholder="Describe your learning goals and what you hope to achieve..."
                    className={`form-input ${errors.learningGoals ? 'error' : ''}`}
                    rows="4"
                    style={{ resize: 'none' }}
                  />
                  {errors.learningGoals && <span className="error-message">{errors.learningGoals}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Tutoring Medium *</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="faceToFace"
                        name="medium"
                        value="face-to-face"
                        checked={formData.medium === 'face-to-face'}
                        onChange={(e) => handleChange('medium', e.target.value)}
                      />
                      <label htmlFor="faceToFace" className="radio-label">
                        Face to Face
                      </label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="online"
                        name="medium"
                        value="online"
                        checked={formData.medium === 'online'}
                        onChange={(e) => handleChange('medium', e.target.value)}
                      />
                      <label htmlFor="online" className="radio-label">
                        Online Tutor
                      </label>
                    </div>
                  </div>
                  {errors.medium && <span className="error-message">{errors.medium}</span>}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
  <>
    {/* Schedule Session */}
    <div className="step-content">
      <h3 className="step-title">Schedule Session</h3>
      <p className="step-description">Choose your preferred date and time</p>
      
      {/* Session Date - Horizontal Row */}
      <div className="form-group">
        <label className="form-label">Session Date *</label>
        <div className="horizontal-row">
          {/* Month Dropdown */}
          <div className="dropdown-wrapper">
            <select
              value={formData.sessionMonth}
              onChange={(e) => handleChange('sessionMonth', e.target.value)}
              className={`form-select ${errors.sessionMonth ? 'error' : ''}`}
            >
              <option value="">Month</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            {errors.sessionMonth && <span className="error-message">{errors.sessionMonth}</span>}
          </div>
          
          {/* Day Dropdown */}
          <div className="dropdown-wrapper">
            <select
              value={formData.sessionDay}
              onChange={(e) => handleChange('sessionDay', e.target.value)}
              className={`form-select ${errors.sessionDay ? 'error' : ''}`}
              disabled={!formData.sessionMonth}
            >
              <option value="">Day</option>
              {days.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
            {errors.sessionDay && <span className="error-message">{errors.sessionDay}</span>}
          </div>
          
          {/* Year Dropdown */}
          <div className="dropdown-wrapper">
            <select
              value={formData.sessionYear}
              onChange={(e) => handleChange('sessionYear', e.target.value)}
              className={`form-select ${errors.sessionYear ? 'error' : ''}`}
            >
              <option value="">Year</option>
              {years.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
            {errors.sessionYear && <span className="error-message">{errors.sessionYear}</span>}
          </div>
        </div>
      </div>
      
      {/* Start Time - Horizontal Row */}
      <div className="form-group">
        <label className="form-label">Start Time *</label>
        <div className="horizontal-row">
          {/* Hour Dropdown */}
          <div className="dropdown-wrapper">
            <select
              value={formData.startHour}
              onChange={(e) => handleChange('startHour', e.target.value)}
              className={`form-select ${errors.startHour ? 'error' : ''}`}
            >
              <option value="">Hour</option>
              {hours.map(hour => (
                <option key={hour.value} value={hour.value}>
                  {hour.label}
                </option>
              ))}
            </select>
            {errors.startHour && <span className="error-message">{errors.startHour}</span>}
          </div>
          
          {/* Minute Dropdown */}
          <div className="dropdown-wrapper">
            <select
              value={formData.startMinute}
              onChange={(e) => handleChange('startMinute', e.target.value)}
              className={`form-select ${errors.startMinute ? 'error' : ''}`}
            >
              <option value="">Minute</option>
              {minutes.map(minute => (
                <option key={minute.value} value={minute.value}>
                  {minute.label}
                </option>
              ))}
            </select>
            {errors.startMinute && <span className="error-message">{errors.startMinute}</span>}
          </div>
          
          {/* AM/PM Dropdown */}
          <div className="dropdown-wrapper">
            <select
              value={formData.startAmPm}
              onChange={(e) => handleChange('startAmPm', e.target.value)}
              className={`form-select ${errors.startAmPm ? 'error' : ''}`}
            >
              <option value="">AM/PM</option>
              {ampmOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.startAmPm && <span className="error-message">{errors.startAmPm}</span>}
          </div>
        </div>
      </div>
      
      {/* Duration Selection - Keep as single dropdown */}
      <div className="form-group">
        <label htmlFor="duration" className="form-label">
          Session Duration *
        </label>
        <select
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          className={`form-select ${errors.duration ? 'error' : ''}`}
        >
          <option value="">Select duration</option>
          {durationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.duration && <span className="error-message">{errors.duration}</span>}
      </div>
    </div>

    {/* Tutor Selection */}
    <div className="tutor-selection-section">
      <TutorSelection
        formData={formData}
        onChange={handleChange}
        errors={errors}
        tutors={getTutorsForSubject()}
      />
    </div>

    {/* Session Summary */}
    {(formData.sessionMonth && formData.sessionDay && formData.sessionYear && 
      formData.startHour && formData.startMinute && formData.startAmPm && formData.duration) && (
      <div className="session-summary-enhanced">
        <h4 className="summary-title">Session Summary</h4>
        <div className="summary-details">
          <div className="summary-item">
            <span className="summary-label">Duration:</span>
            <span>{formData.duration} hour{formData.duration !== '1' ? 's' : ''}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Date:</span>
            <span>{formatDateDisplay()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Time:</span>
            <span>{formatTimeDisplay()} - {formatEndTimeDisplay()}</span>
          </div>
        </div>
      </div>
    )}
  </>
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