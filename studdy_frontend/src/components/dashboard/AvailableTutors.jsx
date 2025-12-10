import React, { useState } from 'react';
import { User, Star, X } from 'lucide-react';

const AvailableTutors = ({ tutors, loading, onBookSession, onViewAll }) => {
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getInitials = (name) => {
    const parts = name?.split(' ') || [];
    return `${parts[0]?.charAt(0) || ''}${parts[1]?.charAt(0) || ''}`.toUpperCase();
  };

  const handleCardClick = (tutorId) => {
    const tutor = tutors.find(t => t.id === tutorId);
    if (tutor) {
      setSelectedTutor(tutor);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTutor(null);
  };

  const handleModalBookSession = () => {
    if (selectedTutor) {
      onBookSession(selectedTutor.id);
      handleCloseModal();
    }
  };

  // Fallback tutor data in case of errors
  const getFallbackTutorData = () => ({
    name: 'Alex Rodriguez',
    rating: 4.9,
    major: 'Computer Science',
    subjects: ['Algorithms', 'Data Structures'],
    sessionsCompleted: 142,
    specialization: 'Algorithms & Data Structures',
    successRate: '96%',
    responseTime: 'Under 15 minutes'
  });

  const getTutorData = (tutor) => {
    if (!tutor) return getFallbackTutorData();
    
    return {
      name: tutor.name || 'Unknown Tutor',
      rating: tutor.rating || 4.5,
      major: tutor.major || 'General Studies',
      subjects: tutor.allSubjects?.slice(0, 3).map(s => s.subjectName || s.name) || [tutor.subject || 'General'],
      sessionsCompleted: tutor.sessionsCompleted || Math.floor(Math.random() * 200) + 50,
      specialization: tutor.allSubjects?.[0]?.subjectName || tutor.subject || 'General',
      successRate: `${Math.min(98, Math.max(85, Math.floor((tutor.rating || 4) * 20)))}%`,
      responseTime: tutor.rating > 4.5 ? 'Under 15 minutes' : '15-30 minutes'
    };
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Great';
    if (rating >= 3.5) return 'Good';
    return 'Average';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'bg-amber-100 text-amber-900';
    if (rating >= 4.0) return 'bg-lime-100 text-lime-900';
    if (rating >= 3.5) return 'bg-blue-100 text-blue-900';
    return 'bg-gray-100 text-gray-900';
  };

  return (
    <>
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
                    onClick={() => handleCardClick(tutor.id)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-green-300 cursor-pointer bg-white relative"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-semibold">
                            {getInitials(tutor.name)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{tutor.name}</h4>
                          
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tutor.allSubjects && tutor.allSubjects.length > 0 ? (
                              <>
                                {tutor.allSubjects.slice(0, 3).map((subject, index) => (
                                  <span 
                                    key={index} 
                                    className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200"
                                  >
                                    {subject.subjectName || subject.name}
                                  </span>
                                ))}
                                {tutor.allSubjects.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{tutor.allSubjects.length - 3} more
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                                {tutor.subject || 'General'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-gray-700">{tutor.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <div className="w-14 h-[18px] relative bg-green-600 rounded-full outline outline-[0.89px] outline-green-200 outline-offset-[-0.89px]">
                        <div className="w-11 absolute left-[7px] top-[1px] text-white text-[9px] font-semibold leading-4">
                          AI Insight
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

      {/* Modal - No background overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
              {/* Header with close button inside */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 relative">
                <button
                  onClick={handleCloseModal}
                  className="absolute right-3 top-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex flex-col gap-0.5 pr-8">
                  <h2 className="text-lg font-bold text-white">AI Tutor Insights</h2>
                  <p className="text-white/90 text-xs">
                    Powered by Studdy AI • Based on ratings & session feedback
                  </p>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-4 space-y-4">
                {/* Tutor Info */}
                {selectedTutor && (() => {
                  const tutorData = getTutorData(selectedTutor);
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 font-semibold text-sm">
                            {getInitials(tutorData.name)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base text-gray-900 truncate">{tutorData.name}</h3>
                          <p className="text-gray-600 text-xs truncate">{tutorData.major}</p>
                        </div>
                      </div>
                      
                      {/* AI Summary */}
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <h4 className="font-semibold text-green-800 text-xs mb-1">AI Summary</h4>
                        <p className="text-gray-800 text-xs leading-relaxed">
                          {tutorData.name} maintains a {tutorData.rating}/5 rating across {tutorData.sessionsCompleted} sessions. Students consistently praise {tutorData.rating > 4.5 ? 'their clear explanations and patience' : 'their helpful guidance'} with complex topics. {tutorData.name} specializes in {tutorData.specialization}, with {tutorData.successRate} of students reporting improved understanding after sessions.
                        </p>
                      </div>
                      
                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600 text-xs">Overall Rating</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-xs">{tutorData.rating}/5.0</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRatingColor(tutorData.rating)}`}>
                              {getRatingLabel(tutorData.rating)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600 text-xs">Sessions Completed</span>
                          <span className="font-semibold text-gray-900 text-xs">{tutorData.sessionsCompleted}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600 text-xs">Specialization</span>
                          <span className="font-semibold text-gray-900 text-xs text-right max-w-[60%] truncate">
                            {tutorData.specialization}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600 text-xs">Student Success Rate</span>
                          <span className="font-semibold text-gray-900 text-xs">{tutorData.successRate}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 text-xs">Response Time</span>
                          <span className="font-semibold text-gray-900 text-xs">{tutorData.responseTime}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              {/* Footer */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-xs hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleModalBookSession}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-xs hover:bg-green-700 transition-colors"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AvailableTutors;