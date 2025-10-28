package com.cjainnovators.studdy.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subject")
public class SubjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int subjectId;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "major")
    private String major;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Relationships
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<TutorSubjectEntity> tutorSubjects = new ArrayList<>();

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<TuteeSubjectEntity> tuteeSubjects = new ArrayList<>();

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<SessionEntity> sessions = new ArrayList<>();

    public SubjectEntity() {
        super();
    }

    public SubjectEntity(String subjectName, String major, String description) {
        super();
        this.subjectName = subjectName;
        this.major = major;
        this.description = description;
    }

    // Getters and Setters
    public int getSubjectId() { return subjectId; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<TutorSubjectEntity> getTutorSubjects() { return tutorSubjects; }
    public void setTutorSubjects(List<TutorSubjectEntity> tutorSubjects) { this.tutorSubjects = tutorSubjects; }
    public List<TuteeSubjectEntity> getTuteeSubjects() { return tuteeSubjects; }
    public void setTuteeSubjects(List<TuteeSubjectEntity> tuteeSubjects) { this.tuteeSubjects = tuteeSubjects; }
    public List<SessionEntity> getSessions() { return sessions; }
    public void setSessions(List<SessionEntity> sessions) { this.sessions = sessions; }
}