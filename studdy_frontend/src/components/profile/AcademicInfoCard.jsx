import React, { useState } from 'react';
import { School, Edit2, Save, X, RefreshCw } from 'lucide-react';

const AcademicInfoCard = ({
  user,
  editingSection,
  setEditingSection,
  setSaving,
  saving,
  setError,
  setSuccessMessage,
  formatDate
}) => {
  const [formData, setFormData] = useState({
    school: user.school,
    gradeLevel: user.gradeLevel,
    major: user.major,
    bio: user.bio
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      if (!formData.school) {
        setError('School is required');
        setSaving(false);
        return;
      }

      // TODO: API call to update academic info
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Academic information updated successfully!');
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving academic info:', error);
      setError('Failed to update academic information');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({
      school: user.school,
      gradeLevel: user.gradeLevel,
      major: user.major,
      bio: user.bio
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

const EditForm = ({ formData, handleInputChange, handleSave, handleCancel, saving }) => (
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
        <input
          type="number"
          name="gradeLevel"
          value={formData.gradeLevel}
          onChange={handleInputChange}
          min="1"
          max="12"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
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

const ViewContent = ({ user, formatDate }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">School</p>
        <p className="font-medium text-gray-900">{user.school}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">Grade Level / Year</p>
        <p className="font-medium text-gray-900">
          {user.gradeLevel > 0 ? `Year ${user.gradeLevel}` : 'Not provided'}
        </p>
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">Major / Course</p>
        <p className="font-medium text-gray-900">{user.major}</p>
      </div>
    </div>
    {user.bio && (
      <div className="sm:col-span-2 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">About Me</p>
        <p className="text-gray-700">{user.bio}</p>
      </div>
    )}
  </div>
);

export default AcademicInfoCard;