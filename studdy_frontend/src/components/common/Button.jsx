import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled, 
  fullWidth = false,
  type = 'button',
  className = '',
  size = 'medium'
}) => {
  // Base styles for all buttons
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
  
  // Size variations
  const sizes = {
    small: 'px-4 py-2.5 text-sm',
    medium: 'px-6 py-3 text-sm',
    large: 'px-8 py-3.5 text-base'
  };
  
  // Color variants matching your app's green theme
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300',
    outline: 'bg-transparent border border-green-600 text-green-600 hover:bg-green-50',
    ghost: 'bg-transparent text-green-600 hover:bg-green-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabledStyles}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;