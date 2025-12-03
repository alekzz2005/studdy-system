package com.appdevg5.cjainnovators.dto.tuteedto;

import java.util.List;
import java.util.Map;

import com.appdevg5.cjainnovators.dto.sessiondto.SessionDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TuteeDashboardDTO {
    private TuteeDTO tuteeInfo;
    private List<SessionDTO> upcomingSessions;
    private List<SessionDTO> pastSessions;
    private Map<String, Double> subjectProgress; // subjectName -> progress percentage
    private int totalHoursStudied;
    private double averageSessionRating;
}