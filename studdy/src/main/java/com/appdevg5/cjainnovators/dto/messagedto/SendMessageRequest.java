package com.appdevg5.cjainnovators.dto.messagedto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private Long receiverId;
    private String text;
    private String type;
    private String subject;
}
