package com.appdev.cjainnovators.besanezg5.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "subject")
public class SubjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int subjectId;
    private String subjectName;
    private String major;
    private String subjectDescription;

    public SubjectEntity() {
        super();
    }

    public SubjectEntity(String subjectName, String major, String subjectDescription) {
        super();
        this.subjectName = subjectName;
        this.major = major;
        this.subjectDescription = subjectDescription;
    }

    //Setters and Getters
    public int getSubjectId() { return subjectId; }
    public String getSubjectName() { return subjectName; }
    public String getMajor() { return major; }
    public String getSubjectDescription() { return subjectDescription; }

    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public void setMajor(String major) { this.major = major; }
    public void setSubjectDescription(String subjectDescription) { this.subjectDescription = subjectDescription; }
}
