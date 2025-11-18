import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    confirmed: {
      background: '#DCFCE7',
      color: '#15803D',
      border: '0.89px #BBF7D0 solid'
    },
    pending: {
      background: '#FEF9C3',
      color: '#A16207',
      border: '0.89px #FEF08A solid'
    },
    available: {
      background: '#DCFCE7',
      color: '#15803D',
      border: '0.89px #BBF7D0 solid'
    }
  };

  const config = statusConfig[status] || statusConfig.confirmed;

  return (
    <span 
      className="status-badge"
      style={{
        background: config.background,
        color: config.color,
        border: config.border
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;