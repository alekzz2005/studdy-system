import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from '../common/Button';
import StepIndicator from '../common/StepIndicator';
import SubjectSelection from './BookTutorSteps/SubjectSelection';
import TutorSelection from './BookTutorSteps/TutorSelection';
import LearningGoalsStep from './BookTutorSteps/LearningGoalsStep';
import DateTimePicker from './BookTutorSteps/DateTimePicker';
import SessionSummary from './BookTutorSteps/SessionSummary';

import { sessionService } from '../../services/session';
import { subjectService } from '../../services/subject';
import { tutorSubjectService } from '../../services/tutorsubject';
import { tutorService } from '../../services/tutor'; // Add tutor service import
import { tuteeService } from '../../services/tutee';
import { userAPI } from '../../services/user';
import '../styles/BookTutor.css';

const BookTutor = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    medium: '',
    duration: '',
    sessionMonth: '',
    sessionDay: '',
    sessionYear: '',
    startHour: '',
    startMinute: '',
    startAmPm: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [tutorDetailsMap, setTutorDetailsMap] = useState(new Map()); // Store detailed tutor info
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingTutors, setIsLoadingTutors] = useState(false);
  const navigate = useNavigate();

  const bookTutorSteps = [{ number: 1 }, { number: 2 }, { number: 3 }];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoadingData(true);
      const [subjectsResponse, tutorSubjectsResponse] = await Promise.all([
        subjectService.getAllSubjects(),
        tutorSubjectService.getAllTutorSubjects()
      ]);

      const tutorsMap = new Map();
      const subjectTutorsMap = new Map();
      const tutorIds = new Set(); // Collect unique tutor IDs
      
      console.log("Tutor subjects response: ", tutorSubjectsResponse);

      tutorSubjectsResponse.forEach(tutorSubject => {
        const tutorId = tutorSubject.tutorId;
        const subjectId = tutorSubject.subjectId;
        const subjectName = tutorSubject.subjectName || tutorSubject.subject?.subjectName || 'Unknown';
        
        tutorIds.add(tutorId); // Add to set of tutor IDs

        // Track subjects that have tutors
        if (!subjectTutorsMap.has(subjectId)) {
          subjectTutorsMap.set(subjectId, []);
        }
        subjectTutorsMap.get(subjectId).push(tutorId);
        
        // Build initial tutors map with basic info
        if (!tutorsMap.has(tutorId)) {
          tutorsMap.set(tutorId, {
            tutorId: tutorId,
            expertise: [subjectName],
            // Placeholder data until we fetch details
            name: `Tutor ${tutorId}`,
            fullName: `Tutor ${tutorId}`,
            rating: 0,
            isActive: false,
            available: false
          });
        } else {
          const tutor = tutorsMap.get(tutorId);
          if (!tutor.expertise.includes(subjectName)) {
            tutor.expertise.push(subjectName);
          }
        }
      });

      // Filter subjects to only include those with tutors
      const subjectsData = subjectsResponse
        .filter(subject => subjectTutorsMap.has(subject.subjectId))
        .map(subject => ({
          subjectId: subject.subjectId,
          name: subject.subjectName,
          category: subject.subjectDesc || 'General',
          description: subject.subjectDesc
        }));

      console.log("Filtered subjects with tutors: ", subjectsData);
      setSubjects(subjectsData);
      
      // Set initial tutors with placeholder data
      const initialTutors = Array.from(tutorsMap.values());
      setTutors(initialTutors);

      // Now fetch detailed tutor information for each tutor
      await fetchTutorDetails(Array.from(tutorIds), tutorsMap);

    } catch (error) {
      console.error('Error fetching data:', error);
      setErrors({ fetch: 'Failed to load data. Please try again.' });
      setMockData();
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchTutorDetails = async (tutorIds, tutorsMap) => {
    try {
      setIsLoadingTutors(true);
      const tutorPromises = tutorIds.map(async (tutorId) => {
        try {
          const tutorDetail = await tutorService.getTutorById(tutorId);
          console.log(`Fetched tutor detail for ${tutorId}:`, tutorDetail);
          
          return {
            tutorId: tutorId,
            name: `${tutorDetail.firstName || ''} ${tutorDetail.lastName || ''}`.trim() || `Tutor ${tutorId}`,
            fullName: `${tutorDetail.firstName || ''} ${tutorDetail.lastName || ''}`.trim() || `Tutor ${tutorId}`,
            firstName: tutorDetail.firstName || '',
            lastName: tutorDetail.lastName || '',
            averageRating: tutorDetail.averageRating || 0,
            isActive: tutorDetail.isActive || false,
            available: tutorDetail.available || false,
            expertise: tutorsMap.get(tutorId)?.expertise || [],
            // Add other fields from DTO if needed
            phoneNumber: tutorDetail.phoneNumber || '',
            userEmail: tutorDetail.userEmail || ''
          };
        } catch (error) {
          console.error(`Error fetching tutor ${tutorId}:`, error);
          // Return placeholder if fetch fails
          return {
            tutorId: tutorId,
            name: `Tutor ${tutorId}`,
            fullName: `Tutor ${tutorId}`,
            firstName: '',
            lastName: '',
            averageRating: 0,
            isActive: false,
            available: false,
            expertise: tutorsMap.get(tutorId)?.expertise || []
          };
        }
      });

      const detailedTutors = await Promise.all(tutorPromises);
      
      setTutors(detailedTutors);
      
      const detailsMap = new Map();
      detailedTutors.forEach(tutor => {
        detailsMap.set(tutor.tutorId, tutor);
      });
      setTutorDetailsMap(detailsMap);

    } catch (error) {
      console.error('Error fetching tutor details:', error);
    } finally {
      setIsLoadingTutors(false);
    }
  };

  const setMockData = () => {
    const mockSubjects = [
      { subjectId: 1, name: 'Mathematics', category: 'Science', description: 'Mathematics subject' },
      { subjectId: 2, name: 'Physics', category: 'Science', description: 'Physics subject' },
      { subjectId: 3, name: 'English Literature', category: 'Arts', description: 'English Literature subject' },
      { subjectId: 4, name: 'Computer Science', category: 'Technology', description: 'Computer Science subject' }
    ];
    setSubjects(mockSubjects);

    const mockTutors = [
      { 
        tutorId: 1, 
        name: 'John Smith', 
        fullName: 'John Smith',
        firstName: 'John',
        lastName: 'Smith',
        averageRating: 4.8,
        expertise: ['Mathematics', 'Physics'],
        isActive: true,
        available: true
      },
      { 
        tutorId: 2, 
        name: 'Sarah Johnson', 
        fullName: 'Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        averageRating: 4.9,
        expertise: ['English Literature'],
        isActive: true,
        available: true
      },
      { 
        tutorId: 3, 
        name: 'Mike Chen', 
        fullName: 'Mike Chen',
        firstName: 'Mike',
        lastName: 'Chen',
        averageRating: 4.7,
        expertise: ['Computer Science', 'Mathematics'],
        isActive: true,
        available: true
      },
      { 
        tutorId: 4, 
        name: 'Emily Davis', 
        fullName: 'Emily Davis',
        firstName: 'Emily',
        lastName: 'Davis',
        averageRating: 4.6,
        expertise: ['Physics'],
        isActive: true,
        available: true
      }
    ];
    setTutors(mockTutors);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1 && !formData.subjectId) newErrors.subjectId = 'Please select a subject';
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

  const handleSubmit = async () => {
    if (step < 3) {
      if (validateStep(step)) setStep(step + 1);
    } else {
      if (validateStep(step)) {
        setIsLoading(true);
        try {
          const currentUserResponse = await userAPI.getCurrentUser();
          const currentUser = currentUserResponse;
          console.log('Current user:', currentUser);
          if (!currentUser || currentUser.type !== 'TUTEE') {
            throw new Error('Only tutees can book sessions.');
          }

          const tuteeResponse = await tuteeService.getTuteeByUserId(currentUser.userId);
          const tuteeId = tuteeResponse?.tuteeId;
          
          if (!tuteeId) throw new Error('Unable to retrieve tutee profile.');

          const sessionData = {
            tutorId: parseInt(formData.tutorId),
            tuteeId: parseInt(tuteeId),
            subjectId: parseInt(formData.subjectId),
            goal: formData.learningGoals,
            medium: formData.medium,
            duration: parseFloat(formData.duration) * 60,
            sessionMonth: parseInt(formData.sessionMonth),
            sessionDay: parseInt(formData.sessionDay),
            sessionYear: parseInt(formData.sessionYear),
            startHour: parseInt(formData.startHour),
            startMinute: parseInt(formData.startMinute),
            startAmPm: formData.startAmPm,
            status: 'Pending'
          };

          await sessionService.createSession(sessionData);
          alert('Session booked successfully! Status: Pending. You\'ll receive a confirmation email.');
          navigate('/dashboard');
        } catch (error) {
          setErrors({ submit: error.message || 'Booking failed. Please try again.' });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const getTutorsForSubject = () => {
    if (!formData.subjectId) return [];
    
    const selectedSubject = subjects.find(sub => sub.subjectId === parseInt(formData.subjectId));
    if (!selectedSubject) return [];
    
    // Filter tutors who have this subject in their expertise
    const filteredTutors = tutors.filter(tutor => 
      tutor.expertise.includes(selectedSubject.name)
    );
    
    console.log(`Tutors for subject ${selectedSubject.name}:`, filteredTutors);
    return filteredTutors;
  };

  const getSelectedTutor = () => {
    if (!formData.tutorId) return null;
    return tutors.find(tutor => tutor.tutorId === parseInt(formData.tutorId));
  };

  const handleBack = () => step > 1 ? setStep(step - 1) : navigate('/dashboard');

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
            <LearningGoalsStep formData={formData} errors={errors} onChange={handleChange} />
          )}

          {step === 3 && (
            <>
              <div className="step-content">
                <h3 className="step-title">Schedule Session</h3>
                <p className="step-description">Choose your preferred date and time</p>
                <DateTimePicker formData={formData} errors={errors} onChange={handleChange} />
              </div>

              <div className="tutor-selection-section">
                <TutorSelection
                  formData={formData}
                  onChange={handleChange}
                  errors={errors}
                  tutors={getTutorsForSubject()}
                  isLoading={isLoadingTutors}
                />
              </div>

              <SessionSummary 
                formData={formData} 
                selectedTutor={getSelectedTutor()}
              />
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