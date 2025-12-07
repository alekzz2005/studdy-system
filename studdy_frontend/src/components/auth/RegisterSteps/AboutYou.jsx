// components/auth/RegisterSteps/AboutYou.jsx
import React from 'react';
import { MapPin, User } from 'lucide-react';
import InputField from '../../common/InputField';
import Textarea from '../../common/Textarea';

const AboutYou = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">About You</h2>
      
      {/* Role selection first */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-2 mb-1">
            <User className="w-4 h-4 text-gray-500" />
            <span>I am primarily a:</span>
          </div>
        </label>
        <select
          name="type"
          value={formData.type || ''}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your primary role</option>
          <option value="tutor">Tutor</option>
          <option value="tutee">Tutee</option>
        </select>
        {errors.type && (
          <p className="text-sm text-red-600 mt-1">{errors.type}</p>
        )}
      </div>

      {/* Address field */}
      <InputField
        icon={MapPin}
        label="Address"
        type="text"
        name="address"
        placeholder="Cebu City, Cebu"
        value={formData.address}
        onChange={onChange}
        error={errors.address}
        required
      />

      {/* Bio field */}
      <Textarea
        label="Bio"
        name="bio"
        placeholder="Tell us a bit about yourself and your interests..."
        value={formData.bio}
        onChange={onChange}
        rows={4}
        error={errors.bio}
        required
      />

      {/* Role information note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>About Roles:</strong>
          <ul className="mt-2 space-y-2 pl-5">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <div>
                <strong className="text-green-700">Tutor:</strong>
                <span className="text-green-600 ml-1">Help others learn subjects you're expert in</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <div>
                <strong className="text-green-700">Tutee:</strong>
                <span className="text-green-600 ml-1">Seek help to learn new subjects from peers</span>
              </div>
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
};

export default AboutYou;