package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.messagedto.*;
import com.appdevg5.cjainnovators.dto.userdto.UserDTO;
import com.appdevg5.cjainnovators.entity.ConversationEntity;
import com.appdevg5.cjainnovators.entity.MessageEntity;
import com.appdevg5.cjainnovators.repository.ConversationRepository;
import com.appdevg5.cjainnovators.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {
    
    @Autowired
    private final MessageRepository messageRepository;
    
    @Autowired
    private final ConversationRepository conversationRepository;
    
    @Autowired
    private final UserService userService;
    
    public List<ConversationDTO> getUserConversations(Long userId) {
        List<ConversationEntity> conversations = conversationRepository.findByUserId(userId);
        
        return conversations.stream()
            .map(conv -> mapToConversationDTO(conv, userId))
            .collect(Collectors.toList());
    }
    
    public List<ConversationDTO> searchConversations(Long userId, String query) {
        List<ConversationEntity> conversations = conversationRepository.searchConversations(userId, query);
        
        return conversations.stream()
            .map(conv -> mapToConversationDTO(conv, userId))
            .collect(Collectors.toList());
    }
    
    public ConversationResponse getConversationMessages(Long conversationId, Long userId) {
        // Get conversation
        ConversationEntity conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found with id: " + conversationId));
        
        // Verify user is part of the conversation
        if (!conversation.getUser1Id().equals(userId) && !conversation.getUser2Id().equals(userId)) {
            throw new RuntimeException("User not authorized to access this conversation");
        }
        
        // Mark messages as read when fetching
        markMessagesAsRead(conversationId, userId);
        
        // Get messages
        List<MessageDTO> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId)
            .stream()
            .map(this::mapToMessageDTO)
            .collect(Collectors.toList());
        
        // Get participant info
        ParticipantDTO participant = getParticipantDTO(conversation, userId);
        
        return ConversationResponse.builder()
            .conversationId(conversationId)
            .messages(messages)
            .participant(participant)
            .build();
    }
    
    @Transactional
    public MessageDTO sendMessage(SendMessageRequest request, Long senderId) {
        // Validate request
        if (request.getReceiverId() == null) {
            throw new RuntimeException("Receiver ID is required");
        }
        if (request.getText() == null || request.getText().trim().isEmpty()) {
            throw new RuntimeException("Message text is required");
        }
        
        // Get sender info
        UserDTO senderInfo = userService.getUserById(senderId);
        
        // Get or create conversation
        ConversationEntity conversation = getOrCreateConversation(
            senderId, 
            request.getReceiverId(), 
            request.getSubject()
        );
        
        // Create and save message
        MessageEntity message = MessageEntity.builder()
            .conversation(conversation)
            .senderId(senderId)
            .senderName(senderInfo.getFirstName() + " " + senderInfo.getLastName())
            .senderType(senderInfo.getType())
            .text(request.getText())
            .isRead(false)
            .type(MessageEntity.MessageType.TEXT)
            .build();
        
        MessageEntity savedMessage = messageRepository.save(message);
        
        // Update conversation last message
        conversation.setLastMessage(request.getText());
        conversation.setLastMessageSenderId(senderId);
        conversation.setLastMessageRead(false);
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);
        
        log.info("Message sent from user {} to user {}", senderId, request.getReceiverId());
        
        return mapToMessageDTO(savedMessage);
    }
    
    @Transactional
    public void markMessagesAsRead(Long conversationId, Long userId) {
        // Verify conversation exists and user is part of it
        ConversationEntity conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        if (!conversation.getUser1Id().equals(userId) && !conversation.getUser2Id().equals(userId)) {
            throw new RuntimeException("User not authorized to access this conversation");
        }
        
        List<MessageEntity> unreadMessages = messageRepository
            .findByConversationConversationIdAndSenderIdNotAndIsReadFalse(conversationId, userId);
        
        if (!unreadMessages.isEmpty()) {
            unreadMessages.forEach(msg -> msg.setRead(true));
            messageRepository.saveAll(unreadMessages);
            log.info("Marked {} messages as read in conversation {}", unreadMessages.size(), conversationId);
        }
        
        // Update conversation last message status
        if (conversation.getLastMessageSenderId() != null && 
            !conversation.getLastMessageSenderId().equals(userId)) {
            conversation.setLastMessageRead(true);
            conversationRepository.save(conversation);
        }
    }
    
    public Long getUnreadCount(Long userId) {
        List<ConversationEntity> conversations = conversationRepository.findByUserId(userId);
        
        return conversations.stream()
            .mapToLong(conv -> {
                Long count = messageRepository.countUnreadMessages(conv.getConversationId(), userId);
                return count != null ? count : 0L;
            })
            .sum();
    }
    
    public ConversationEntity getOrCreateConversation(Long user1Id, Long user2Id, String subject) {
        return conversationRepository.findByParticipants(user1Id, user2Id)
            .orElseGet(() -> createNewConversation(user1Id, user2Id, subject));
    }
    
    private ConversationEntity createNewConversation(Long user1Id, Long user2Id, String subject) {
        // Get user details
        UserDTO user1Info = userService.getUserById(user1Id);
        UserDTO user2Info = userService.getUserById(user2Id);
        
        String user1FullName = user1Info.getFirstName() + " " + user1Info.getLastName();
        String user2FullName = user2Info.getFirstName() + " " + user2Info.getLastName();
        
        ConversationEntity newConversation = ConversationEntity.builder()
            .user1Id(user1Id)
            .user1Name(user1FullName)
            .user1Type(user1Info.getType())
            .user2Id(user2Id)
            .user2Name(user2FullName)
            .user2Type(user2Info.getType())
            .subject(subject != null ? subject : "General")
            .lastMessageRead(false)
            .build();
        
        ConversationEntity savedConversation = conversationRepository.save(newConversation);
        log.info("Created new conversation between user {} and user {}", user1Id, user2Id);
        
        return savedConversation;
    }
    
    private ConversationDTO mapToConversationDTO(ConversationEntity conv, Long currentUserId) {
        // Get participant info
        ParticipantDTO participant = getParticipantDTO(conv, currentUserId);
        
        // Get unread count
        Long unreadCount = messageRepository.countUnreadMessages(conv.getConversationId(), currentUserId);
        
        // Note: isUserOnline method doesn't exist in UserService, so defaulting to false
        // You may want to implement this in UserService if needed
        boolean isOnline = false; // userService.isUserOnline(participant.getUserId());
        
        return ConversationDTO.builder()
            .conversationId(conv.getConversationId())
            .participant(participant)
            .lastMessage(LastMessageDTO.builder()
                .text(conv.getLastMessage())
                .timestamp(conv.getUpdatedAt())
                .senderId(conv.getLastMessageSenderId())
                .read(conv.isLastMessageRead())
                .build())
            .unreadCount(unreadCount != null ? unreadCount.intValue() : 0)
            .online(isOnline)
            .subject(conv.getSubject())
            .updatedAt(conv.getUpdatedAt())
            .build();
    }
    
    private ParticipantDTO getParticipantDTO(ConversationEntity conv, Long currentUserId) {
        Long otherUserId;
        String otherUserName;
        String otherUserType;
        String otherUserTypeString;
        
        if (conv.getUser1Id().equals(currentUserId)) {
            otherUserId = conv.getUser2Id();
            otherUserName = conv.getUser2Name();
            otherUserType = conv.getUser2Type();
        } else {
            otherUserId = conv.getUser1Id();
            otherUserName = conv.getUser1Name();
            otherUserType = conv.getUser1Type();
        }
        
        // Convert enum to string for DTO
        otherUserTypeString = otherUserType.toString();
        
        // Get user info for avatar (using initials as fallback)
        String avatar = getAvatarForUser(otherUserId, otherUserName);
        
        return ParticipantDTO.builder()
            .userId(otherUserId)
            .name(otherUserName)
            .type(otherUserTypeString)
            .subject(conv.getSubject())
            .avatar(avatar)
            .online(false) // Default to offline since we don't have online status
            .build();
    }
    
    private String getAvatarForUser(Long userId, String fullName) {
        try {
            // Try to get user info for avatar
            UserDTO user = userService.getUserById(userId);
            if (user != null) {
                // You could add avatar field to UserDTO or use initials
                return getInitials(user.getFirstName(), user.getLastName());
            }
        } catch (Exception e) {
            log.warn("Could not fetch user info for avatar: {}", e.getMessage());
        }
        
        // Fallback to generating initials from full name
        return getInitialsFromFullName(fullName);
    }
    
    private String getInitials(String firstName, String lastName) {
        if (firstName == null || lastName == null) {
            return "U";
        }
        return (firstName.charAt(0) + "" + lastName.charAt(0)).toUpperCase();
    }
    
    private String getInitialsFromFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "U";
        }
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + "" + parts[1].charAt(0)).toUpperCase();
        } else if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        }
        return "U";
    }
    
    private MessageDTO mapToMessageDTO(MessageEntity message) {
        return MessageDTO.builder()
            .messageId(message.getMessageId())
            .conversationId(message.getConversation().getConversationId())
            .senderId(message.getSenderId())
            .senderName(message.getSenderName())
            .senderType(message.getSenderType().toString())
            .text(message.getText())
            .read(message.isRead())
            .timestamp(message.getTimestamp())
            .type(message.getType().toString())
            .build();
    }
    
    public List<MessageDTO> getRecentMessages(Long conversationId, int limit) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId)
            .stream()
            .limit(limit)
            .map(this::mapToMessageDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteConversation(Long conversationId, Long userId) {
        ConversationEntity conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        // Check if user is part of the conversation
        if (!conversation.getUser1Id().equals(userId) && !conversation.getUser2Id().equals(userId)) {
            throw new RuntimeException("User not authorized to delete this conversation");
        }
        
        // Delete all messages first
        List<MessageEntity> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        messageRepository.deleteAll(messages);
        
        // Delete conversation
        conversationRepository.delete(conversation);
        
        log.info("Deleted conversation {} by user {}", conversationId, userId);
    }
    
    public ConversationEntity getConversationById(Long conversationId) {
        return conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));
    }
    
    public boolean isUserInConversation(Long conversationId, Long userId) {
        ConversationEntity conversation = getConversationById(conversationId);
        return conversation.getUser1Id().equals(userId) || conversation.getUser2Id().equals(userId);
    }
}