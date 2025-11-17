import React from 'react';
import { User, Mail, Lock, Phone, Calendar } from 'lucide-react';
import InputField from '../../common/InputField';

const BasicInfo = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
      
      <InputField
        icon={User}
        label="First Name"
        type="text"
        name="firstName"
        placeholder="John"
        value={formData.firstName}
        onChange={onChange}
        error={errors.name}
        required
      />

      <InputField
        icon={User}
        label="Last Name"
        type="text"
        name="lastName"
        placeholder="Doe"
        value={formData.lastName}
        onChange={onChange}
        error={errors.name}
        required
      />

      <div className="form-grid">
        <InputField
          icon={Mail}
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
          required
        />

        <InputField
          icon={Phone}
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          placeholder="+63 912 345 6789"
          value={formData.phoneNumber}
          onChange={onChange}
          error={errors.phoneNumber}
          required
        />
      </div>

      <InputField
        icon={Calendar}
        label="Date of Birth"
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={onChange}
        error={errors.dateOfBirth}
      />

      <div className="form-grid">
        <InputField
          icon={Lock}
          label="Password"
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={onChange}
          error={errors.password}
          required
        />

        <InputField
          icon={Lock}
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
          required
        />
      </div>
    </div>
  );
};

export default BasicInfo;