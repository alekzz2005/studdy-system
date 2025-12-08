import React, { useState, useEffect } from 'react';
import { School, Edit2, Save, X, RefreshCw } from 'lucide-react';

const AcademicInfoCard = ({
  user,
  editingSection,
  setEditingSection,
  onSave,
  saving,
  setError,
  formatDate
}) => {
  const [formData, setFormData] = useState({
    school: '',
    gradeLevel: '',
    major: '',
    bio: ''
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        school: user.school || '',
        gradeLevel: user.gradeLevel || '',
        major: user.major || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.school) {
      setError('School is required');
      return;
    }

    await onSave(formData);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({
      school: user.school || '',
      gradeLevel: user.gradeLevel || '',
      major: user.major || '',
      bio: user.bio || ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
              <p className="text-sm text-gray-600">Your educational background</p>
            </div>
          </div>
          {editingSection !== 'academic' && (
            <button 
              onClick={() => setEditingSection('academic')}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {editingSection === 'academic' ? (
          <EditForm 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            saving={saving}
          />
        ) : (
          <ViewContent user={user} formatDate={formatDate} />
        )}
      </div>
    </div>
  );
};

const EditForm = ({ formData, handleInputChange, handleSave, handleCancel, saving }) => {
  const gradeLevelOptions = [
    { value: '', label: 'Select Grade/Year' },
    { value: '1', label: '1st Grade' },
    { value: '2', label: '2nd Grade' },
    { value: '3', label: '3rd Grade' },
    { value: '4', label: '4th Grade' },
    { value: '5', label: '5th Grade' },
    { value: '6', label: '6th Grade' },
    { value: '7', label: '7th Grade' },
    { value: '8', label: '8th Grade' },
    { value: '9', label: '9th Grade' },
    { value: '10', label: '10th Grade' },
    { value: '11', label: '1st Year Senior High' },
    { value: '12', label: '2nd Year Senior High' },
    { value: '13', label: '1st Year College' },
    { value: '14', label: '2nd Year College' },
    { value: '15', label: '3rd Year College' },
    { value: '16', label: '4th Year College' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          School *
        </label>
        <input
          type="text"
          name="school"
          value={formData.school}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade Level / Year
          </label>
          <select
            name="gradeLevel"
            value={formData.gradeLevel}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {gradeLevelOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Major / Course
          </label>
          <input
            type="text"
            name="major"
            value={formData.major}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

const ViewContent = ({ user, formatDate }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">School</p>
        <p className="font-medium text-gray-900">{user.school || 'Not provided'}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">Grade Level / Year</p>
        <p className="font-medium text-gray-900">
          {getGradeLevelLabel(user.gradeLevel)}
        </p>
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">Major / Course</p>
        <p className="font-medium text-gray-900">{user.major || 'Not provided'}</p>
      </div>
    </div>
    {user.bio && (
      <div className="sm:col-span-2 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">Bio</p>
        <p className="text-gray-700">{user.bio}</p>
      </div>
    )}
  </div>
);

const getGradeLevelLabel = (gradeLevel) => {
  if (!gradeLevel) return 'Not provided';
  
  const grade = parseInt(gradeLevel);
  
  if (grade >= 1 && grade <= 6) {
    return `${grade}${getOrdinalSuffix(grade)} Grade`;
  } else if (grade >= 7 && grade <= 10) {
    return `${grade}${getOrdinalSuffix(grade)} Grade`;
  } else if (grade === 11) {
    return '1st Year Senior High';
  } else if (grade === 12) {
    return '2nd Year Senior High';
  } else if (grade === 13) {
    return '1st Year College';
  } else if (grade === 14) {
    return '2nd Year College';
  } else if (grade === 15) {
    return '3rd Year College';
  } else if (grade === 16) {
    return '4th Year College';
  }
  return gradeLevel;
};

const getOrdinalSuffix = (n) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
};

export default AcademicInfoCard;