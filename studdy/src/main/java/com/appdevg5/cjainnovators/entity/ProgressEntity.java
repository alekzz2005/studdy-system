package com.appdevg5.cjainnovators.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "progress")
public class ProgressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;

    @OneToOne
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private SessionEntity session;

    @OneToOne
    @JoinColumn(name = "tutee_subject_id", nullable = false)
    private TuteeSubjectEntity tuteeSubject;

    @Column(nullable = false)
    private String topicsCovered; // Comma-separated topics or JSON array
}