package com.appdevg5.cjainnovators.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "studdy_user")
public class UserEntity {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String phoneNumber;
    
    private LocalDate dateStarted;
    private LocalDate dateOfBirth;
    private String address;
    private String bio;
    private String school;
    private int gradeLevel;
    private String major;

    private String type; //Tutee or Tutor
    
    @Column(name = "is_active")
    private boolean active;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<NotificationEntity> notifications;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TutorEntity tutor;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TuteeEntity tutee;

    @PrePersist
    protected void onCreate() {
        if (dateStarted == null) {
            dateStarted = LocalDate.now();
        }
    }
    
    public UserEntity(String firstName, String lastName, String email, String password, 
                     String phoneNumber, LocalDate dateOfBirth, String address, 
                     String bio, String school, int gradeLevel, String major, 
                     LocalDate dateStarted, String type ,boolean active) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.bio = bio;
        this.school = school;
        this.gradeLevel = gradeLevel;
        this.major = major;
        this.dateStarted = dateStarted;
        this.type = type;
        this.active = active;
    }
}