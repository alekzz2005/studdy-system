import React from 'react';
import { MapPin } from 'lucide-react';
import InputField from '../../common/InputField';
import Textarea from '../../common/Textarea';

const AboutYou = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">About You</h2>
      
      {/* Added dropdown for tutor/tutee selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          I am primarily a:
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

      <InputField
        icon={MapPin}
        label="Address"
        type="text"
        name="address"
        placeholder="Cebu City, Cebu"
        value={formData.address}
        onChange={onChange}
        error={errors.address}
      />

      <Textarea
        label="Bio"
        name="bio"
        placeholder="Tell us a bit about yourself and your interests..."
        value={formData.bio}
        onChange={onChange}
        rows={4}
        error={errors.bio}
      />

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          {/* <strong>About Roles:</strong> */}
          <ul className="mt-1 space-y-1 list-disc pl-5">
            <li><strong>Tutor:</strong> Help others learn subjects you're expert in</li>
            <li><strong>Tutee:</strong> Seek help to learn new subjects from peers</li>
          </ul>
          {/* <p className="mt-2">Your selection helps us match you with the right study partners!</p> */}
        </p>
      </div>
    </div>
  );
};

export default AboutYou;