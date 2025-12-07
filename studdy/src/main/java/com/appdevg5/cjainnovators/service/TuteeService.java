package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.sessiondto.SessionDTO;
import com.appdevg5.cjainnovators.dto.tuteedto.*;
import com.appdevg5.cjainnovators.entity.*;
import com.appdevg5.cjainnovators.repository.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TuteeService {
    
    @Autowired
    private final TuteeRepository tuteeRepository;
    
    @Autowired
    private final UserRepository userRepository;
    
    @Autowired
    private final SessionRepository sessionRepository;
    
    public TuteeService(TuteeRepository tuteeRepository,
                       UserRepository userRepository,
                       SubjectRepository subjectRepository,
                       SessionRepository sessionRepository,
                       TutorRepository tutorRepository) {
        this.tuteeRepository = tuteeRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }
    
    // ========== CRUD Operations ==========
    // Create Tutee
    @Transactional
    public TuteeDTO createTutee(CreateTuteeDTO createTuteeDTO) {
        UserEntity user = userRepository.findById(createTuteeDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + createTuteeDTO.getUserId()));
        
        Optional<TuteeEntity> existingTutee = tuteeRepository.findByUser_UserId(createTuteeDTO.getUserId());
        if (existingTutee.isPresent()) {
            throw new RuntimeException("User is already registered as a tutee");
        }
        
        TuteeEntity tutee = TuteeEntity.builder()
            .user(user)
            .hoursStudied(0)
            .build();
        
        TuteeEntity savedTutee = tuteeRepository.save(tutee);
        
        return convertToDTO(savedTutee);
    }
    
    // Get Tutee
    public TuteeDTO getTuteeById(Long tuteeId) {
        TuteeEntity tutee = tuteeRepository.findById(tuteeId)
            .orElseThrow(() -> new RuntimeException("Tutee not found with ID: " + tuteeId));
        return convertToDTO(tutee);
    }
    
    public TuteeDTO getTuteeByUserId(Long userId) {
        TuteeEntity tutee = tuteeRepository.findByUser_UserId(userId)
            .orElseThrow(() -> new RuntimeException("Tutee not found for user ID: " + userId));
        return convertToDTO(tutee);
    }
    
    public List<TuteeDTO> getAllTutees() {
        return tuteeRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Update Tutee
    @Transactional
    public TuteeDTO updateTutee(Long tuteeId, UpdateTuteeDTO updateTuteeDTO) {
        TuteeEntity tutee = tuteeRepository.findById(tuteeId)
            .orElseThrow(() -> new RuntimeException("Tutee not found with ID: " + tuteeId));
        
        tutee.setHoursStudied(updateTuteeDTO.getHoursStudied());
        
        TuteeEntity updatedTutee = tuteeRepository.save(tutee);
        return convertToDTO(updatedTutee);
    }
    
    // Delete Tutee
    @Transactional
    public void deleteTutee(Long tuteeId) {
        TuteeEntity tutee = tuteeRepository.findById(tuteeId)
            .orElseThrow(() -> new RuntimeException("Tutee not found with ID: " + tuteeId));
        
        tuteeRepository.delete(tutee);
    }
    
    // ========== Session Operations ==========
    public List<SessionDTO> getTuteeSessions(Long tuteeId) {
        List<SessionEntity> sessions = sessionRepository.findByTutee_TuteeId(tuteeId);
        return sessions.stream()
            .map(this::convertToSessionDTO)
            .collect(Collectors.toList());
    }

    public List<SessionDTO> getUpcomingSessions(Long tuteeId) {
        // Get current date components
        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();
        int currentMonth = today.getMonthValue();
        int currentDay = today.getDayOfMonth();
        
        List<SessionEntity> sessions = sessionRepository.findByTutee_TuteeId(tuteeId);
        
        return sessions.stream()
            .filter(session -> "Pending".equals(session.getStatus()) || 
                            "Accepted".equals(session.getStatus()) || 
                            "Ongoing".equals(session.getStatus()))
            .filter(session -> {
                // Filter sessions that are today or in the future
                if (session.getSessionYear() > currentYear) {
                    return true;
                } else if (session.getSessionYear() == currentYear) {
                    if (session.getSessionMonth() > currentMonth) {
                        return true;
                    } else if (session.getSessionMonth() == currentMonth) {
                        return session.getSessionDay() >= currentDay;
                    }
                }
                return false;
            })
            .sorted((s1, s2) -> {
                // Sort by date (year, month, day) and time
                if (s1.getSessionYear() != s2.getSessionYear()) {
                    return Integer.compare(s1.getSessionYear(), s2.getSessionYear());
                }
                if (s1.getSessionMonth() != s2.getSessionMonth()) {
                    return Integer.compare(s1.getSessionMonth(), s2.getSessionMonth());
                }
                if (s1.getSessionDay() != s2.getSessionDay()) {
                    return Integer.compare(s1.getSessionDay(), s2.getSessionDay());
                }
                
                // Convert time to 24-hour format for comparison
                int hour1 = convertTo24Hour(s1.getStartHour(), s1.getStartAmPm());
                int hour2 = convertTo24Hour(s2.getStartHour(), s2.getStartAmPm());
                
                if (hour1 != hour2) {
                    return Integer.compare(hour1, hour2);
                }
                return Integer.compare(s1.getStartMinute(), s2.getStartMinute());
            })
            .map(this::convertToSessionDTO)
            .collect(Collectors.toList());
    }

    public List<SessionDTO> getPastSessions(Long tuteeId) {
        // Get current date components
        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();
        int currentMonth = today.getMonthValue();
        int currentDay = today.getDayOfMonth();
        
        List<SessionEntity> sessions = sessionRepository.findByTutee_TuteeId(tuteeId);
        
        return sessions.stream()
            .filter(session -> "Completed".equals(session.getStatus()) || 
                            "Cancelled".equals(session.getStatus()))
            .filter(session -> {
                // Filter sessions that are in the past
                if (session.getSessionYear() < currentYear) {
                    return true;
                } else if (session.getSessionYear() == currentYear) {
                    if (session.getSessionMonth() < currentMonth) {
                        return true;
                    } else if (session.getSessionMonth() == currentMonth) {
                        return session.getSessionDay() < currentDay;
                    }
                }
                return false;
            })
            .sorted((s1, s2) -> {
                // Sort by date descending (most recent first)
                if (s1.getSessionYear() != s2.getSessionYear()) {
                    return Integer.compare(s2.getSessionYear(), s1.getSessionYear());
                }
                if (s1.getSessionMonth() != s2.getSessionMonth()) {
                    return Integer.compare(s2.getSessionMonth(), s1.getSessionMonth());
                }
                if (s1.getSessionDay() != s2.getSessionDay()) {
                    return Integer.compare(s2.getSessionDay(), s1.getSessionDay());
                }
                
                // Convert time to 24-hour format for comparison
                int hour1 = convertTo24Hour(s1.getStartHour(), s1.getStartAmPm());
                int hour2 = convertTo24Hour(s2.getStartHour(), s2.getStartAmPm());
                
                if (hour1 != hour2) {
                    return Integer.compare(hour2, hour1);
                }
                return Integer.compare(s2.getStartMinute(), s1.getStartMinute());
            })
            .map(this::convertToSessionDTO)
            .collect(Collectors.toList());
    }

    // Helper method to convert 12-hour time to 24-hour format for comparison
    private int convertTo24Hour(int hour12, String amPm) {
        if (amPm == null) return hour12;
        
        if ("PM".equalsIgnoreCase(amPm)) {
            return (hour12 == 12) ? 12 : hour12 + 12;
        } else { // AM
            return (hour12 == 12) ? 0 : hour12;
        }
    }

    public Map<String, Object> getTuteeStatistics(Long tuteeId) {
        List<SessionEntity> sessions = sessionRepository.findByTutee_TuteeId(tuteeId);
        
        long totalSessions = sessions.size();
        long completedSessions = sessions.stream()
            .filter(s -> "Completed".equals(s.getStatus()))
            .count();
        long cancelledSessions = sessions.stream()
            .filter(s -> "Cancelled".equals(s.getStatus()))
            .count();
        
        // Sum up durations (in minutes) and convert to hours
        double totalHours = sessions.stream()
            .mapToDouble(s -> s.getDuration() / 60.0)
            .sum();
        
        double averageRating = sessions.stream()
            .filter(s -> s.getRating() != null && s.getRating() > 0)
            .mapToDouble(SessionEntity::getRating)
            .average()
            .orElse(0.0);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSessions", totalSessions);
        stats.put("completedSessions", completedSessions);
        stats.put("cancelledSessions", cancelledSessions);
        stats.put("totalHours", Math.round(totalHours * 10.0) / 10.0);
        stats.put("averageRating", Math.round(averageRating * 10.0) / 10.0);
        stats.put("completionRate", totalSessions > 0 ? 
            Math.round((double) completedSessions / totalSessions * 100.0) : 0);
        
        return stats;
    }
    
    // ========== Conversion Methods ==========
    private TuteeDTO convertToDTO(TuteeEntity tutee) {
        TuteeDTO dto = new TuteeDTO();
        dto.setTuteeId(tutee.getTuteeId());
        dto.setUserId(tutee.getUser().getUserId());
        dto.setHoursStudied(tutee.getHoursStudied());
        dto.setUserEmail(tutee.getUser().getEmail());
        dto.setFirstName(tutee.getUser().getFirstName());
        dto.setLastName(tutee.getUser().getLastName());
        dto.setPhoneNumber(tutee.getUser().getPhoneNumber());
        // Get total sessions 
        List<SessionEntity> sessions = sessionRepository.findByTutee_TuteeId(tutee.getTuteeId());
        dto.setTotalSessions(sessions.size());
        dto.setActive(tutee.getUser().isActive());
        
        return dto;
    }
    
    private SessionDTO convertToSessionDTO(SessionEntity session) {
        SessionDTO dto = new SessionDTO();
        dto.setSessionId(session.getSessionId());
        dto.setTutorId(session.getTutor().getTutorId());
        dto.setTuteeId(session.getTutor().getTutorId());
        dto.setSubjectId(session.getSubject().getSubjectId());
        dto.setGoal(session.getGoal());
        dto.setMedium(session.getMedium());
        dto.setDuration(session.getDuration());
        dto.setSessionMonth(session.getSessionMonth());
        dto.setSessionDay(session.getSessionDay());
        dto.setSessionYear(session.getSessionYear());
        dto.setStartHour(session.getStartHour());
        dto.setStartMinute(session.getStartMinute());
        dto.setStartAmPm(session.getStartAmPm());
        dto.setStatus(session.getStatus());
        dto.setRating(session.getRating());
        dto.setFeedback(session.getFeedback());
        return dto;
    }
}