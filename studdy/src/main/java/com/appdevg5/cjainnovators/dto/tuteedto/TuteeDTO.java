package com.appdevg5.cjainnovators.dto.tuteedto;

import lombok.Data;

@Data
public class TuteeDTO {
    private Long tuteeId;
    private Long userId;
    private int hoursStudied;
    private String userEmail;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private int totalSessions;
    private boolean isActive;
}


