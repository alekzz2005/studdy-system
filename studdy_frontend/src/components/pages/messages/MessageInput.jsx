import React, { useRef, useEffect } from 'react';
import { Send, Paperclip, Image } from 'lucide-react';

const MessageInput = ({ message, setMessage, onSend, onKeyPress }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Image className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            rows="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none min-h-[44px] max-h-[120px]"
          />
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={onSend}
            disabled={!message.trim()}
            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-full flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;