import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  Edit2,
  Save,
  X,
  Star,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  ArrowLeft,
  RefreshCw,
  Target,
  Activity,
  Briefcase,
  Hash,
  Globe,
  School,
  Info
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states for different sections
  const [basicInfoForm, setBasicInfoForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: ''
  });

  const [academicInfoForm, setAcademicInfoForm] = useState({
    school: '',
    gradeLevel: '',
    major: '',
    bio: ''
  });

  // Subject management state
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectDescription, setSubjectDescription] = useState('');

  // Fetch profile data on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Mock data structure matching backend entities
      const mockProfile = {
        user: {
          userId: 1,
          firstName: 'John',
          lastName: 'Dela Cruz',
          email: 'john.delacruz@email.com',
          phoneNumber: '+63 912 345 6789',
          dateOfBirth: '2000-05-15',
          address: '123 Main St, Sual, Pangasinan',
          bio: 'Passionate about learning and helping others understand complex mathematical concepts. Currently pursuing BS Mathematics.',
          school: 'Pangasinan State University',
          gradeLevel: 3,
          major: 'BS Mathematics',
          dateStarted: '2024-01-15',
          type: 'Tutor', // 'Tutor' or 'Tutee'
          active: true
        },
        tutor: {
          tutorId: 101,
          averageRating: 4.8,
          isAvailable: true
        },
        tutee: null,
        tutorSubjects: [
          {
            tutorSubjectId: 1,
            subject: {
              subjectId: 1,
              subjectName: 'Calculus',
              subjectDesc: 'Advanced calculus and mathematical analysis'
            }
          },
          {
            tutorSubjectId: 2,
            subject: {
              subjectId: 2,
              subjectName: 'Linear Algebra',
              subjectDesc: 'Matrices, vectors, and linear transformations'
            }
          },
          {
            tutorSubjectId: 3,
            subject: {
              subjectId: 3,
              subjectName: 'Statistics',
              subjectDesc: 'Probability and statistical inference'
            }
          }
        ],
        sessions: [
          {
            sessionId: 1,
            subjectName: 'Calculus',
            date: '2024-11-15',
            duration: 90,
            status: 'completed',
            rating: 5,
            feedback: 'Excellent session! Very clear explanations.',
            role: 'tutor'
          },
          {
            sessionId: 2,
            subjectName: 'Linear Algebra',
            date: '2024-11-20',
            duration: 60,
            status: 'completed',
            rating: 5,
            feedback: 'Great patience and understanding.',
            role: 'tutor'
          }
        ],
        availableSubjects: [
          { subjectId: 4, subjectName: 'Geometry', subjectDesc: 'Euclidean and analytical geometry' },
          { subjectId: 5, subjectName: 'Physics', subjectDesc: 'Mechanics and thermodynamics' }
        ]
      };

      setUserProfile(mockProfile);
      // Initialize forms
      setBasicInfoForm({
        firstName: mockProfile.user.firstName,
        lastName: mockProfile.user.lastName,
        email: mockProfile.user.email,
        phoneNumber: mockProfile.user.phoneNumber,
        dateOfBirth: mockProfile.user.dateOfBirth,
        address: mockProfile.user.address
      });
      setAcademicInfoForm({
        school: mockProfile.user.school,
        gradeLevel: mockProfile.user.gradeLevel,
        major: mockProfile.user.major,
        bio: mockProfile.user.bio
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (formType, e) => {
    const { name, value } = e.target;
    if (formType === 'basic') {
      setBasicInfoForm(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'academic') {
      setAcademicInfoForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const startEditing = (section) => {
    setEditingSection(section);
    setError('');
    setSuccessMessage('');
  };

  const cancelEditing = () => {
    setEditingSection(null);
    // Reset forms to original data
    if (userProfile) {
      setBasicInfoForm({
        firstName: userProfile.user.firstName,
        lastName: userProfile.user.lastName,
        email: userProfile.user.email,
        phoneNumber: userProfile.user.phoneNumber,
        dateOfBirth: userProfile.user.dateOfBirth,
        address: userProfile.user.address
      });
      setAcademicInfoForm({
        school: userProfile.user.school,
        gradeLevel: userProfile.user.gradeLevel,
        major: userProfile.user.major,
        bio: userProfile.user.bio
      });
    }
  };

  const saveBasicInfo = async () => {
    setSaving(true);
    setError('');
    
    try {
      if (!basicInfoForm.firstName || !basicInfoForm.lastName) {
        setError('First name and last name are required');
        setSaving(false);
        return;
      }
      
      if (!basicInfoForm.email || !/\S+@\S+\.\S+/.test(basicInfoForm.email)) {
        setError('Valid email is required');
        setSaving(false);
        return;
      }

      // TODO: API call to update basic info
      // await userAPI.updateUserProfile(userProfile.user.userId, basicInfoForm);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserProfile(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...basicInfoForm
        }
      }));
      
      setEditingSection(null);
      setSuccessMessage('Basic information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to update information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveAcademicInfo = async () => {
    setSaving(true);
    setError('');
    
    try {
      if (!academicInfoForm.school) {
        setError('School is required');
        setSaving(false);
        return;
      }

      // TODO: API call to update academic info
      // await userAPI.updateUserProfile(userProfile.user.userId, academicInfoForm);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserProfile(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...academicInfoForm
        }
      }));
      
      setEditingSection(null);
      setSuccessMessage('Academic information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving academic info:', error);
      setError('Failed to update academic information');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubject = async () => {
    if (!selectedSubject) {
      setError('Please select a subject');
      return;
    }

    try {
      // TODO: API call to add subject
      const subjectToAdd = userProfile.availableSubjects.find(
        s => s.subjectId === parseInt(selectedSubject)
      );
      
      if (subjectToAdd) {
        const newTutorSubject = {
          tutorSubjectId: Date.now(),
          subject: {
            ...subjectToAdd,
            subjectDesc: subjectDescription || subjectToAdd.subjectDesc
          }
        };
        
        setUserProfile(prev => ({
          ...prev,
          tutorSubjects: [...prev.tutorSubjects, newTutorSubject],
          availableSubjects: prev.availableSubjects.filter(
            s => s.subjectId !== subjectToAdd.subjectId
          )
        }));
        
        setSelectedSubject('');
        setSubjectDescription('');
        setSuccessMessage('Subject added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      setError('Failed to add subject');
    }
  };

  const handleRemoveSubject = async (tutorSubjectId) => {
    if (!window.confirm('Are you sure you want to remove this subject?')) return;

    try {
      // TODO: API call to remove subject
      const removedSubject = userProfile.tutorSubjects.find(
        ts => ts.tutorSubjectId === tutorSubjectId
      );
      
      setUserProfile(prev => ({
        ...prev,
        tutorSubjects: prev.tutorSubjects.filter(
          ts => ts.tutorSubjectId !== tutorSubjectId
        ),
        availableSubjects: removedSubject 
          ? [...prev.availableSubjects, removedSubject.subject]
          : prev.availableSubjects
      }));
      
      setSuccessMessage('Subject removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error removing subject:', error);
      setError('Failed to remove subject');
    }
  };

  const handleToggleAvailability = async () => {
    if (!userProfile.tutor) return;
    
    try {
      const newAvailability = !userProfile.tutor.isAvailable;
      // TODO: API call
      
      setUserProfile(prev => ({
        ...prev,
        tutor: {
          ...prev.tutor,
          isAvailable: newAvailability
        }
      }));
      
      setSuccessMessage(`Availability ${newAvailability ? 'enabled' : 'disabled'} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating availability:', error);
      setError('Failed to update availability');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load profile</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { user, tutor, tutorSubjects } = userProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-green-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 pt-6">My Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
            <AlertCircle className="w-5 h-5 text-green-600 mr-2" />
            {error}
          </div>
        )}

        {/* Profile Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {getInitials(user.firstName, user.lastName)}
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 text-green-600 mr-1" />
                      {user.email}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.type === 'Tutor' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.type}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">{userProfile.sessions.length}</span> sessions
                  </span>
                </div>
                
                {tutor && (
                  <>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-700">
                        <span className="font-semibold">{tutor.averageRating.toFixed(1)}</span> rating
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">
                        <span className="font-semibold">{tutorSubjects?.length || 0}</span> subjects
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${tutor.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-700">
                        {tutor.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information Card */}
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
                    <button 
                      onClick={() => startEditing('basic')}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {editingSection === 'basic' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={basicInfoForm.firstName}
                          onChange={(e) => handleInputChange('basic', e)}
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
                          value={basicInfoForm.lastName}
                          onChange={(e) => handleInputChange('basic', e)}
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
                        value={basicInfoForm.email}
                        onChange={(e) => handleInputChange('basic', e)}
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
                        value={basicInfoForm.phoneNumber}
                        onChange={(e) => handleInputChange('basic', e)}
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
                        value={basicInfoForm.dateOfBirth}
                        onChange={(e) => handleInputChange('basic', e)}
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
                        value={basicInfoForm.address}
                        onChange={(e) => handleInputChange('basic', e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        onClick={saveBasicInfo}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={cancelEditing}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            </div>

            {/* Academic Information Card */}
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
                      onClick={() => startEditing('academic')}
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School *
                      </label>
                      <input
                        type="text"
                        name="school"
                        value={academicInfoForm.school}
                        onChange={(e) => handleInputChange('academic', e)}
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
                          value={academicInfoForm.gradeLevel}
                          onChange={(e) => handleInputChange('academic', e)}
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
                          value={academicInfoForm.major}
                          onChange={(e) => handleInputChange('academic', e)}
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
                        value={academicInfoForm.bio}
                        onChange={(e) => handleInputChange('academic', e)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        onClick={saveAcademicInfo}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={cancelEditing}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
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
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Member Since</p>
                        <p className="font-medium text-gray-900">{formatDate(user.dateStarted)}</p>
                      </div>
                    </div>
                    {user.bio && (
                      <div className="sm:col-span-2 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">About Me</p>
                        <p className="text-gray-700">{user.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Tutor Information */}
          <div className="space-y-8">
            {/* Account Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Account Status</h3>
                  <p className="text-sm text-gray-600">Your account information</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Type</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.type === 'Tutor' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.type}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">{formatDate(user.dateStarted)}</span>
                </div>
              </div>
            </div>

            {/* Tutor-specific Information */}
            {tutor && (
              <>
                {/* Tutor Availability
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Availability</h3>
                        <p className="text-sm text-gray-600">Accept new bookings</p>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleAvailability}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        tutor.isAvailable ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          tutor.isAvailable ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      tutor.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {tutor.isAvailable ? 'Available for Sessions' : 'Currently Unavailable'}
                    </span>
                  </div>
                </div> */}

                {/* Tutor Subjects */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">My Subjects</h3>
                          <p className="text-sm text-gray-600">What I teach</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingSection(editingSection === 'subjects' ? null : 'subjects');
                          setSelectedSubject('');
                          setSubjectDescription('');
                        }}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {editingSection === 'subjects' && (
                      <div className="mb-4 p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Add New Subject</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Select Subject
                            </label>
                            <select
                              value={selectedSubject}
                              onChange={(e) => setSelectedSubject(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="">Choose a subject...</option>
                              {userProfile.availableSubjects.map(subject => (
                                <option key={subject.subjectId} value={subject.subjectId}>
                                  {subject.subjectName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleAddSubject}
                              disabled={!selectedSubject}
                              className="flex-1 bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              Add Subject
                            </button>
                            <button
                              onClick={() => setEditingSection(null)}
                              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {tutorSubjects && tutorSubjects.length > 0 ? (
                      <div className="space-y-3">
                        {tutorSubjects.map(tutorSubject => (
                          <div 
                            key={tutorSubject.tutorSubjectId}
                            className="group flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                                <BookOpen className="w-3 h-3 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {tutorSubject.subject.subjectName}
                                </h4>
                                <p className="text-xs text-gray-600 truncate max-w-[200px]">
                                  {tutorSubject.subject.subjectDesc}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveSubject(tutorSubject.tutorSubjectId)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1"
                              title="Remove subject"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No subjects added yet</p>
                        <button 
                          onClick={() => setEditingSection('subjects')}
                          className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Add your first subject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tutor Rating
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Rating</h3>
                      <p className="text-sm text-gray-600">Based on {userProfile.sessions.length} sessions</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {tutor.averageRating.toFixed(1)}
                      <span className="text-lg text-gray-600">/5</span>
                    </div>
                    <div className="flex items-center justify-center mb-4">
                      {renderStars(tutor.averageRating)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Keep up the great work! 🎉
                    </div>
                  </div>
                </div> */}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;