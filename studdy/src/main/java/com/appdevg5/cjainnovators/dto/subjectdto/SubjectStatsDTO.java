package com.appdevg5.cjainnovators.dto.subjectdto;

import lombok.Data;

@Data
public class SubjectStatsDTO {
    private String subjectName;
    private Integer sessionsCount;
    private Double averageRating;
}