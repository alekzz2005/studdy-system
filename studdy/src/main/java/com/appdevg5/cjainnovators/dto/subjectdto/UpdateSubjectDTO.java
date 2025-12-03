package com.appdevg5.cjainnovators.dto.subjectdto;

import java.util.List;

import lombok.Data;

@Data
public class UpdateSubjectDTO {
    private String subjectName;
    private String subjectDesc;
    private List<String> topics;
}
