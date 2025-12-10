package com.appdevg5.cjainnovators.dto.messagedto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long messageId;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String senderType; // Changed from enum to string to match UserDTO
    private String text;
    private boolean read;
    private LocalDateTime timestamp;
    private String type; // Changed from enum to string
}