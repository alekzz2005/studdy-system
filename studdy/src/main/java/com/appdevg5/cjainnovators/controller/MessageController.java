package com.appdevg5.cjainnovators.controller;

import com.appdevg5.cjainnovators.dto.messagedto.*;
import com.appdevg5.cjainnovators.service.MessageService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"})
public class MessageController {
    
    @Autowired
    private final MessageService messageService;
    
    @GetMapping("/get/conversations")
    public ResponseEntity<?> getUserConversations(@RequestParam Long userId) {
        try {
            List<ConversationDTO> conversations = messageService.getUserConversations(userId);
            return ResponseEntity.ok(conversations);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch conversations", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/conversations/search")
    public ResponseEntity<?> searchConversations(
            @RequestParam Long userId,
            @RequestParam String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return buildErrorResponse("Search query cannot be empty", HttpStatus.BAD_REQUEST);
            }
            
            List<ConversationDTO> conversations = messageService.searchConversations(userId, query.trim());
            return ResponseEntity.ok(conversations);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildErrorResponse("Failed to search conversations", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<?> getConversationMessages(
            @PathVariable Long conversationId,
            @RequestParam Long userId) {
        try {
            if (conversationId == null || conversationId <= 0) {
                return buildErrorResponse("Invalid conversation ID", HttpStatus.BAD_REQUEST);
            }
            
            ConversationResponse response = messageService.getConversationMessages(conversationId, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch conversation messages", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestBody SendMessageRequest request,
            @RequestParam Long senderId) {
        try {
            // Validate request
            if (request == null) {
                return buildErrorResponse("Request body cannot be empty", HttpStatus.BAD_REQUEST);
            }
            
            if (request.getReceiverId() == null) {
                return buildErrorResponse("Receiver ID is required", HttpStatus.BAD_REQUEST);
            }
            
            if (request.getText() == null || request.getText().trim().isEmpty()) {
                return buildErrorResponse("Message text cannot be empty", HttpStatus.BAD_REQUEST);
            }
            
            if (senderId == null || senderId <= 0) {
                return buildErrorResponse("Invalid sender ID", HttpStatus.BAD_REQUEST);
            }
            
            MessageDTO message = messageService.sendMessage(request, senderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Message sent successfully");
            response.put("data", message);
            response.put("timestamp", java.time.LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildErrorResponse("Failed to send message", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<?> markConversationAsRead(
            @PathVariable Long conversationId,
            @RequestParam Long userId) {
        try {
            if (conversationId == null || conversationId <= 0) {
                return buildErrorResponse("Invalid conversation ID", HttpStatus.BAD_REQUEST);
            }
            
            if (userId == null || userId <= 0) {
                return buildErrorResponse("Invalid user ID", HttpStatus.BAD_REQUEST);
            }
            
            messageService.markMessagesAsRead(conversationId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Conversation marked as read");
            response.put("conversationId", conversationId);
            response.put("userId", userId);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildErrorResponse("Failed to mark conversation as read", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@RequestParam Long userId) {
        try {
            if (userId == null || userId <= 0) {
                return buildErrorResponse("Invalid user ID", HttpStatus.BAD_REQUEST);
            }
            
            Long count = messageService.getUnreadCount(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("unreadCount", count);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildErrorResponse("Failed to get unread count", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/conversations")
    public ResponseEntity<?> createOrGetConversation(
            @RequestParam Long user1Id,
            @RequestParam Long user2Id,
            @RequestParam(required = false) String subject) {
        try {
            if (user1Id == null || user1Id <= 0 || user2Id == null || user2Id <= 0) {
                return buildErrorResponse("Both user IDs are required and must be valid", HttpStatus.BAD_REQUEST);
            }
            
            if (user1Id.equals(user2Id)) {
                return buildErrorResponse("Cannot create conversation with yourself", HttpStatus.BAD_REQUEST);
            }
            
            var conversation = messageService.getOrCreateConversation(user1Id, user2Id, subject);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", conversation.getConversationId() != null ? 
                "Conversation retrieved" : "Conversation created");
            response.put("conversationId", conversation.getConversationId());
            response.put("subject", conversation.getSubject());
            response.put("participants", List.of(
                Map.of("userId", conversation.getUser1Id(), "name", conversation.getUser1Name()),
                Map.of("userId", conversation.getUser2Id(), "name", conversation.getUser2Name())
            ));
            response.put("createdAt", conversation.getUpdatedAt());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return buildErrorResponse("Failed to create/get conversation", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<?> deleteConversation(
            @PathVariable Long conversationId,
            @RequestParam Long userId) {
        try {
            if (conversationId == null || conversationId <= 0) {
                return buildErrorResponse("Invalid conversation ID", HttpStatus.BAD_REQUEST);
            }
            
            if (userId == null || userId <= 0) {
                return buildErrorResponse("Invalid user ID", HttpStatus.BAD_REQUEST);
            }
            
            messageService.deleteConversation(conversationId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Conversation deleted successfully");
            response.put("conversationId", conversationId);
            response.put("deletedBy", userId);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return buildErrorResponse("Failed to delete conversation", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/conversations/{conversationId}/recent")
    public ResponseEntity<?> getRecentMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            if (conversationId == null || conversationId <= 0) {
                return buildErrorResponse("Invalid conversation ID", HttpStatus.BAD_REQUEST);
            }
            
            if (limit <= 0 || limit > 100) {
                return buildErrorResponse("Limit must be between 1 and 100", HttpStatus.BAD_REQUEST);
            }
            
            List<MessageDTO> messages = messageService.getRecentMessages(conversationId, limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("conversationId", conversationId);
            response.put("limit", limit);
            response.put("messages", messages);
            response.put("totalMessages", messages.size());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to fetch recent messages", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/conversations/{conversationId}/check")
    public ResponseEntity<?> checkUserInConversation(
            @PathVariable Long conversationId,
            @RequestParam Long userId) {
        try {
            if (conversationId == null || conversationId <= 0) {
                return buildErrorResponse("Invalid conversation ID", HttpStatus.BAD_REQUEST);
            }
            
            if (userId == null || userId <= 0) {
                return buildErrorResponse("Invalid user ID", HttpStatus.BAD_REQUEST);
            }
            
            boolean isInConversation = messageService.isUserInConversation(conversationId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("conversationId", conversationId);
            response.put("userId", userId);
            response.put("isInConversation", isInConversation);
            response.put("message", isInConversation ? 
                "User is part of this conversation" : "User is not part of this conversation");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to check user in conversation", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Message Service");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversations/{conversationId}/info")
    public ResponseEntity<?> getConversationInfo(@PathVariable Long conversationId) {
        try {
            if (conversationId == null || conversationId <= 0) {
                return buildErrorResponse("Invalid conversation ID", HttpStatus.BAD_REQUEST);
            }
            
            var conversation = messageService.getConversationById(conversationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("conversationId", conversation.getConversationId());
            response.put("user1", Map.of(
                "userId", conversation.getUser1Id(),
                "name", conversation.getUser1Name(),
                "type", conversation.getUser1Type().toString()
            ));
            response.put("user2", Map.of(
                "userId", conversation.getUser2Id(),
                "name", conversation.getUser2Name(),
                "type", conversation.getUser2Type().toString()
            ));
            response.put("subject", conversation.getSubject());
            response.put("lastMessage", conversation.getLastMessage());
            response.put("lastUpdated", conversation.getUpdatedAt());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Failed to get conversation info", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    private ResponseEntity<Map<String, Object>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        errorResponse.put("status", status.value());
        errorResponse.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.status(status).body(errorResponse);
    }
}