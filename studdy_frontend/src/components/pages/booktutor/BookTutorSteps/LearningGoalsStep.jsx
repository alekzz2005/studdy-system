import React from 'react';

const LearningGoalsStep = ({ formData, errors, onChange }) => {
  return (
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
          onChange={(e) => onChange('learningGoals', e.target.value)}
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
              onChange={(e) => onChange('medium', e.target.value)}
            />
            <label htmlFor="faceToFace" className="radio-label">Face to Face</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="online"
              name="medium"
              value="online"
              checked={formData.medium === 'online'}
              onChange={(e) => onChange('medium', e.target.value)}
            />
            <label htmlFor="online" className="radio-label">Online</label>
          </div>
        </div>
        {errors.medium && <span className="error-message">{errors.medium}</span>}
      </div>
    </div>
  );
};

export default LearningGoalsStep;