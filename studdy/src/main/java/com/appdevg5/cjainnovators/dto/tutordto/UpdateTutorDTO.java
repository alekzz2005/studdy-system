package com.appdevg5.cjainnovators.dto.tutordto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectRequestDTO;

@Data
public class UpdateTutorDTO {
    private LocalDate dateStarted;
    private Float averageRating;
    private List<TutorSubjectRequestDTO> subjects;
    private boolean available;
}