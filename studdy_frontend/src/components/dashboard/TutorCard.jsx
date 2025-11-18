import React from 'react';
import StatusBadge from './common/StatusBadge';
import Button from './common/Button';

const TutorCard = ({ tutor }) => {
  return (
    <div className="tutor-card">
      <div className="tutor-header">
        <div className="tutor-info">
          <div className="tutor-avatar">
            <i className="fas fa-user"></i>
          </div>
          
          <div className="tutor-details">
            <h4 className="tutor-name">{tutor.name}</h4>
            <p className="tutor-subject">{tutor.subject}</p>
          </div>
        </div>

        <StatusBadge status="available" />
      </div>

      <div className="tutor-footer">
        <div className="tutor-rating">
          <i className="fas fa-star"></i>
          <span>{tutor.rating}</span>
        </div>
        
        <Button variant="primary" size="small">
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default TutorCard;