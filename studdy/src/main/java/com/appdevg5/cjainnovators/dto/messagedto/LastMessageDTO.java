package com.appdevg5.cjainnovators.dto.messagedto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LastMessageDTO {
    private String text;
    private LocalDateTime timestamp;
    private Long senderId;
    private boolean read;
}