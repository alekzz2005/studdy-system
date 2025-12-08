package com.appdevg5.cjainnovators.service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdevg5.cjainnovators.dto.notificationdto.*;
import com.appdevg5.cjainnovators.entity.NotificationEntity;
import com.appdevg5.cjainnovators.entity.UserEntity;
import com.appdevg5.cjainnovators.repository.NotificationRepository;
import com.appdevg5.cjainnovators.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    // Create a new notification
    @Transactional
    public NotificationResponseDTO createNotification(NotificationRequestDTO requestDTO) {
        // Find the user
        UserEntity user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + requestDTO.getUserId()));
        
        // Create notification entity
        NotificationEntity notification = NotificationEntity.builder()
                .user(user)
                .notificationType(requestDTO.getNotificationType())
                .title(requestDTO.getTitle())
                .message(requestDTO.getMessage())
                .isRead(false)
                .dateCreated(LocalDate.now())
                .build();
        
        // Save to database
        NotificationEntity savedNotification = notificationRepository.save(notification);
        
        // Convert to response DTO
        return convertToDTO(savedNotification);
    }
    
    // Get all notifications for a user
    public List<NotificationResponseDTO> getUserNotifications(Long userId) {
        List<NotificationEntity> notifications = notificationRepository.findByUserUserId(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get unread notifications for a user
    public List<NotificationResponseDTO> getUnreadNotifications(Long userId) {
        List<NotificationEntity> notifications = notificationRepository.findByUserUserIdAndIsReadFalse(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get notification by ID
    public NotificationResponseDTO getNotificationById(Long notificationId) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found with id: " + notificationId));
        return convertToDTO(notification);
    }
    
    // Mark notification as read
    @Transactional
    public NotificationResponseDTO markAsRead(Long notificationId, NotificationUpdateDTO updateDTO) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found with id: " + notificationId));
        
        notification.setRead(updateDTO.isRead());
        NotificationEntity updatedNotification = notificationRepository.save(notification);
        
        return convertToDTO(updatedNotification);
    }
    
    // Mark all notifications as read for a user
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }
    
    // Delete a notification
    @Transactional
    public void deleteNotification(Long notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new NoSuchElementException("Notification not found with id: " + notificationId);
        }
        notificationRepository.deleteById(notificationId);
    }
    
    // Count unread notifications for a user
    public long countUnreadNotifications(Long userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }
    
    // Send system notification (convenience method)
    @Transactional
    public NotificationResponseDTO sendSystemNotification(Long userId, String title, String message) {
        NotificationRequestDTO request = NotificationRequestDTO.builder()
                .userId(userId)
                .notificationType("SYSTEM")
                .title(title)
                .message(message)
                .build();
        return createNotification(request);
    }
    
    // Helper method to convert entity to DTO
    private NotificationResponseDTO convertToDTO(NotificationEntity notification) {
        return NotificationResponseDTO.builder()
                .notificationId(notification.getNotificationId())
                .userId(notification.getUser().getUserId())
                .firstName(notification.getUser().getFirstName())
                .notificationType(notification.getNotificationType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .dateCreated(notification.getDateCreated())
                .build();
    }
}