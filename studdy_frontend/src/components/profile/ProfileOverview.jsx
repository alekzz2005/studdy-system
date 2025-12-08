import React from 'react';
import { Mail, BookOpen, Star, GraduationCap, RefreshCw } from 'lucide-react';

const ProfileOverview = ({ userProfile }) => {
  const { user, tutor, tutorSubjects, sessions } = userProfile;
  const actualUser = user.user;
  console.log('User Profile: ',userProfile)
  console.log('Tutor: ',tutor)
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-start space-x-6">
        {/* Avatar */}
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {getInitials(actualUser.firstName, actualUser.lastName)}
          </span>
        </div>
        
        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {actualUser.firstName} {actualUser.lastName}
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 text-green-600 mr-1" />
                  {actualUser.email}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  actualUser.type === 'Tutor' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {actualUser.type}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
              <BookOpen className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">
                <span className="font-semibold">{sessions?.length || 0}</span> sessions
              </span>
            </div>
            
            {tutor && (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">{tutor.averageRating?.toFixed(1) || '0.0'}</span> rating
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <GraduationCap className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">{tutorSubjects?.length || 0}</span> subjects
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;