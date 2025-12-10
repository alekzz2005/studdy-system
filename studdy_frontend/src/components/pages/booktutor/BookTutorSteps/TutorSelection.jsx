import React from 'react';
import { Star, User } from 'lucide-react';

const TutorSelection = ({ formData, onChange, errors, tutors }) => {
  const getDisplayName = (tutor) => {
    // Try fullName first, then combine firstName + lastName, fallback to tutor ID
    if (tutor.fullName && tutor.fullName.trim()) {
      return tutor.fullName;
    }
    if (tutor.firstName || tutor.lastName) {
      return `${tutor.firstName || ''} ${tutor.lastName || ''}`.trim();
    }
    return `Tutor ${tutor.tutorId}`;
  };

  const getRatingDisplay = (tutor) => {
    // Use averageRating from DTO, fallback to rating
    const rating = tutor.averageRating !== undefined ? tutor.averageRating : tutor.rating;
    return rating ? rating.toFixed(1) : '0.0';
  };

  const getExpertiseDisplay = (tutor) => {
    if (Array.isArray(tutor.expertise) && tutor.expertise.length > 0) {
      return tutor.expertise.join(', ');
    }
    return 'Not specified';
  };

  console.log('Tutors list:', tutors);

  return (
    <div className="step-content">
      <h3 className="step-title">Choose Tutor</h3>
      <p className="step-description">Select your preferred tutor</p>
      
      <div className="form-group">
        <label htmlFor="tutorId" className="form-label">
          Tutor *
        </label>
        <select
          id="tutorId"
          name="tutorId"
          value={formData.tutorId}
          onChange={(e) => onChange('tutorId', e.target.value)}
          className={`form-select ${errors.tutorId ? 'error' : ''}`}
        >
          <option value="">Select a tutor</option>
          {tutors.map(tutor => (
            <option key={tutor.tutorId} value={tutor.tutorId}>
              {getDisplayName(tutor)} ⭐ {getRatingDisplay(tutor)}
            </option>
          ))}
        </select>
        {errors.tutorId && <span className="error-message">{errors.tutorId}</span>}
      </div>

      {formData.tutorId && (
        <div className="tutor-details-card">
          <h4 className="tutor-details-title">Tutor Information</h4>
          {tutors
            .filter(tutor => tutor.tutorId === parseInt(formData.tutorId))
            .map(tutor => (
              <div key={tutor.tutorId} className="tutor-card">
                <div className="tutor-avatar">
                  <User size={24} />
                </div>
                <div className="tutor-info">
                  <h5 className="tutor-name">{getDisplayName(tutor)}</h5>
                  <div className="tutor-rating">
                    <Star className="star-icon" size={16} fill="#f59e0b" color="#f59e0b" />
                    <span className="rating-value">{getRatingDisplay(tutor)}</span>
                    <span className="rating-max">/ 5</span>
                  </div>
                  <p className="tutor-expertise">
                    Expertise: {getExpertiseDisplay(tutor)}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default TutorSelection;