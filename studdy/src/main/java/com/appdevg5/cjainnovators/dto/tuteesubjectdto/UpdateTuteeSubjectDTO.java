package com.appdevg5.cjainnovators.dto.tuteesubjectdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTuteeSubjectDTO {
    private String learningGoal;
    private LocalDate startDate;
    private String status;
}
