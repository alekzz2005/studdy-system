package com.appdevg5.cjainnovators.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "subject")
public class SubjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subjectId;
    
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TutorSubjectEntity> tutorSubjects = new ArrayList<>();

    @OneToMany(mappedBy = "subject")
    @Builder.Default
    private List<SessionEntity> sessions = new ArrayList<>();

    @Column(nullable = false)
    private String subjectName;

    @Column(nullable = false)
    private String subjectDesc;
}