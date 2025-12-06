package com.appdevg5.cjainnovators.dto.sessiondto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

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
    private LocalDate sessionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private Float rating;
    private String feedback;
}