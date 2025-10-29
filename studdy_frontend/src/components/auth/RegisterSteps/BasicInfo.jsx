import React from 'react';
import { User, Mail, Lock, Phone, Calendar } from 'lucide-react';
import InputField from '../../common/InputField';

const BasicInfo = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
      
      <InputField
        icon={User}
        label="Full Name"
        type="text"
        name="name"
        placeholder="John Doe"
        value={formData.name}
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
          name="phone_number"
          placeholder="+63 912 345 6789"
          value={formData.phone_number}
          onChange={onChange}
          error={errors.phone_number}
          required
        />
      </div>

      <InputField
        icon={Calendar}
        label="Date of Birth"
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={onChange}
        error={errors.date_of_birth}
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