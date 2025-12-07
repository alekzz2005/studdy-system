package com.appdevg5.cjainnovators.dto.userdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String address;
    private String bio;
    private String school;
    private int gradeLevel;
    private String major;
    private LocalDate dateStarted;
    private String type; // Tutee or Tutor
    private boolean active;
}