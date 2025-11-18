import React from 'react';
import { Star, User } from 'lucide-react';

const TutorSelection = ({ formData, onChange, errors, tutors }) => {
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
            <option key={tutor.userId} value={tutor.userId}>
              {tutor.name} ⭐ {tutor.rating}
            </option>
          ))}
        </select>
        {errors.tutorId && <span className="error-message">{errors.tutorId}</span>}
      </div>

      {formData.tutorId && (
        <div className="tutor-details-card">
          <h4 className="tutor-details-title">Tutor Information</h4>
          {tutors
            .filter(tutor => tutor.userId === parseInt(formData.tutorId))
            .map(tutor => (
              <div key={tutor.userId} className="tutor-card">
                <div className="tutor-avatar">
                  <User size={24} />
                </div>
                <div className="tutor-info">
                  <h5 className="tutor-name">{tutor.name}</h5>
                  <div className="tutor-rating">
                    <Star className="star-icon" size={16} />
                    <span>{tutor.rating}/5</span>
                  </div>
                  <p className="tutor-expertise">
                    Expertise: {tutor.expertise.join(', ')}
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