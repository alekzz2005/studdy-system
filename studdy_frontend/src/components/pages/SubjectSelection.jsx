import React from 'react';
import { BookOpen } from 'lucide-react';

const SubjectSelection = ({ formData, onChange, errors, subjects }) => {
  return (
    <div className="step-content">
      <h3 className="step-title">Choose Subject</h3>
      <p className="step-description">What would you like to learn?</p>
      
      <div className="form-group">
        <label htmlFor="subjectId" className="form-label">
          Subject *
        </label>
        <select
          id="subjectId"
          name="subjectId"
          value={formData.subjectId}
          onChange={(e) => onChange('subjectId', e.target.value)}
          className={`form-select ${errors.subjectId ? 'error' : ''}`}
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

      {formData.subjectId && (
        <div className="success-message">
          <BookOpen size={20} />
          <span>Great choice! Now let's find you a tutor.</span>
        </div>
      )}
    </div>
  );
};

export default SubjectSelection;