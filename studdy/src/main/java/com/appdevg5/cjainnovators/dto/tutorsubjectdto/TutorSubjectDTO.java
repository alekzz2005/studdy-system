package com.appdevg5.cjainnovators.dto.tutorsubjectdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorSubjectDTO {
    private Long tutorSubjectId;
    private Long tutorId;
    private Long subjectId;
    private String subjectName;
    private String subjectDesc;
    private int proficiencyLevel; // 1-5 scale
    private boolean isAvailable;
    private Double hourlyRate; // Optional: Add if you want tutor-specific rates
}