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
}