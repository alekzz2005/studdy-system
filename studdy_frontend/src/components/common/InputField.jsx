import React from 'react';

const InputField = ({ 
  icon: Icon, 
  label, 
  type = 'text', 
  placeholder, 
  name, 
  value, 
  onChange,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full py-3 border-2 rounded-lg focus:outline-none transition-colors
            ${Icon ? 'pl-12 pr-4' : 'px-4'}
            ${error 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-500'
            }
          `}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;