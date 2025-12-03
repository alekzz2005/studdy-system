package com.appdevg5.cjainnovators.dto.tutordto;

import lombok.Data;
import java.util.List;

import com.appdevg5.cjainnovators.dto.sessiondto.SessionSummaryDTO;
import com.appdevg5.cjainnovators.dto.subjectdto.SubjectStatsDTO;
import com.appdevg5.cjainnovators.dto.userdto.UserDTO;

@Data
public class TutorProfileDTO {
    private TutorDTO tutorInfo;
    private UserDTO userInfo;
    private List<SessionSummaryDTO> upcomingSessions;
    private List<SessionSummaryDTO> recentSessions;
    private Double averageSessionRating;
    private Integer totalHoursTutored;
    private List<SubjectStatsDTO> subjectStats;
}