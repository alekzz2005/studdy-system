package com.appdevg5.cjainnovators.dto.sessiondto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSessionDTO {
    private Long tutorId;
    private Long tuteeId;
    private Long subjectId;
    private LocalDate sessionDate;
    private LocalTime startTime;
    private Integer duration;
    private String status;
}
