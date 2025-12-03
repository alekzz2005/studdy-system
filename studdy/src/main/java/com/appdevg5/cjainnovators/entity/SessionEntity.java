package com.appdevg5.cjainnovators.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "session")
public class SessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    // Foreign key relationships
    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private TutorEntity tutor;

    @ManyToOne
    @JoinColumn(name = "tutee_id", nullable = false)
    private TuteeEntity tutee;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectEntity subject;
    
    @OneToOne(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private ProgressEntity progress;

    private LocalDate sessionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int duration;
    private String status;
    private Float rating;
    private String feedback;
}