import React from 'react';

const StatsCard = ({ stat }) => {
  return (
    <div className="stats-card">
      <div className="stats-label">{stat.label}</div>
      <div className="stats-value">{stat.value}</div>
    </div>
  );
};

export default StatsCard;