import React, { useState, useEffect } from 'react';
import { User, Edit2, Save, X, RefreshCw } from 'lucide-react';

const BasicInfoCard = ({
  user,
  editingSection,
  setEditingSection,
  onSave,
  saving,
  setError,
  formatDate
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: ''
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.user.firstName || '',
        lastName: user.user.lastName || '',
        email: user.user.email || '',
        phoneNumber: user.user.phoneNumber || '',
        dateOfBirth: user.user.dateOfBirth || '',
        address: user.user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return;
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return;
    }

    await onSave(formData);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({
      firstName: user.user.firstName || '',
      lastName: user.user.lastName || '',
      email: user.user.email || '',
      phoneNumber: user.user.phoneNumber || '',
      dateOfBirth: user.user.dateOfBirth || '',
      address: user.user.address || ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <p className="text-sm text-gray-600">Your personal details</p>
            </div>
          </div>
          
          {editingSection !== 'basic' && (
            <div className="flex-shrink-0">
              <button 
                onClick={() => setEditingSection('basic')}
                className="flex items-center space-x-1.5 text-green-600 hover:text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {editingSection === 'basic' ? (
          <EditForm 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            saving={saving}
          />
        ) : (
          <ViewContent user={user.user} formatDate={formatDate} />
        )}
      </div>
    </div>
  );
};

const EditForm = ({ formData, handleInputChange, handleSave, handleCancel, saving }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name *
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name *
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email *
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Phone Number
      </label>
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date of Birth
      </label>
      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Address
      </label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
        <p className="text-sm text-gray-500 mb-1">Full Name</p>
        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">Email</p>
        <p className="font-medium text-gray-900">{user.email}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">Phone</p>
        <p className="font-medium text-gray-900">{user.phoneNumber || 'Not provided'}</p>
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
        <p className="font-medium text-gray-900">{formatDate(user.dateOfBirth)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">Address</p>
        <p className="font-medium text-gray-900">{user.address || 'Not provided'}</p>
      </div>
    </div>
  </div>
);

export default BasicInfoCard;