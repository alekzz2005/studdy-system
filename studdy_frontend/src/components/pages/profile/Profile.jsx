import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import ProfileOverview from './ProfileOverview';
import BasicInfoCard from './BasicInfoCard';
import AcademicInfoCard from './AcademicInfoCard';
import AccountStatusCard from './AccountStatusCard';
import TutorSubjectsCard from './TutorSubjectsCard';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

import { userAPI, userHelpers } from '../../../services/user';
import { tutorService } from '../../../services/tutor';
import { tutorSubjectService } from '../../../services/tutorsubject';
import { tuteeService } from '../../../services/tutee';
import { subjectService } from '../../../services/subject';
import { sessionService } from '../../../services/session';

import { formatDate } from './utils';

const Profile = () => {
  const navigate = useNavigate();
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch profile data on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Get current user from API
      const currentUser = await userAPI.getCurrentUser();
      const userId = currentUser.userId || currentUser.id;
      
      // Initialize variables
      let tutorData = null;
      let tuteeData = null;
      let tutorSubjects = [];
      let availableSubjects = [];
      let sessions = [];
      
      // Fetch user type specific data
      if (currentUser.type && currentUser.type.toUpperCase() === 'TUTOR') {
        try {
          // Fetch tutor data
          const tutorResponse = await tutorService.getTutorByUserId(userId);
          tutorData = tutorResponse.data || tutorResponse;
          
          // Fetch tutor subjects
          if (tutorData && tutorData.tutorId) {
            const subjectsResponse = await tutorSubjectService.getSubjectsByTutorId(tutorData.tutorId);
            tutorSubjects = Array.isArray(subjectsResponse) ? subjectsResponse : (subjectsResponse.data || []);
            
            // Fetch all available subjects
            const allSubjectsResponse = await subjectService.getAllSubjects();
            const allSubjects = Array.isArray(allSubjectsResponse) ? allSubjectsResponse : (allSubjectsResponse.data || []);
            
            // Filter out subjects the tutor already teaches
            availableSubjects = allSubjects.filter(subject => 
              !tutorSubjects.some(tutorSubject => 
                tutorSubject.subject && tutorSubject.subject.subjectId === subject.subjectId
              )
            );
          }
          
          // Fetch sessions for tutor
          if (tutorData && tutorData.tutorId) {
            try {
              const sessionsResponse = await sessionService.getSessionsByTutor(tutorData.tutorId);
              sessions = Array.isArray(sessionsResponse) ? sessionsResponse : (sessionsResponse.data || []);
            } catch (sessionsError) {
              console.error('Error fetching tutor sessions:', sessionsError);
            }
          }
        } catch (tutorError) {
          console.error('Error fetching tutor data:', tutorError);
        }
      } else if (currentUser.type && (currentUser.type.toUpperCase() === 'TUTEE' || currentUser.type.toUpperCase() === 'STUDENT')) {
        try {
          // Fetch tutee data
          const tuteeResponse = await tuteeService.getTuteeByUserId(userId);
          tuteeData = tuteeResponse.data || tuteeResponse;
          
          // Fetch sessions for tutee
          if (tuteeData && tuteeData.tuteeId) {
            try {
              const sessionsResponse = await sessionService.getSessionsByTutee(tuteeData.tuteeId);
              sessions = Array.isArray(sessionsResponse) ? sessionsResponse : (sessionsResponse.data || []);
            } catch (sessionsError) {
              console.error('Error fetching tutee sessions:', sessionsError);
            }
          }
        } catch (tuteeError) {
          console.error('Error fetching tutee data:', tuteeError);
        }
      }
      
      // Fetch user profile with all related data
      try {
        const userProfileResponse = await userAPI.getUserProfile(userId);
        const userProfileData = userProfileResponse.data || userProfileResponse;
        
        // Merge API data
        const profileData = {
          user: {
            ...currentUser,
            ...userProfileData
          },
          tutor: tutorData,
          tutee: tuteeData,
          tutorSubjects,
          sessions,
          availableSubjects
        };
        
        setUserProfile(profileData);

        console.log("Profile Data: ", profileData)
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError);
        // Fallback to basic user data
        const profileData = {
          user: currentUser,
          tutor: tutorData,
          tutee: tuteeData,
          tutorSubjects,
          sessions,
          availableSubjects
        };
        
        setUserProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.response?.data?.message || 'Failed to load profile data');
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        userHelpers.clearUserData();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoSave = async (formData) => {
    setSaving(true);
    setError('');
    
    try {
      // Prepare data for API
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      };
      
      const userId = userProfile.user.userId || userProfile.user.id;
      
      // Update user via API
      await userAPI.updateUser(userId, updateData);
      
      // Also update profile
      try {
        await userAPI.updateUserProfile(userId, updateData);
      } catch (profileError) {
        console.warn('Profile-specific update failed:', profileError);
      }
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...updateData
        }
      }));
      
      setSuccessMessage('Basic information updated successfully!');
      setEditingSection(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.message || 'Failed to update information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAcademicInfoSave = async (formData) => {
    setSaving(true);
    setError('');
    
    try {
      // Prepare data for API
      const updateData = {
        school: formData.school,
        gradeLevel: formData.gradeLevel,
        major: formData.major,
        bio: formData.bio
      };
      
      const userId = userProfile.user.userId || userProfile.user.id;
      
      // Update user via API
      await userAPI.updateUser(userId, updateData);
      
      // Also update profile
      try {
        await userAPI.updateUserProfile(userId, updateData);
      } catch (profileError) {
        console.warn('Profile-specific update failed:', profileError);
      }
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...updateData
        }
      }));
      
      setSuccessMessage('Academic information updated successfully!');
      setEditingSection(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving academic info:', error);
      setError(error.response?.data?.message || 'Failed to update academic information');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubject = async (subjectId) => {
    if (!userProfile.tutor || !userProfile.tutor.tutorId) {
      setError('Tutor data not available');
      return;
    }
    
    try {
      // Check if subject already exists for this tutor
      const existsResponse = await tutorSubjectService.existsByTutorAndSubject(
        userProfile.tutor.tutorId, 
        subjectId
      );
      
      if (existsResponse.exists || existsResponse.data?.exists) {
        setError('You already teach this subject');
        return;
      }
      
      // Create tutor subject
      const tutorSubjectData = {
        tutorId: userProfile.tutor.tutorId,
        subjectId: parseInt(subjectId)
      };
      
      const response = await tutorSubjectService.createTutorSubject(tutorSubjectData);
      const newTutorSubject = response.data || response;
      
      // Get the subject details
      const subjectResponse = await subjectService.getSubjectById(subjectId);
      const subjectData = subjectResponse.data || subjectResponse;
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        tutorSubjects: [
          ...prev.tutorSubjects,
          {
            ...newTutorSubject,
            subject: subjectData
          }
        ],
        availableSubjects: prev.availableSubjects.filter(
          s => s.subjectId !== parseInt(subjectId)
        )
      }));
      
      setSuccessMessage('Subject added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setError('');
    } catch (error) {
      console.error('Error adding subject:', error);
      setError(error.response?.data?.message || 'Failed to add subject. Please try again.');
    }
  };

  const handleRemoveSubject = async (tutorSubjectId) => {
    if (!window.confirm('Are you sure you want to remove this subject?')) return;

    try {
      // Call API to remove subject
      await tutorSubjectService.deleteTutorSubject(tutorSubjectId);
      
      // Update local state
      const removedTutorSubject = userProfile.tutorSubjects.find(
        ts => ts.tutorSubjectId === tutorSubjectId || ts.id === tutorSubjectId
      );
      
      setUserProfile(prev => ({
        ...prev,
        tutorSubjects: prev.tutorSubjects.filter(
          ts => ts.tutorSubjectId !== tutorSubjectId && ts.id !== tutorSubjectId
        ),
        availableSubjects: removedTutorSubject?.subject 
          ? [...prev.availableSubjects, removedTutorSubject.subject]
          : prev.availableSubjects
      }));
      
      setSuccessMessage('Subject removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setError('');
    } catch (error) {
      console.error('Error removing subject:', error);
      setError(error.response?.data?.message || 'Failed to remove subject');
    }
  };

  const refreshProfile = () => {
    fetchUserProfile();
  };

  // Helper function to get completion percentage
  const getProfileCompletion = (user) => {
    if (!user) return 0;
    
    const fields = [
      'firstName', 'lastName', 'email', 'phoneNumber', 
      'dateOfBirth', 'address', 'school', 'gradeLevel', 
      'major', 'bio'
    ];
    
    const completed = fields.filter(field => 
      user[field] && user[field].toString().trim()
    ).length;
    
    return Math.round((completed / fields.length) * 100);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!userProfile) {
    return <ErrorState navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigate={navigate} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <ProfileOverview 
          userProfile={userProfile} 
          getProfileCompletion={getProfileCompletion}
          refreshProfile={refreshProfile} // Add this line
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <BasicInfoCard
              user={userProfile.user}
              editingSection={editingSection}
              setEditingSection={setEditingSection}
              onSave={handleBasicInfoSave}
              saving={saving} 
              setError={setError}
              formatDate={formatDate}
            />
            
            <AcademicInfoCard
              user={userProfile.user}
              editingSection={editingSection}
              setEditingSection={setEditingSection}
              onSave={handleAcademicInfoSave}
              saving={saving}
              setError={setError}
              formatDate={formatDate}
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <AccountStatusCard 
              user={userProfile.user} 
              formatDate={formatDate} 
              profileCompletion={getProfileCompletion(userProfile.user)}
            />
            
            {userProfile.tutor && (
              <TutorSubjectsCard
                tutor={userProfile.tutor}
                tutorSubjects={userProfile.tutorSubjects}
                availableSubjects={userProfile.availableSubjects}
                editingSection={editingSection}
                setEditingSection={setEditingSection}
                onAddSubject={handleAddSubject}
                onRemoveSubject={handleRemoveSubject}
                setError={setError}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;