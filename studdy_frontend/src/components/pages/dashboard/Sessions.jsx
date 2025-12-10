import React, { useState, useRef, useEffect } from 'react';
import { Calendar, RefreshCw, BookOpen, Clock, CalendarPlus, CalendarX, CheckCircle, XCircle, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import { sessionService } from '../../../services/session';

const Sessions = ({ sessions, loading, onRefresh, onBookSession, userType, currentUserId }) => {
  const [processingSession, setProcessingSession] = useState(null);
  const [actionType, setActionType] = useState('');
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const sessionsContainerRef = useRef(null);
  const VISIBLE_LIMIT = 4;

  useEffect(() => {
    setVisibleStartIndex(0);
  }, [sessions]);

  const handleAccept = async (sessionId) => {
    try {
      setProcessingSession(sessionId);
      setActionType('accept');
      await sessionService.updateSessionStatus(sessionId, 'Confirmed');
      onRefresh();
    } catch (error) {
      console.error('Error accepting session:', error);
    } finally {
      setProcessingSession(null);
      setActionType('');
    }
  };

  const handleDecline = async (sessionId) => {
    try {
      setProcessingSession(sessionId);
      setActionType('decline');
      await sessionService.updateSessionStatus(sessionId, 'Declined');
      onRefresh();
    } catch (error) {
      console.error('Error declining session:', error);
    } finally {
      setProcessingSession(null);
      setActionType('');
    }
  };

  const handleCancel = async (sessionId) => {
    try {
      setProcessingSession(sessionId);
      setActionType('cancel');
      await sessionService.updateSessionStatus(sessionId, 'Cancelled');
      onRefresh();
    } catch (error) {
      console.error('Error cancelling session:', error);
    } finally {
      setProcessingSession(null);
      setActionType('');
    }
  };

  const isProcessing = (sessionId, type) => {
    return processingSession === sessionId && actionType === type;
  };

  const canTutorCancel = (session) => {
    return userType === 'TUTOR' && 
           (session.status === 'Confirmed' || session.status === 'confirmed');
  };

  const canTutorRespond = (session) => {
    return userType === 'TUTOR' && 
           (session.status === 'Pending' || session.status === 'pending');
  };

  // NEW: Check if tutee can cancel (only pending sessions)
  const canTuteeCancel = (session) => {
    return userType === 'TUTEE' && 
           (session.status === 'Pending' || session.status === 'pending');
  };

  const handleNext = () => {
    if (visibleStartIndex + VISIBLE_LIMIT < sessions.length) {
      setVisibleStartIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (visibleStartIndex > 0) {
      setVisibleStartIndex(prev => prev - 1);
    }
  };

  // Get visible sessions
  const visibleSessions = sessions.slice(visibleStartIndex, visibleStartIndex + VISIBLE_LIMIT);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Sessions</h3>
              <p className="text-sm text-gray-500">
                {sessions.length > 0 
                  ? `Your tutoring sessions (${sessions.length} total)`
                  : 'Your tutoring sessions'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {sessions.length > VISIBLE_LIMIT && (
              <div className="flex items-center space-x-2 mr-4">
                <button
                  onClick={handlePrev}
                  disabled={visibleStartIndex === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-sm text-gray-500">
                  {visibleStartIndex + 1}-{Math.min(visibleStartIndex + VISIBLE_LIMIT, sessions.length)} of {sessions.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={visibleStartIndex + VISIBLE_LIMIT >= sessions.length}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
            
            <button 
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Refresh sessions"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={sessionsContainerRef}
        className="p-6 overflow-y-auto max-h-[500px]" // Added max-height and overflow for scroll
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500">Loading your sessions...</p>
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {visibleSessions.map(session => {
              const sessionId = session.id || session._id;
              
              return (
                <div 
                  key={sessionId} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <h4 className="font-semibold text-gray-900 truncate">
                          {session.subject || session.subjectName}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        with {userType === 'TUTOR' ? session.tutee || session.otherPerson : session.tutor || session.otherPerson}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {session.date || `${session.sessionMonth}/${session.sessionDay}/${session.sessionYear}`}
                          {session.startTime && ` • ${session.startTime}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        session.status === 'Confirmed' || session.status === 'confirmed'
                          ? 'bg-green-100 text-green-700' 
                          : session.status === 'Pending' || session.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : session.status === 'Declined' || session.status === 'declined'
                          ? 'bg-red-100 text-red-700'
                          : session.status === 'Cancelled' || session.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : session.status === 'Completed' || session.status === 'completed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                      
                      {/* Tutor Actions */}
                      {userType === 'TUTOR' && (
                        <div className="flex space-x-2">
                          {/* Accept/Decline buttons for pending sessions */}
                          {canTutorRespond(session) && (
                            <>
                              <button 
                                onClick={() => handleAccept(sessionId)}
                                disabled={processingSession === sessionId}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                              >
                                {isProcessing(sessionId, 'accept') ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Accept</span>
                                  </>
                                )}
                              </button>
                              <button 
                                onClick={() => handleDecline(sessionId)}
                                disabled={processingSession === sessionId}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                              >
                                {isProcessing(sessionId, 'decline') ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4" />
                                    <span>Decline</span>
                                  </>
                                )}
                              </button>
                            </>
                          )}
                          
                          {/* Cancel button for confirmed sessions */}
                          {canTutorCancel(session) && (
                            <button 
                              onClick={() => handleCancel(sessionId)}
                              disabled={processingSession === sessionId}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {isProcessing(sessionId, 'cancel') ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Ban className="w-4 h-4" />
                                  <span>Cancel</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* NEW: Tutee Actions */}
                      {userType === 'TUTEE' && (
                        <div className="flex space-x-2">
                          {/* Cancel button for pending sessions */}
                          {canTuteeCancel(session) && (
                            <button 
                              onClick={() => handleCancel(sessionId)}
                              disabled={processingSession === sessionId}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {isProcessing(sessionId, 'cancel') ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Ban className="w-4 h-4" />
                                  <span>Cancel</span>
                                </>
                              )}
                            </button>
                          )}

                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Show message if there are more sessions */}
            {sessions.length > VISIBLE_LIMIT && (
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {visibleStartIndex + 1}-{Math.min(visibleStartIndex + VISIBLE_LIMIT, sessions.length)} of {sessions.length} sessions
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CalendarX className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No upcoming sessions scheduled</p>
            {userType === 'TUTEE' && (
            <button 
              onClick={() => onBookSession()}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>Book Your First Session</span>
            </button>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;