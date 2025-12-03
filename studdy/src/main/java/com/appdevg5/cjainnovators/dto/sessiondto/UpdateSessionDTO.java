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
public class UpdateSessionDTO {
    private LocalDate sessionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer duration;
    private String status;
    private Float rating;
    private String feedback;
}
