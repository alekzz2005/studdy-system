import React from 'react';
import StatusBadge from './common/StatusBadge';
import Button from './common/Button';

const SessionCard = ({ session }) => {
  return (
    <div className="session-card">
      <div className="session-content">
        <div className="session-info">
          <div className="session-icon">
            <i className="fas fa-book"></i>
          </div>
          
          <div className="session-details">
            <h4 className="session-subject">{session.subject}</h4>
            <p className="session-tutor">{session.tutor}</p>
            <div className="session-date">
              <i className="fas fa-clock"></i>
              <span>{session.date}</span>
            </div>
          </div>
        </div>

        <div className="session-actions">
          <StatusBadge status={session.status} />
          <Button variant="secondary" size="small">
            Join
          </Button>
          {session.status === 'pending' && (
            <Button variant="danger" size="small">
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;