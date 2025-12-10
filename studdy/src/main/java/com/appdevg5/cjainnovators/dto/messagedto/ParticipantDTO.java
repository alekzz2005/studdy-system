package com.appdevg5.cjainnovators.dto.messagedto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantDTO {
    private Long userId;
    private String name;
    private String type;
    private String subject;
    private String avatar;
    private boolean online;
}
