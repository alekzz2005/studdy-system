import React from 'react';
import { BookOpen, GraduationCap, Target } from 'lucide-react';
import InputField from '../../common/InputField';
import Select from '../../common/Select';
import Textarea from '../../common/Textarea';

const AcademicInfo = ({ formData, onChange, errors }) => {
  const gradeLevels = [
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' },
    { value: 'college_1', label: 'College - 1st Year' },
    { value: 'college_2', label: 'College - 2nd Year' },
    { value: 'college_3', label: 'College - 3rd Year' },
    { value: 'college_4', label: 'College - 4th Year' }
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Academic Information</h2>
      
      <InputField
        icon={BookOpen}
        label="School/University"
        type="text"
        name="school"
        placeholder="University of the Philippines"
        value={formData.school}
        onChange={onChange}
        error={errors.school}
        required
      />

      <div className="form-grid">
        <Select
          icon={GraduationCap}
          label="Grade Level"
          name="grade_level"
          options={gradeLevels}
          value={formData.grade_level}
          onChange={onChange}
          error={errors.grade_level}
          required
        />

        <InputField
          icon={Target}
          label="Major/Specialization"
          type="text"
          name="major"
          placeholder="Computer Science"
          value={formData.major}
          onChange={onChange}
          error={errors.major}
        />
      </div>

      <Textarea
        label="Learning Goals"
        name="goals"
        placeholder="What do you want to achieve on Studdy?"
        value={formData.goals}
        onChange={onChange}
        rows={3}
        error={errors.goals}
      />
    </div>
  );
};

export default AcademicInfo;