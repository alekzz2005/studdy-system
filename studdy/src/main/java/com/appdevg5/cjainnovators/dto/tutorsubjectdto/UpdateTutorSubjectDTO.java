package com.appdevg5.cjainnovators.dto.tutorsubjectdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTutorSubjectDTO {
    private int proficiencyLevel;
    private boolean available;
}