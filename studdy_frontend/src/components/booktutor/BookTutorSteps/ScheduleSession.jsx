import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const ScheduleSession = ({ formData, onChange, errors, availableSlots, isLoading }) => {
  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    return (end - start) / (1000 * 60 * 60); // hours
  };

  return (
    <div className="step-content">
      <h3 className="step-title">Schedule Session</h3>
      <p className="step-description">Choose your preferred date and time</p>
      
      <div className="form-group">
        <label htmlFor="sessionDate" className="form-label">
          Session Date <span className="required">*</span>
        </label>
        <div className="input-with-icon">
          <span className="input-icon">📅</span>
          <input
            type="date"
            id="sessionDate"
            name="sessionDate"
            value={formData.sessionDate}
            onChange={(e) => onChange('sessionDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`form-input ${errors.sessionDate ? 'error' : ''}`}
          />
        </div>
        {errors.sessionDate && <span className="error-message">{errors.sessionDate}</span>}
      </div>

      {formData.sessionDate && (
        <div className="time-selection">
          <div className="time-inputs">
            <div className="time-field">
              <label htmlFor="startTime" className="form-label">
                Start Time <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon">🕐</span>
                <select
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={(e) => onChange('startTime', e.target.value)}
                  className={`form-select ${errors.startTime ? 'error' : ''}`}
                  disabled={isLoading}
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
              </div>
              {errors.startTime && <span className="error-message">{errors.startTime}</span>}
            </div>

            <div className="time-field">
              <label htmlFor="endTime" className="form-label">
                End Time <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon">🕐</span>
                <select
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={(e) => onChange('endTime', e.target.value)}
                  className={`form-select ${errors.endTime ? 'error' : ''}`}
                  disabled={isLoading}
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
              </div>
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleSession;