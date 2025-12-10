package com.appdevg5.cjainnovators.dto.messagedto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Long conversationId;
    private ParticipantDTO participant;
    private LastMessageDTO lastMessage;
    private int unreadCount;
    private boolean online;
    private String subject;
    private LocalDateTime updatedAt;
}