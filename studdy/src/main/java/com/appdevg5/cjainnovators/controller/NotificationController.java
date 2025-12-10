package com.appdevg5.cjainnovators.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdevg5.cjainnovators.dto.notificationdto.NotificationRequestDTO;
import com.appdevg5.cjainnovators.dto.notificationdto.NotificationResponseDTO;
import com.appdevg5.cjainnovators.dto.notificationdto.NotificationUpdateDTO;
import com.appdevg5.cjainnovators.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    @Autowired
    private final NotificationService notificationService;
    
    @PostMapping("/create")
    public ResponseEntity<NotificationResponseDTO> createNotification(
            @RequestBody NotificationRequestDTO requestDTO) {
        NotificationResponseDTO response = notificationService.createNotification(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponseDTO>> getUserNotifications(
            @PathVariable Long userId) {
        List<NotificationResponseDTO> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications(
            @PathVariable Long userId) {
        List<NotificationResponseDTO> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/get/{notificationId}")
    public ResponseEntity<NotificationResponseDTO> getNotificationById(
            @PathVariable Long notificationId) {
        NotificationResponseDTO notification = notificationService.getNotificationById(notificationId);
        return ResponseEntity.ok(notification);
    }
    
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable Long notificationId,
            @RequestBody NotificationUpdateDTO updateDTO) {
        NotificationResponseDTO updatedNotification = notificationService.markAsRead(notificationId, updateDTO);
        return ResponseEntity.ok(updatedNotification);
    }
    
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> countUnreadNotifications(@PathVariable Long userId) {
        long count = notificationService.countUnreadNotifications(userId);
        return ResponseEntity.ok(count);
    }
    
    @PostMapping("/system")
    public ResponseEntity<NotificationResponseDTO> sendSystemNotification(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String message) {
        NotificationResponseDTO response = notificationService.sendSystemNotification(userId, title, message);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}