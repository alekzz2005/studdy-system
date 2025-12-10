import React from 'react';
import { CheckCheck, Check } from 'lucide-react';

const ConversationItem = ({ conversation, currentUserId, onClick }) => {
  const hasUnread = conversation.unreadCount > 0;
  
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
        hasUnread ? 'bg-green-50/30' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
            {conversation.participant.avatar}
          </div>
          {conversation.participant.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`text-sm font-semibold truncate ${
              hasUnread ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {conversation.participant.name}
            </h4>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {conversation.lastMessage.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </span>
          </div>
          
          <p className="text-xs text-gray-500 mb-1">{conversation.participant.subject}</p>
          
          <div className="flex items-center justify-between">
            <p className={`text-sm truncate flex-1 ${
              hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
            }`}>
              {conversation.lastMessage.senderId === currentUserId && (
                <span className="mr-1">
                  {conversation.lastMessage.read ? (
                    <CheckCheck className="w-4 h-4 inline text-green-600" />
                  ) : (
                    <Check className="w-4 h-4 inline text-gray-400" />
                  )}
                </span>
              )}
              {conversation.lastMessage.text}
            </p>
            {hasUnread && (
              <span className="ml-2 bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;