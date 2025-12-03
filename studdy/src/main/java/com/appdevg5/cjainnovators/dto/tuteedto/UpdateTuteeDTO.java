package com.appdevg5.cjainnovators.dto.tuteedto;

import java.util.List;

import lombok.Data;

@Data
public class UpdateTuteeDTO {
    private int hoursStudied;
    private List<Long> subjectIdsToAdd;
    private List<Long> subjectIdsToRemove;
}
