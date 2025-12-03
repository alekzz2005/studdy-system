package com.appdevg5.cjainnovators.dto.tutordto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectDTO;

@Data
public class TutorDTO {
    private Long tutorId;
    private LocalDate dateStarted;
    private Float averageRating;
    private Long userId;
    private String userEmail;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private List<TutorSubjectDTO> subjects;
    private int totalSessions;
    private boolean isActive;
}