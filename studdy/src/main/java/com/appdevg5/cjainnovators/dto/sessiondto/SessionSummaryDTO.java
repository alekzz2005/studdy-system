package com.appdevg5.cjainnovators.dto.sessiondto;

import lombok.Data;

@Data
public class SessionSummaryDTO {
    private Long sessionId;
    private String tuteeName;
    private String subjectName;
    private String sessionDate;
    private String status;
    private Float rating;
}
