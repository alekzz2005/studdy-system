package com.appdevg5.cjainnovators.dto.tuteesubjectdto;

import lombok.Data;

@Data
public class TuteeSubjectDTO {
    private Long tuteeSubjectId;
    private Long subjectId;
    private String subjectName;
    private String learningGoal;
    private String status;
    private String startDate;
}