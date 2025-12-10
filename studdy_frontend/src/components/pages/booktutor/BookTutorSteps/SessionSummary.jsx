import React from 'react';

const SessionSummary = ({ formData, selectedTutor }) => {
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

  const formatTimeDisplay = () => {
    if (!formData.startHour || !formData.startMinute || !formData.startAmPm) {
      return 'Select time';
    }
    return `${formData.startHour}:${formData.startMinute} ${formData.startAmPm}`;
  };

  const formatEndTimeDisplay = () => {
    if (!formData.startHour || !formData.startMinute || !formData.startAmPm || !formData.duration) {
      return '';
    }
    
    let hour24 = parseInt(formData.startHour);
    if (formData.startAmPm === 'PM' && hour24 !== 12) hour24 += 12;
    else if (formData.startAmPm === 'AM' && hour24 === 12) hour24 = 0;
    
    const startDate = new Date(`2000-01-01T${hour24.toString().padStart(2, '0')}:${formData.startMinute}`);
    const durationHours = parseFloat(formData.duration);
    const endDate = new Date(startDate.getTime() + (durationHours * 60 * 60 * 1000));
    
    let endHour = endDate.getHours();
    const endMinute = endDate.getMinutes().toString().padStart(2, '0');
    const endAmPm = endHour >= 12 ? 'PM' : 'AM';
    
    endHour = endHour % 12;
    endHour = endHour === 0 ? 12 : endHour;
    
    return `${endHour}:${endMinute} ${endAmPm}`;
  };

  const shouldShowSummary = formData.sessionMonth && formData.sessionDay && formData.sessionYear && 
    formData.startHour && formData.startMinute && formData.startAmPm && formData.duration;

  if (!shouldShowSummary && !selectedTutor) {
    return null;
  }

  return (
    <div className="session-summary-enhanced">
      <h4 className="summary-title">Session Summary</h4>
      <div className="summary-details">
        {selectedTutor && (
          <div className="summary-item">
            <span className="summary-label">Tutor:</span>
            <span className="tutor-name-highlight">
              {selectedTutor.name || selectedTutor.fullName || `Tutor ${selectedTutor.tutorId}`}
            </span>
          </div>
        )}
        {shouldShowSummary && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default SessionSummary;