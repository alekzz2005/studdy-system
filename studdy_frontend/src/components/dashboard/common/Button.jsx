import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick, 
  className = '',
  icon 
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button className={buttonClass} onClick={onClick}>
      {icon && <i className={icon}></i>}
      {children}
    </button>
  );
};

export default Button;