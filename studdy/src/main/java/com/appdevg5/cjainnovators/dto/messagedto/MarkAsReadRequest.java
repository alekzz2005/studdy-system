package com.appdevg5.cjainnovators.dto.messagedto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkAsReadRequest {
    private Long conversationId;
    private Long userId;
}
