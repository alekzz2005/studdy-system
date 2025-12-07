import React from 'react';
import { User, Phone, MapPin, Calendar, BookOpen } from 'lucide-react';

const TutorProfileCard = ({ currentUser }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">My Tutor Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                {currentUser.firstName} {currentUser.lastName}
              </h4>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
          </div>
          
          {currentUser.bio && (
            <div className="mt-4">
              <p className="text-gray-700">{currentUser.bio}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {currentUser.phoneNumber && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-3" />
              <span>{currentUser.phoneNumber}</span>
            </div>
          )}
          
          {currentUser.address && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-3" />
              <span>{currentUser.address}</span>
            </div>
          )}
          
          {currentUser.dateStarted && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-3" />
              <span>Tutoring since: {formatDate(currentUser.dateStarted)}</span>
            </div>
          )}
          
          {currentUser.gradeLevel > 0 && (
            <div className="flex items-center text-gray-600">
              <BookOpen className="w-4 h-4 mr-3" />
              <span>Grade Level: {currentUser.gradeLevel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorProfileCard;