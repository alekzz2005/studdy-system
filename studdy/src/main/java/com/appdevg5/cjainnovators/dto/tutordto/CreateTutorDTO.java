package com.appdevg5.cjainnovators.dto.tutordto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectRequestDTO;

@Data
public class CreateTutorDTO {
    private Long userId;
    private LocalDate dateStarted;
    private List<TutorSubjectRequestDTO> subjects;
}