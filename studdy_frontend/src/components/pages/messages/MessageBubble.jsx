import React from 'react';
import { CheckCheck, Check } from 'lucide-react';

const MessageBubble = ({ 
  message, 
  isOwnMessage, 
  showAvatar, 
  conversationAvatar,
  currentUserId 
}) => {
  const formatMessageTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
      {!isOwnMessage && (
        <div className="w-8 h-8 flex-shrink-0">
          {showAvatar && (
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {conversationAvatar}
            </div>
          )}
        </div>
      )}
      
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-xs sm:max-w-sm md:max-w-md`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-200 text-gray-900'
          }`}
        >
          <p className="text-sm break-words">{message.text}</p>
        </div>
        <div className="flex items-center space-x-1 mt-1 px-2">
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwnMessage && (
            <span>
              {message.read ? (
                <CheckCheck className="w-3 h-3 text-green-600" />
              ) : (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </span>
          )}
        </div>
      </div>
      
      {isOwnMessage && <div className="w-8 h-8 flex-shrink-0"></div>}
    </div>
  );
};

export default MessageBubble;