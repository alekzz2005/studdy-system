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
        List<SessionEntity> sessions = sessionRepository.findByTutee_TuteeId(tuteeId);
        return sessions.stream()
            .filter(session -> "SCHEDULED".equals(session.getStatus()) || "IN_PROGRESS".equals(session.getStatus()))
            .filter(session -> session.getSessionDate().isAfter(LocalDate.now().minusDays(1)))
            .sorted(Comparator.comparing(SessionEntity::getSessionDate)
                .thenComparing(SessionEntity::getStartTime))
            .map(this::convertToSessionDTO)
            .collect(Collectors.toList());
    }
    
    public List<SessionDTO> getPastSessions(Long tuteeId) {
        List<SessionEntity> sessions = sessionRepository.findByTutee_TuteeId(tuteeId);
        return sessions.stream()
            .filter(session -> "COMPLETED".equals(session.getStatus()))
            .sorted(Comparator.comparing(SessionEntity::getSessionDate).reversed())
            .map(this::convertToSessionDTO)
            .collect(Collectors.toList());
    }

    public Map<String, Object> getTuteeStatistics(Long tuteeId) {
        List<SessionEntity> sessions = sessionRepository.findByTutee_TuteeId(tuteeId);
        
        long totalSessions = sessions.size();
        long completedSessions = sessions.stream()
            .filter(s -> "COMPLETED".equals(s.getStatus()))
            .count();
        long cancelledSessions = sessions.stream()
            .filter(s -> "CANCELLED".equals(s.getStatus()))
            .count();
        
        double totalHours = sessions.stream()
            .mapToDouble(s -> s.getDuration() / 60.0)
            .sum();
        
        double averageRating = sessions.stream()
            .filter(s -> s.getRating() != 0.0f)
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
        
        return dto;
    }
    
    private SessionDTO convertToSessionDTO(SessionEntity session) {
        SessionDTO dto = new SessionDTO();
        dto.setSessionId(session.getSessionId());
        dto.setTutorId(session.getTutor().getTutorId());
        dto.setTuteeId(session.getTutor().getTutorId());
        dto.setSubjectId(session.getSubject().getSubjectId());
        dto.setSessionDate(session.getSessionDate());
        dto.setStartTime(session.getStartTime());
        dto.setEndTime(session.getEndTime());
        dto.setDuration(session.getDuration());
        dto.setStatus(session.getStatus());
        dto.setRating(session.getRating());
        dto.setFeedback(session.getFeedback());
        return dto;
    }
}