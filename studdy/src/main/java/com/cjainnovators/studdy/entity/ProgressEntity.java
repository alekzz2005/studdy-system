package com.cjainnovators.studdy.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress")
public class ProgressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int progressId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "subject_id", nullable = false)
    private int subjectId;

    @Column(name = "topics_covered", columnDefinition = "TEXT")
    private String topicsCovered;

    @Column(name = "progress_percentage")
    private float progressPercentage;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public ProgressEntity() {
        super();
        this.lastUpdated = LocalDateTime.now();
    }

    public ProgressEntity(UserEntity user, int subjectId, String topicsCovered, 
                         float progressPercentage, LocalDateTime lastUpdated) {
        super();
        this.user = user;
        this.subjectId = subjectId;
        this.topicsCovered = topicsCovered;
        this.progressPercentage = progressPercentage;
        this.lastUpdated = lastUpdated != null ? lastUpdated : LocalDateTime.now();
    }

    // Getters and Setters
    public int getProgressId() {
        return progressId;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public int getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
    }

    public String getTopicsCovered() {
        return topicsCovered;
    }

    public void setTopicsCovered(String topicsCovered) {
        this.topicsCovered = topicsCovered;
    }

    public float getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(float progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    // Pre-update hook to automatically update lastUpdated timestamp
    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}