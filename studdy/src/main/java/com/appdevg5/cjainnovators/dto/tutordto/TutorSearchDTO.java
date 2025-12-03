package com.appdevg5.cjainnovators.dto.tutordto;

import lombok.Data;

@Data
public class TutorSearchDTO {
    private String subject;
    private Integer minProficiency;
    private Boolean availableOnly;
    private Float minRating;
    private String sortBy; // "rating", "experience", "sessions"
    private String sortOrder; // "asc", "desc"
}