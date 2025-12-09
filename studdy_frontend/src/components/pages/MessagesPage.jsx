import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Image,
  Phone,
  Video,
  Info,
  User,
  Clock,
  CheckCheck,
  Check,
  MessageSquare
} from 'lucide-react';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Mock current user data
  const currentUser = {
    id: 1,
    name: 'John Doe',
    role: 'tutee'
  };

  // Mock conversations data - Backend should provide this
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        participant: {
          id: 101,
          name: 'Alexander Binagatan',
          role: 'tutor',
          subject: 'Mathematics',
          avatar: 'AB',
          online: true
        },
        lastMessage: {
          text: 'Hi! Just confirming our session for today at 2 PM. See you then!',
          timestamp: new Date(Date.now() - 10 * 60000),
          senderId: 101,
          read: false
        },
        unreadCount: 2
      },
      {
        id: 2,
        participant: {
          id: 102,
          name: 'Charry Mae Atamosa',
          role: 'tutor',
          subject: 'Physics',
          avatar: 'CA',
          online: false
        },
        lastMessage: {
          text: 'I\'ve uploaded the study materials for our next physics session.',
          timestamp: new Date(Date.now() - 60 * 60000),
          senderId: 102,
          read: false
        },
        unreadCount: 1
      },
      {
        id: 3,
        participant: {
          id: 103,
          name: 'John Anthony Besañez',
          role: 'tutor',
          subject: 'Computer Science',
          avatar: 'JB',
          online: true
        },
        lastMessage: {
          text: 'Thanks for the great session! Let me know if you have any questions.',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          senderId: 1,
          read: true
        },
        unreadCount: 0
      },
      {
        id: 4,
        participant: {
          id: 104,
          name: 'Lisa Wang',
          role: 'tutor',
          subject: 'Mathematics',
          avatar: 'LW',
          online: false
        },
        lastMessage: {
          text: 'The homework assignment is due next Monday. Don\'t forget!',
          timestamp: new Date(Date.now() - 24 * 60 * 60000),
          senderId: 104,
          read: true
        },
        unreadCount: 0
      }
    ];

    setConversations(mockConversations);

    const mockMessages = {
      1: [
        {
          id: 1,
          senderId: 101,
          text: 'Hello! I\'m looking forward to our session.',
          timestamp: new Date(Date.now() - 3 * 60 * 60000),
          read: true
        },
        {
          id: 2,
          senderId: 1,
          text: 'Hi Alexander! Me too. What topics will we cover?',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          read: true
        },
        {
          id: 3,
          senderId: 101,
          text: 'We\'ll focus on calculus derivatives and integrals. Please bring your textbook.',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          read: true
        },
        {
          id: 4,
          senderId: 1,
          text: 'Perfect! I have some questions about chain rule.',
          timestamp: new Date(Date.now() - 1 * 60 * 60000),
          read: true
        },
        {
          id: 5,
          senderId: 101,
          text: 'Hi! Just confirming our session for today at 2 PM. See you then!',
          timestamp: new Date(Date.now() - 10 * 60000),
          read: false
        }
      ],
      2: [
        {
          id: 1,
          senderId: 102,
          text: 'Hi John! Ready for our physics session tomorrow?',
          timestamp: new Date(Date.now() - 5 * 60 * 60000),
          read: true
        },
        {
          id: 2,
          senderId: 1,
          text: 'Yes! I\'ve been reviewing the mechanics chapter.',
          timestamp: new Date(Date.now() - 4 * 60 * 60000),
          read: true
        },
        {
          id: 3,
          senderId: 102,
          text: 'I\'ve uploaded the study materials for our next physics session.',
          timestamp: new Date(Date.now() - 60 * 60000),
          read: false
        }
      ],
      3: [
        {
          id: 1,
          senderId: 103,
          text: 'Great job on understanding recursion today!',
          timestamp: new Date(Date.now() - 3 * 60 * 60000),
          read: true
        },
        {
          id: 2,
          senderId: 1,
          text: 'Thanks for the great session! Let me know if you have any questions.',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          read: true
        }
      ],
      4: [
        {
          id: 1,
          senderId: 104,
          text: 'The homework assignment is due next Monday. Don\'t forget!',
          timestamp: new Date(Date.now() - 24 * 60 * 60000),
          read: true
        }
      ]
    };

    setMessages(mockMessages);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation, messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Format timestamp
  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format message time
  const formatMessageTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Handle send message - Backend endpoint: POST /api/messages
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      text: message,
      timestamp: new Date(),
      read: false
    };

    // Update local state
    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
    }));

    // Update last message in conversation
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: { ...newMessage, senderId: currentUser.id } }
        : conv
    ));

    setMessage('');

    // Backend API call would go here:
    /*
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          senderId: currentUser.id,
          receiverId: selectedConversation.participant.id,
          text: message,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
    */
  };

  // Handle mark as read - Backend endpoint: PUT /api/messages/:id/read
  const markAsRead = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: { ...conv.lastMessage, read: true }, unreadCount: 0 }
        : conv
    ));

    // Backend API call:
    /*
    fetch(`/api/conversations/${conversationId}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    });
    */
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle conversation select
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    markAsRead(conv.id);
  };

  // Handle back to conversations list
  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Handle key press for sending message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => {
                  if (selectedConversation) {
                    handleBackToList();
                  } else {
                    window.history.back();
                  }
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-green-600" />
              </button>
              <h1 className="text-2xl font-bold text-green-600 leading-none pt-5">
                {selectedConversation ? selectedConversation.participant.name : 'Messages'}
              </h1>
            </div>
            
            {selectedConversation && (
              <div className="flex items-center space-x-2 lg:hidden">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          {/* Conversations List View */}
          {!selectedConversation ? (
            <div className="flex flex-col h-full">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                        conv.unreadCount > 0 ? 'bg-green-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {conv.participant.avatar}
                          </div>
                          {conv.participant.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-semibold truncate ${
                              conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {conv.participant.name}
                            </h4>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTimestamp(conv.lastMessage.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-500 mb-1">{conv.participant.subject}</p>
                          
                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate flex-1 ${
                              conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                            }`}>
                              {conv.lastMessage.senderId === currentUser.id && (
                                <span className="mr-1">
                                  {conv.lastMessage.read ? (
                                    <CheckCheck className="w-4 h-4 inline text-green-600" />
                                  ) : (
                                    <Check className="w-4 h-4 inline text-gray-400" />
                                  )}
                                </span>
                              )}
                              {conv.lastMessage.text}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="ml-2 bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-center">No conversations found</p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-2 text-green-600 hover:text-green-700 text-sm"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Chat View */
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={handleBackToList}
                      className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <div className="relative">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {selectedConversation.participant.avatar}
                      </div>
                      {selectedConversation.participant.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.participant.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.participant.online ? 'Online' : 'Offline'} • {selectedConversation.participant.subject}
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex items-center space-x-2">
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
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
                {(messages[selectedConversation.id] || []).map((msg, index) => {
                  const isOwnMessage = msg.senderId === currentUser.id;
                  const showAvatar = index === 0 || messages[selectedConversation.id][index - 1].senderId !== msg.senderId;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                    >
                      {!isOwnMessage && (
                        <div className="w-8 h-8 flex-shrink-0">
                          {showAvatar && (
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                              {selectedConversation.participant.avatar}
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
                          <p className="text-sm break-words">{msg.text}</p>
                        </div>
                        <div className="flex items-center space-x-1 mt-1 px-2">
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(msg.timestamp)}
                          </span>
                          {isOwnMessage && (
                            <span>
                              {msg.read ? (
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
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - FIXED LAYOUT */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  {/* Attachment buttons - left side */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                      <Image className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Message input - middle, takes available space */}
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
                  
                  {/* Send button - right side */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-full flex items-center justify-center"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;