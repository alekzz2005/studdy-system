import React from 'react';
import { Calendar, RefreshCw, BookOpen, Clock, CalendarPlus, CalendarX } from 'lucide-react';

const Sessions = ({ sessions, loading, onRefresh, onBookSession }) => {
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
              <p className="text-sm text-gray-500">Your tutoring sessions</p>
            </div>
          </div>
          
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

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500">Loading your sessions...</p>
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map(session => (
              <div 
                key={session.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">{session.subject}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">with {session.tutor}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {session.date}
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === 'accepted' || session.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : session.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : session.status === 'ongoing'
                      ? 'bg-blue-100 text-blue-700'
                      : session.status === 'completed'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-100 text-red-700' // cancelled
                  }`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CalendarX className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No upcoming sessions scheduled</p>
            <button 
              onClick={() => onBookSession()}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>Book Your First Session</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;