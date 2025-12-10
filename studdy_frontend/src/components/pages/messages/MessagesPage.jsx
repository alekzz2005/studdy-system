import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Phone, Video, Info } from 'lucide-react';
import { messageAPI, getAvatarInitials } from '../../../services/message';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ConversationItem from './ConversationItem';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const selectedConversationIdFromState = location.state?.selectedConversationId;

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser({
        id: parsedUser.userId || parsedUser.id,
        name: `${parsedUser.firstName} ${parsedUser.lastName}`,
        role: parsedUser.type?.toLowerCase() || 'tutee',
        firstName: parsedUser.firstName,
        lastName: parsedUser.lastName,
        type: parsedUser.type
      });
    }
  }, []);

  useEffect(() => {
    if (selectedConversationIdFromState && conversations.length > 0 && !selectedConversation) {
      console.log('Selecting conversation from state:', selectedConversationIdFromState);
      
      const conversation = conversations.find(conv => 
        conv.id.toString() === selectedConversationIdFromState.toString()
      );
      
      if (conversation) {
        console.log('Found conversation, selecting it');
        handleSelectConversation(conversation);
        
        navigate('/messages', { replace: true, state: {} });
      }
    }
  }, [selectedConversationIdFromState, conversations, selectedConversation, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation, messages]);

  const fetchConversations = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      setLoading(true);
      const response = await messageAPI.getUserConversations(currentUser.id);
      
      if (response && Array.isArray(response)) {
        const formattedConversations = response.map(conv => ({
          id: conv.conversationId,
          participant: {
            id: conv.participant?.userId,
            name: conv.participant?.name || 'Unknown User',
            role: conv.participant?.type?.toLowerCase() || 'tutor',
            subject: conv.participant?.subject || 'General',
            avatar: conv.participant?.avatar || getAvatarInitials(conv.participant?.name),
            online: conv.online || false
          },
          lastMessage: {
            text: conv.lastMessage?.text || 'Start a conversation',
            timestamp: conv.lastMessage?.timestamp ? new Date(conv.lastMessage.timestamp) : new Date(),
            senderId: conv.lastMessage?.senderId,
            read: conv.lastMessage?.read || false
          },
          unreadCount: conv.unreadCount || 0,
          updatedAt: conv.updatedAt
        }));
        
        formattedConversations.sort((a, b) => 
          new Date(b.updatedAt || b.lastMessage.timestamp) - 
          new Date(a.updatedAt || a.lastMessage.timestamp)
        );
        
        setConversations(formattedConversations);
        console.log('Conversations loaded:', formattedConversations.length);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchConversations();
    }
  }, [currentUser, fetchConversations]);

  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId || !currentUser?.id) return;
    
    try {
      console.log('Fetching messages for conversation:', conversationId);
      const response = await messageAPI.getConversationMessages(conversationId, currentUser.id);
      
      if (response && response.messages) {
        console.log('Messages received:', response.messages.length);
        const formattedMessages = response.messages.map(msg => ({
          id: msg.messageId,
          senderId: msg.senderId,
          text: msg.text,
          timestamp: new Date(msg.timestamp),
          read: msg.read,
          senderName: msg.senderName
        }));
        
        setMessages(prev => ({
          ...prev,
          [conversationId]: formattedMessages
        }));
        
        await messageAPI.markAsRead(conversationId, currentUser.id);
        updateConversationReadStatus(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      loadMockMessages(conversationId);
    }
  }, [currentUser]);

  const updateConversationReadStatus = useCallback((conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: { ...conv.lastMessage, read: true }, unreadCount: 0 }
        : conv
    ));
  }, []);

  const handleSelectConversation = useCallback((conversation) => {
    console.log('Selecting conversation:', conversation.id);
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  }, [fetchMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !selectedConversation || !currentUser?.id) return;

    try {
      console.log('Sending message to:', selectedConversation.participant.id);
      const response = await messageAPI.sendMessage(
        currentUser.id,
        selectedConversation.participant.id,
        message,
        selectedConversation.participant.subject || 'General',
        'TEXT'
      );

      if (response) {
        const newMessage = {
          id: response.messageId || Date.now(),
          senderId: currentUser.id,
          text: message,
          timestamp: new Date(),
          read: true,
          senderName: `${currentUser.firstName} ${currentUser.lastName}`
        };

        setMessages(prev => ({
          ...prev,
          [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
        }));

        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { 
                ...conv, 
                lastMessage: { 
                  text: message, 
                  timestamp: new Date(), 
                  senderId: currentUser.id,
                  read: true 
                },
                updatedAt: new Date()
              }
            : conv
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const newMessage = {
        id: Date.now(),
        senderId: currentUser.id,
        text: message,
        timestamp: new Date(),
        read: false,
        senderName: `${currentUser.firstName} ${currentUser.lastName}`
      };

      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
      }));
    }

    setMessage('');
  }, [message, selectedConversation, currentUser]);

  const handleBackToList = useCallback(() => {
    console.log('Going back to conversation list');
    setSelectedConversation(null);
  }, []);

  const handleGoBack = useCallback(() => {
    if (selectedConversation) {
      handleBackToList();
    } else {
      navigate(-1); 
    }
  }, [selectedConversation, handleBackToList, navigate]);

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMockData = useCallback(() => {
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
      }
    ];

    setConversations(mockConversations);
    console.log('Loaded mock conversations');
  }, []);

  const loadMockMessages = useCallback((conversationId) => {
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
        }
      ]
    };
    
    setMessages(prev => ({
      ...prev,
      [conversationId]: mockMessages[conversationId] || []
    }));
    console.log('Loaded mock messages for conversation:', conversationId);
  }, []);

  if (loading && conversations.length === 0) {
    return <LoadingState message="Loading messages..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleGoBack}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-green-600 ml-4 leading-none pt-5">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          
          {!selectedConversation ? (
            <ConversationListView
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              conversations={filteredConversations}
              currentUserId={currentUser?.id}
              onSelectConversation={handleSelectConversation}
            />
          ) : (
            <ChatView
              conversation={selectedConversation}
              messages={messages[selectedConversation.id] || []}
              currentUserId={currentUser?.id}
              onBack={handleBackToList}
              message={message}
              setMessage={setMessage}
              onSend={handleSendMessage}
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>
      </main>
    </div>
  );
};

const ConversationListView = ({ searchQuery, setSearchQuery, conversations, currentUserId, onSelectConversation }) => (
  <div className="flex flex-col h-full">
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

    <div className="flex-1 overflow-y-auto">
      {conversations.length > 0 ? (
        conversations.map(conv => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            currentUserId={currentUserId}
            onClick={() => onSelectConversation(conv)}
          />
        ))
      ) : (
        <EmptyState
          icon={Search}
          message="No conversations found"
          action={searchQuery && {
            label: 'Clear search',
            onClick: () => setSearchQuery('')
          }}
        />
      )}
    </div>
  </div>
);

const ChatView = ({ 
  conversation, 
  messages, 
  currentUserId, 
  onBack, 
  message, 
  setMessage, 
  onSend,
  messagesEndRef 
}) => (
  <div className="flex flex-col h-full">
    <ChatHeader 
      conversation={conversation} 
      onBack={onBack} 
      isMobile={false}
      mobileActionButtons={
        <>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Info className="w-5 h-5" />
          </button>
        </>
      }
    />
    
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
      {messages.length > 0 ? (
        messages.map((msg, index) => {
          const isOwnMessage = msg.senderId === currentUserId;
          const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
          
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={isOwnMessage}
              showAvatar={showAvatar}
              conversationAvatar={conversation.participant.avatar}
              currentUserId={currentUserId}
            />
          );
        })
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
    
    <MessageInput
      message={message}
      setMessage={setMessage}
      onSend={onSend}
    />
  </div>
);

export default MessagesPage;