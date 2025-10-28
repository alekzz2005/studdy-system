package com.cjainnovators.studdy.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tutor_subject")
public class TutorSubjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tutorSubjectId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectEntity subject;

    @Column(name = "expertise_level")
    private String expertiseLevel; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    public TutorSubjectEntity() {
        super();
    }

    public TutorSubjectEntity(UserEntity user, SubjectEntity subject, String expertiseLevel) {
        super();
        this.user = user;
        this.subject = subject;
        this.expertiseLevel = expertiseLevel;
    }

    // Getters and Setters
    public int getTutorSubjectId() { return tutorSubjectId; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public SubjectEntity getSubject() { return subject; }
    public void setSubject(SubjectEntity subject) { this.subject = subject; }
    public String getExpertiseLevel() { return expertiseLevel; }
    public void setExpertiseLevel(String expertiseLevel) { this.expertiseLevel = expertiseLevel; }
}