package com.appdevg5.cjainnovators.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tutee_subject")
public class TuteeSubjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tuteeSubjectId;
    
    // Foreign key relationships
    @OneToOne(mappedBy = "tuteeSubject", cascade = CascadeType.ALL, orphanRemoval = true)
    private ProgressEntity progress;

    @ManyToOne
    @JoinColumn(name = "tutee_id", nullable = false)
    private TuteeEntity tutee;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectEntity subject;

    private String learningGoal;
    private LocalDate startDate;
    private String status; // "ACTIVE", "COMPLETED", "ONGOING"
}