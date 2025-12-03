package com.appdevg5.cjainnovators.dto.tuteedto;

import java.util.List;

import lombok.Data;

@Data
public class CreateTuteeDTO {
    private Long userId;
    private List<Long> subjectIds;
}
