package com.appdevg5.cjainnovators.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdevg5.cjainnovators.entity.NotificationEntity;

import jakarta.transaction.Transactional;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    
    // Find all notifications for a specific user
    List<NotificationEntity> findByUserUserId(Long userId);
    
    // Find all unread notifications for a specific user
    List<NotificationEntity> findByUserUserIdAndIsReadFalse(Long userId);
    
    // Find notifications by type for a specific user
    List<NotificationEntity> findByUserUserIdAndNotificationType(Long userId, String notificationType);
    
    // Find recent notifications (last N days)
    @Query("SELECT n FROM NotificationEntity n WHERE n.user.userId = :userId AND n.dateCreated >= :startDate")
    List<NotificationEntity> findRecentNotifications(
            @Param("userId") Long userId, 
            @Param("startDate") LocalDate startDate);
    
    // Count unread notifications for a user
    long countByUserUserIdAndIsReadFalse(Long userId);
    
    // Mark all notifications as read for a user
    @Modifying
    @Transactional
    @Query("UPDATE NotificationEntity n SET n.isRead = true WHERE n.user.userId = :userId")
    void markAllAsRead(@Param("userId") Long userId);
}