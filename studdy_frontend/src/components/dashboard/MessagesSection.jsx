import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MessagesSection = ({ messages, onMessageClick }) => {
  const navigate = useNavigate();
  const unreadCount = messages.filter(m => m.unread).length;

  // Handle view all messages navigation
  const handleViewAllMessages = () => {
    navigate('/messages'); // This navigates to your messages page
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 ">Messages</h3>
              <p className="text-xs text-gray-500">Recent conversations</p>
            </div>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
            {unreadCount} new
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {messages.map(message => (
          <button
            key={message.id}
            onClick={() => onMessageClick ? onMessageClick(message) : navigate(`/messages/${message.id}`)}
            className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
              message.unread ? 'bg-green-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                {message.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium truncate ${
                    message.unread ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {message.sender}
                  </h4>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {message.time}
                  </span>
                </div>
                <p className={`text-sm truncate ${
                  message.unread ? 'text-gray-700 font-medium' : 'text-gray-500'
                }`}>
                  {message.preview}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleViewAllMessages}
          className="w-full px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium text-sm"
        >
          View All Messages
        </button>
      </div>
    </div>
  );
};

export default MessagesSection;