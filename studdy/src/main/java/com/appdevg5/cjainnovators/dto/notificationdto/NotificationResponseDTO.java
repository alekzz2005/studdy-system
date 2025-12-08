package com.appdevg5.cjainnovators.dto.notificationdto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {
    private Long notificationId;
    private Long userId;
    private String firstName;
    private String notificationType;
    private String title;
    private String message;
    private boolean isRead;
    private LocalDate dateCreated;
}