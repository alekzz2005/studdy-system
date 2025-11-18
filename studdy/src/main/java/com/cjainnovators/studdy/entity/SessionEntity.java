package com.cjainnovators.studdy.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "session")
public class SessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sessionId;

    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private UserEntity tutor;       

    @ManyToOne
    @JoinColumn(name = "tutee_id", nullable = false)
    private UserEntity tutee;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectEntity subject;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate; // Date of the session

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime; // Start time of the session

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime; // End time of the session

    @Column(name = "status")
    private String status; // SCHEDULED, COMPLETED, CANCELLED, NO_SHOW

    @Column(name = "rating")
    private Integer rating; // 1-5 stars

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    public SessionEntity() {
        super();
        this.status = "SCHEDULED";
    }

    public SessionEntity(UserEntity tutor, UserEntity tutee, SubjectEntity subject, 
                        LocalDate sessionDate, LocalTime startTime, LocalTime endTime, 
                        String status, Integer rating, String feedback) {
        super();
        this.tutor = tutor;
        this.tutee = tutee;
        this.subject = subject;
        this.sessionDate = sessionDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status != null ? status : "SCHEDULED";
        this.rating = rating;
        this.feedback = feedback;
    }

    // Getters and Setters
    public int getSessionId() { return sessionId; }
    public UserEntity getTutor() { return tutor; }
    public void setTutor(UserEntity tutor) { this.tutor = tutor; }
    public UserEntity getTutee() { return tutee; }
    public void setTutee(UserEntity tutee) { this.tutee = tutee; }
    public SubjectEntity getSubject() { return subject; }
    public void setSubject(SubjectEntity subject) { this.subject = subject; }
    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}