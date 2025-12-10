package com.appdevg5.cjainnovators.dto.messagedto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    private Long conversationId;
    private List<MessageDTO> messages;
    private ParticipantDTO participant;
}
