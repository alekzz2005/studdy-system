package com.appdevg5.cjainnovators.dto.tutorsubjectdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTutorSubjectDTO {
    private Long tutorId;
    private Long subjectId;
}