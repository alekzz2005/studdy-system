import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  const combinedClasses = `card ${className}`.trim();

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;