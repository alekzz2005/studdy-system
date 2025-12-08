package com.appdevg5.cjainnovators.dto.notificationdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequestDTO {
    private Long userId;
    private String notificationType;
    private String title;
    private String message;
}