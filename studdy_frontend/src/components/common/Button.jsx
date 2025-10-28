import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  onClick, 
  className = '',
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  };
  const widthClass = fullWidth ? 'btn-full' : '';
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;