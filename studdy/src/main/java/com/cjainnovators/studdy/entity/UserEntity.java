package com.cjainnovators.studdy.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId; 
    
    private String firstName;
    private char middleInitial;
    private String lastName;
    private String email;
    private String phoneNumber;
    
    private String address;
    private String bio;
    private String school;
    private int gradeLevel;
    private String major;
    private String learningGoals;
    private int sessionsCompleted;
    private int hoursStudied;
    private int hoursTutored;
    private float averageRating;

    private String password;

    // Add user role field
    private String role = "STUDENT"; // Default role


    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TutorSubjectEntity> tutorSubjects = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TuteeSubjectEntity> tuteeSubjects = new ArrayList<>();

    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL)
    private List<SessionEntity> tutorSessions = new ArrayList<>();

    @OneToMany(mappedBy = "tutee", cascade = CascadeType.ALL)
    private List<SessionEntity> tuteeSessions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<ProgressEntity> progressRecords = new ArrayList<>();

    public UserEntity() {
        super();
    }

    public UserEntity(String firstName, char middleInitial, String lastName, 
                     String email, String phoneNumber, String password,
                     String address, String bio, String school, int gradeLevel, 
                     String major, String learningGoals, int sessionsCompleted, 
                     int hoursStudied, int hoursTutored, float averageRating) {
        super();
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password; 

        this.address = address;
        this.bio = bio;
        this.school = school;
        this.gradeLevel = gradeLevel;
        this.major = major;
        this.learningGoals = learningGoals;
        this.sessionsCompleted = sessionsCompleted;
        this.hoursStudied = hoursStudied;
        this.hoursTutored = hoursTutored;
        this.averageRating = averageRating;
    }

    // Setters and Getters for basic fields
    public int getUserId() { return userId; }
    public String getFirstName() { return firstName; }
    public char getMiddleInitial() { return middleInitial; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }

    public String getAddress() { return address; }
    public String getBio() { return bio; }
    public String getSchool() { return school; }
    public int getGradeLevel() { return gradeLevel; }
    public String getMajor() { return major; }
    public String getLearningGoals() { return learningGoals; }
    public int getSessionsCompleted() { return sessionsCompleted; }
    public int getHoursStudied() { return hoursStudied; }
    public int getHoursTutored() { return hoursTutored; }
    public float getAverageRating() { return averageRating; }

    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setMiddleInitial(char middleInitial) { this.middleInitial = middleInitial; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public void setAddress(String address) { this.address = address; }
    public void setBio(String bio) { this.bio = bio; }
    public void setSchool(String school) { this.school = school; }
    public void setGradeLevel(int gradeLevel) { this.gradeLevel = gradeLevel; }
    public void setMajor(String major) { this.major = major; }
    public void setLearningGoals(String learningGoals) { this.learningGoals = learningGoals; }
    public void setSessionsCompleted(int sessionsCompleted) { this.sessionsCompleted = sessionsCompleted; }
    public void setHoursStudied(int hoursStudied) { this.hoursStudied = hoursStudied; }
    public void setHoursTutored(int hoursTutored) { this.hoursTutored = hoursTutored; }
    public void setAverageRating(float averageRating) { this.averageRating = averageRating; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // Getters and Setters for relationship fields
    public List<TutorSubjectEntity> getTutorSubjects() { return tutorSubjects; }
    public void setTutorSubjects(List<TutorSubjectEntity> tutorSubjects) { this.tutorSubjects = tutorSubjects; }
    
    public List<TuteeSubjectEntity> getTuteeSubjects() { return tuteeSubjects; }
    public void setTuteeSubjects(List<TuteeSubjectEntity> tuteeSubjects) { this.tuteeSubjects = tuteeSubjects; }
    
    public List<SessionEntity> getTutorSessions() { return tutorSessions; }
    public void setTutorSessions(List<SessionEntity> tutorSessions) { this.tutorSessions = tutorSessions; }
    
    public List<SessionEntity> getTuteeSessions() { return tuteeSessions; }
    public void setTuteeSessions(List<SessionEntity> tuteeSessions) { this.tuteeSessions = tuteeSessions; }
    
    public List<ProgressEntity> getProgressRecords() { return progressRecords; }
    public void setProgressRecords(List<ProgressEntity> progressRecords) { this.progressRecords = progressRecords; }
}