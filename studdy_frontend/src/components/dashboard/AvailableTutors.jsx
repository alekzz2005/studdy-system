import React from 'react';
import { User, Star } from 'lucide-react';

const AvailableTutors = ({ tutors, loading, onBookSession, onViewAll }) => {
  const getInitials = (name) => {
    const parts = name.split(' ');
    return `${parts[0]?.charAt(0) || ''}${parts[1]?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Available Tutors ({tutors.length})
            </h3>
            <p className="text-xs text-gray-500">Top rated tutors</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mb-2"></div>
            <p className="text-gray-500 text-sm">Loading tutors...</p>
          </div>
        ) : tutors.length > 0 ? (
          <>
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {tutors.slice(0, 4).map(tutor => (
                <div 
                  key={tutor.id} 
                  onClick={() => onBookSession(tutor.id)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-green-300 cursor-pointer bg-white"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold">
                        {getInitials(tutor.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{tutor.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{tutor.subject}</p>
                      {tutor.major && (
                        <p className="text-xs text-gray-500 truncate">{tutor.major}</p>
                      )}
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-gray-700">{tutor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {tutors.length > 4 && (
              <button 
                onClick={onViewAll}
                className="w-full px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
              >
                View All {tutors.length} Tutors
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No tutors available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableTutors;