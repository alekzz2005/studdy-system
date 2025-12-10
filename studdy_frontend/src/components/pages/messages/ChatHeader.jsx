import React from 'react';
import { ArrowLeft, Phone, Video, Info } from 'lucide-react';

const ChatHeader = ({ conversation, onBack, isMobile }) => {
  if (!conversation) return null;

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <button 
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          
          <div className="relative">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {conversation.participant.avatar}
            </div>
            {conversation.participant.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{conversation.participant.name}</h3>
            <p className="text-xs text-gray-500">
              {conversation.participant.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Info className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {isMobile && mobileActionButtons}
      </div>
    </div>
  );
};

export default ChatHeader;