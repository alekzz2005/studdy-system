import React from 'react';

const IconWrapper = ({ children, className = '' }) => (
  <div className={`icon-wrapper ${className}`}>
    {children}
  </div>
);

export default IconWrapper;