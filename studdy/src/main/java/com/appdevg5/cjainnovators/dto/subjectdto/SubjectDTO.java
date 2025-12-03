package com.appdevg5.cjainnovators.dto.subjectdto;

import lombok.Data;

@Data
public class SubjectDTO {
    private Long subjectId;
    private String subjectName;
    private String subjectDesc;
    private String topics; // JSON string or comma-separated
}