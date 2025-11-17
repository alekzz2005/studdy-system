package com.cjainnovators.studdy.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tutee_subject")
public class TuteeSubjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tuteeSubjectId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectEntity subject;

    @Column(name = "current_progress")
    private Float currentProgress; // 0-100 percentage

    @Column(name = "goal_desc", columnDefinition = "TEXT")
    private String goalDescription;

    public TuteeSubjectEntity() {
        super();
    }

    public TuteeSubjectEntity(UserEntity user, SubjectEntity subject, Float currentProgress, String goalDescription) {
        super();
        this.user = user;
        this.subject = subject;
        this.currentProgress = currentProgress;
        this.goalDescription = goalDescription;
    }

    // Getters and Setters
    public int getTuteeSubjectId() { return tuteeSubjectId; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public SubjectEntity getSubject() { return subject; }
    public void setSubject(SubjectEntity subject) { this.subject = subject; }
    public Float getCurrentProgress() { return currentProgress; }
    public void setCurrentProgress(Float currentProgress) { this.currentProgress = currentProgress; }
    public String getGoalDescription() { return goalDescription; }
    public void setGoalDescription(String goalDescription) { this.goalDescription = goalDescription; }
}