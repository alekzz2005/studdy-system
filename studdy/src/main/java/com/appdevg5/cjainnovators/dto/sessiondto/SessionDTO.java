package com.appdevg5.cjainnovators.dto.sessiondto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {
    private Long sessionId;
    private Long tutorId;
    private Long tuteeId;
    private Long subjectId;
    private String goal;
    private String medium;
    private Integer duration;
    private int sessionMonth;
    private int sessionDay;
    private int sessionYear;
    private int startHour;
    private int startMinute;
    private String startAmPm;
    private String status;
    private Float rating;
    private String feedback;
}