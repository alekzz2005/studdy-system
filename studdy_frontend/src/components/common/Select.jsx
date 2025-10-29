import React from 'react';

const Select = ({ 
  icon: Icon, 
  label, 
  options, 
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
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`input-field ${Icon ? 'input-with-icon' : ''} appearance-none bg-white ${error ? 'border-red-500' : ''}`}
        >
          <option value="">Select...</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;