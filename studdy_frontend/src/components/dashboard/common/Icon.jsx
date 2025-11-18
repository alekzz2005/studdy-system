import React from 'react';

const Icon = ({ color, className = '' }) => (
  <div 
    className={`icon ${className}`}
    style={{ background: color }}
  />
);

export default Icon;