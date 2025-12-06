import React from 'react';
import { MapPin } from 'lucide-react';
import InputField from '../../common/InputField';
import Textarea from '../../common/Textarea';

const AboutYou = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">About You</h2>
      
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
          <strong>Note:</strong> You can act as both a tutor and tutee on Studdy. 
          Share your knowledge in subjects you excel at while learning from peers in other areas.
        </p>
      </div>
    </div>
  );
};

export default AboutYou;