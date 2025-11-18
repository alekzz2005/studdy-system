import React, { useState, useEffect } from 'react';
import './BookTutor.css';

const BookTutor = () => {
  const [subjects, setSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    subjectId: '',
    tutorId: '',
    sessionDate: '',
    startTime: '',
    endTime: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Fetch subjects
    const mockSubjects = [
      { subjectId: 1, name: 'Mathematics', category: 'Science' },
      { subjectId: 2, name: 'Physics', category: 'Science' },
      { subjectId: 3, name: 'English Literature', category: 'Arts' },
      { subjectId: 4, name: 'Computer Science', category: 'Technology' },
      { subjectId: 5, name: 'Chemistry', category: 'Science' }
    ];
    setSubjects(mockSubjects);

    // Fetch tutors (this would typically be based on selected subject)
    const mockTutors = [
      { userId: 1, name: 'John Smith', expertise: ['Mathematics', 'Physics'], rating: 4.8 },
      { userId: 2, name: 'Sarah Johnson', expertise: ['English Literature'], rating: 4.9 },
      { userId: 3, name: 'Mike Chen', expertise: ['Computer Science', 'Mathematics'], rating: 4.7 },
      { userId: 4, name: 'Emily Davis', expertise: ['Chemistry', 'Physics'], rating: 4.6 }
    ];
    setTutors(mockTutors);
  }, []);

  // Fetch available slots when tutor and date are selected
  useEffect(() => {
    if (formData.tutorId && formData.sessionDate) {
      fetchAvailableSlots(formData.tutorId, formData.sessionDate);
    }
  }, [formData.tutorId, formData.sessionDate]);

  const fetchAvailableSlots = async (tutorId, date) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual endpoint
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
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear related fields when dependencies change
    if (name === 'subjectId') {
      setFormData(prev => ({ ...prev, tutorId: '', sessionDate: '', startTime: '', endTime: '' }));
    } else if (name === 'tutorId') {
      setFormData(prev => ({ ...prev, sessionDate: '', startTime: '', endTime: '' }));
    } else if (name === 'sessionDate') {
      setFormData(prev => ({ ...prev, startTime: '', endTime: '' }));
    }

    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subjectId) newErrors.subjectId = 'Please select a subject';
    if (!formData.tutorId) newErrors.tutorId = 'Please select a tutor';
    if (!formData.sessionDate) newErrors.sessionDate = 'Please select a date';
    if (!formData.startTime) newErrors.startTime = 'Please select start time';
    if (!formData.endTime) newErrors.endTime = 'Please select end time';

    // Validate time logic
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare session data according to your entity structure
      const sessionData = {
        tutorId: parseInt(formData.tutorId),
        tuteeId: 1, // This would come from authenticated user context
        subjectId: parseInt(formData.subjectId),
        sessionDate: formData.sessionDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: 'SCHEDULED'
      };

      // Mock API call - replace with actual endpoint
      console.log('Booking session:', sessionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Session booked successfully!');
      
      // Reset form
      setFormData({
        subjectId: '',
        tutorId: '',
        sessionDate: '',
        startTime: '',
        endTime: ''
      });
      
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTutorsForSubject = () => {
    if (!formData.subjectId) return [];
    
    const selectedSubject = subjects.find(sub => sub.subjectId === parseInt(formData.subjectId));
    return tutors.filter(tutor => 
      tutor.expertise.includes(selectedSubject?.name)
    );
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    return (end - start) / (1000 * 60 * 60); // hours
  };

  return (
    <div className="book-tutor-container">
      <div className="book-tutor-header">
        <h1>Book a Tutoring Session</h1>
        <p>Find the perfect tutor and schedule your learning session</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Subject Selection */}
        <div className="form-section">
          <h3>1. Choose Subject</h3>
          <div className="form-group">
            <label htmlFor="subjectId">What would you like to learn? *</label>
            <select
              id="subjectId"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleInputChange}
              className={errors.subjectId ? 'error' : ''}
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.name} ({subject.category})
                </option>
              ))}
            </select>
            {errors.subjectId && <span className="error-message">{errors.subjectId}</span>}
          </div>
        </div>

        {/* Tutor Selection */}
        {formData.subjectId && (
          <div className="form-section">
            <h3>2. Choose Tutor</h3>
            <div className="form-group">
              <label htmlFor="tutorId">Select a tutor *</label>
              <select
                id="tutorId"
                name="tutorId"
                value={formData.tutorId}
                onChange={handleInputChange}
                className={errors.tutorId ? 'error' : ''}
              >
                <option value="">Select a tutor</option>
                {getTutorsForSubject().map(tutor => (
                  <option key={tutor.userId} value={tutor.userId}>
                    {tutor.name} ⭐ {tutor.rating}
                  </option>
                ))}
              </select>
              {errors.tutorId && <span className="error-message">{errors.tutorId}</span>}
            </div>

            {/* Tutor Details */}
            {formData.tutorId && (
              <div className="tutor-details">
                <h4>Tutor Information</h4>
                {getTutorsForSubject()
                  .filter(tutor => tutor.userId === parseInt(formData.tutorId))
                  .map(tutor => (
                    <div key={tutor.userId} className="tutor-card">
                      <div className="tutor-info">
                        <strong>{tutor.name}</strong>
                        <span>Rating: ⭐ {tutor.rating}/5</span>
                        <span>Expertise: {tutor.expertise.join(', ')}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}

        {/* Date and Time Selection */}
        {formData.tutorId && (
          <div className="form-section">
            <h3>3. Schedule Session</h3>
            
            {/* Date Selection */}
            <div className="form-group">
              <label htmlFor="sessionDate">Select Date *</label>
              <input
                type="date"
                id="sessionDate"
                name="sessionDate"
                value={formData.sessionDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={errors.sessionDate ? 'error' : ''}
              />
              {errors.sessionDate && <span className="error-message">{errors.sessionDate}</span>}
            </div>

            {/* Time Selection */}
            {formData.sessionDate && (
              <div className="time-selection">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime">Start Time *</label>
                    <select
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={errors.startTime ? 'error' : ''}
                    >
                      <option value="">Select start time</option>
                      {availableSlots
                        .filter(slot => slot.available)
                        .map(slot => (
                          <option key={slot.startTime} value={slot.startTime}>
                            {slot.startTime}
                          </option>
                        ))
                      }
                    </select>
                    {errors.startTime && <span className="error-message">{errors.startTime}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">End Time *</label>
                    <select
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={errors.endTime ? 'error' : ''}
                    >
                      <option value="">Select end time</option>
                      {availableSlots
                        .filter(slot => slot.available && 
                          (!formData.startTime || slot.startTime > formData.startTime))
                        .map(slot => (
                          <option key={slot.startTime} value={slot.endTime}>
                            {slot.endTime}
                          </option>
                        ))
                      }
                    </select>
                    {errors.endTime && <span className="error-message">{errors.endTime}</span>}
                  </div>
                </div>

                {/* Duration Display */}
                {formData.startTime && formData.endTime && (
                  <div className="duration-display">
                    <strong>Session Duration: {calculateDuration()} hours</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        {formData.endTime && (
          <div className="form-section">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Session'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookTutor;