// components/auth/RegisterSteps/AcademicInfo.jsx
import React from 'react';
import { BookOpen, GraduationCap, Target } from 'lucide-react';
import InputField from '../../common/InputField';
import Select from '../../common/Select';
import Textarea from '../../common/Textarea';

const AcademicInfo = ({ formData, onChange, errors }) => {
  const gradeLevels = [
    { value: 0, label: 'Select grade level' },
    { value: 7, label: 'Grade 7' },
    { value: 8, label: 'Grade 8' },
    { value: 9, label: 'Grade 9' },
    { value: 10, label: 'Grade 10' },
    { value: 11, label: 'Grade 11' },
    { value: 12, label: 'Grade 12' },
    { value: 13, label: 'College - 1st Year' },
    { value: 14, label: 'College - 2nd Year' },
    { value: 15, label: 'College - 3rd Year' },
    { value: 16, label: 'College - 4th Year' },
    { value: 17, label: 'Postgraduate' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'gradeLevel') {
      onChange({
        target: {
          name,
          value: value === '' ? '' : Number(value) 
        }
      });
    } else {
      onChange(e);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Academic Information</h2>
      
      {/* School/University - Full width */}
      <InputField
        icon={BookOpen}
        label="School/University"
        type="text"
        name="school"
        placeholder="Cebu Institute of Technology - University"
        value={formData.school}
        onChange={handleChange}
        error={errors.school}
        required
      />

      {/* Grade Level and Major in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          icon={GraduationCap}
          label="Grade Level"
          name="gradeLevel"
          options={gradeLevels}
          value={formData.gradeLevel}
          onChange={handleChange}
          error={errors.gradeLevel}
          required
        />

        <InputField
          icon={Target}
          label="Major"
          type="text"
          name="major"
          placeholder="Information Technology"
          value={formData.major}
          onChange={handleChange}
          error={errors.major}
        />
      </div>
    </div>
  );
};

export default AcademicInfo;