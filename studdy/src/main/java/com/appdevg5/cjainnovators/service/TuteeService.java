package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.sessiondto.SessionDTO;
import com.appdevg5.cjainnovators.dto.tuteedto.*;
import com.appdevg5.cjainnovators.dto.tuteesubjectdto.TuteeSubjectDTO;
import com.appdevg5.cjainnovators.dto.tutordto.TutorDTO;
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
    
    private final TuteeRepository tuteeRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final TuteeSubjectRepository tuteeSubjectRepository;
    private final SessionRepository sessionRepository;
    private final TutorRepository tutorRepository;
    
    @Autowired
    public TuteeService(TuteeRepository tuteeRepository,
                       UserRepository userRepository,
                       SubjectRepository subjectRepository,
                       TuteeSubjectRepository tuteeSubjectRepository,
                       SessionRepository sessionRepository,
                       TutorRepository tutorRepository) {
        this.tuteeRepository = tuteeRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.tuteeSubjectRepository = tuteeSubjectRepository;
        this.sessionRepository = sessionRepository;
        this.tutorRepository = tutorRepository;
    }
    
    // ========== CRUD Operations ==========
    
    @Transactional
    public TuteeDTO createTutee(CreateTuteeDTO createTuteeDTO) {
        // Validate user exists and is not already a tutee
        UserEntity user = userRepository.findById(createTuteeDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + createTuteeDTO.getUserId()));
        
        // Check if user is already a tutee
        Optional<TuteeEntity> existingTutee = tuteeRepository.findByUser_UserId(createTuteeDTO.getUserId());
        if (existingTutee.isPresent()) {
            throw new RuntimeException("User is already registered as a tutee");
        }
        
        // Create new tutee
        TuteeEntity tutee = TuteeEntity.builder()
            .user(user)
            .hoursStudied(0)
            .build();
        
        TuteeEntity savedTutee = tuteeRepository.save(tutee);
        
        // Enroll in subjects if provided
        if (createTuteeDTO.getSubjectIds() != null && !createTuteeDTO.getSubjectIds().isEmpty()) {
            enrollTuteeInSubjects(savedTutee.getTuteeId(), createTuteeDTO.getSubjectIds());
        }
        
        return convertToDTO(savedTutee);
    }
    
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
    
    @Transactional
    public TuteeDTO updateTutee(Long tuteeId, UpdateTuteeDTO updateTuteeDTO) {
        TuteeEntity tutee = tuteeRepository.findById(tuteeId)
            .orElseThrow(() -> new RuntimeException("Tutee not found with ID: " + tuteeId));
        
        // Update basic information
        tutee.setHoursStudied(updateTuteeDTO.getHoursStudied());
        
        // Update subjects if provided
        if (updateTuteeDTO.getSubjectIdsToAdd() != null && !updateTuteeDTO.getSubjectIdsToAdd().isEmpty()) {
            enrollTuteeInSubjects(tuteeId, updateTuteeDTO.getSubjectIdsToAdd());
        }
        
        if (updateTuteeDTO.getSubjectIdsToRemove() != null && !updateTuteeDTO.getSubjectIdsToRemove().isEmpty()) {
            removeTuteeFromSubjects(tuteeId, updateTuteeDTO.getSubjectIdsToRemove());
        }
        
        TuteeEntity updatedTutee = tuteeRepository.save(tutee);
        return convertToDTO(updatedTutee);
    }
    
    @Transactional
    public void deleteTutee(Long tuteeId) {
        TuteeEntity tutee = tuteeRepository.findById(tuteeId)
            .orElseThrow(() -> new RuntimeException("Tutee not found with ID: " + tuteeId));
        
        // Remove all subject enrollments first
        List<TuteeSubjectEntity> tuteeSubjects = tuteeSubjectRepository.findByTutee_TuteeId(tuteeId);
        tuteeSubjectRepository.deleteAll(tuteeSubjects);
        
        tuteeRepository.delete(tutee);
    }
    
    // ========== Subject Enrollment Operations ==========
    
    @Transactional
    public TuteeSubjectDTO enrollInSubject(TuteeEnrollmentDTO enrollmentDTO) {
        TuteeEntity tutee = tuteeRepository.findById(enrollmentDTO.getTuteeId())
            .orElseThrow(() -> new RuntimeException("Tutee not found"));
        
        SubjectEntity subject = subjectRepository.findById(enrollmentDTO.getSubjectId())
            .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        // Check if already enrolled
        Optional<TuteeSubjectEntity> existingEnrollment = tuteeSubjectRepository
            .findByTutee_TuteeIdAndSubject_SubjectId(enrollmentDTO.getTuteeId(), enrollmentDTO.getSubjectId());
        
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("Tutee is already enrolled in this subject");
        }
        
        // Create enrollment
        TuteeSubjectEntity enrollment = TuteeSubjectEntity.builder()
            .tutee(tutee)
            .subject(subject)
            .learningGoal(enrollmentDTO.getLearningGoal())
            .startDate(LocalDate.now())
            .status("ACTIVE")
            .build();
        
        TuteeSubjectEntity savedEnrollment = tuteeSubjectRepository.save(enrollment);
        
        return convertToTuteeSubjectDTO(savedEnrollment);
    }
    
    @Transactional
    public void unenrollFromSubject(Long tuteeId, Long subjectId) {
        TuteeSubjectEntity enrollment = tuteeSubjectRepository
            .findByTutee_TuteeIdAndSubject_SubjectId(tuteeId, subjectId)
            .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        // Soft delete by changing status
        enrollment.setStatus("WITHDRAWN");
        tuteeSubjectRepository.save(enrollment);
    }
    
    public List<TuteeSubjectDTO> getTuteeSubjects(Long tuteeId) {
        List<TuteeSubjectEntity> enrollments = tuteeSubjectRepository.findByTutee_TuteeId(tuteeId);
        return enrollments.stream()
            .map(this::convertToTuteeSubjectDTO)
            .collect(Collectors.toList());
    }
    
    public List<TuteeSubjectDTO> getActiveTuteeSubjects(Long tuteeId) {
        List<TuteeSubjectEntity> enrollments = tuteeSubjectRepository
            .findByTuteeIdAndStatus(tuteeId, "ACTIVE");
        return enrollments.stream()
            .map(this::convertToTuteeSubjectDTO)
            .collect(Collectors.toList());
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
    
    // ========== Dashboard & Analytics ==========
    
    public TuteeDashboardDTO getTuteeDashboard(Long tuteeId) {
        TuteeEntity tutee = tuteeRepository.findById(tuteeId)
            .orElseThrow(() -> new RuntimeException("Tutee not found"));
        
        TuteeDTO tuteeInfo = convertToDTO(tutee);
        List<SessionDTO> upcomingSessions = getUpcomingSessions(tuteeId);
        List<SessionDTO> pastSessions = getPastSessions(tuteeId);
        
        // Calculate subject progress (simplified - could be enhanced)
        Map<String, Double> subjectProgress = calculateSubjectProgress(tuteeId);
        
        // Calculate average session rating
        double averageRating = pastSessions.stream()
            .filter(s -> s.getRating() != null)
            .mapToDouble(SessionDTO::getRating)
            .average()
            .orElse(0.0);
        
        return TuteeDashboardDTO.builder()
            .tuteeInfo(tuteeInfo)
            .upcomingSessions(upcomingSessions)
            .pastSessions(pastSessions)
            .subjectProgress(subjectProgress)
            .totalHoursStudied(tutee.getHoursStudied())
            .averageSessionRating(Math.round(averageRating * 10.0) / 10.0)
            .build();
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
    
    // ========== Helper Methods ==========
    
    @Transactional
    private void enrollTuteeInSubjects(Long tuteeId, List<Long> subjectIds) {
        TuteeEntity tutee = tuteeRepository.findById(tuteeId)
            .orElseThrow(() -> new RuntimeException("Tutee not found"));
        
        for (Long subjectId : subjectIds) {
            SubjectEntity subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectId));
            
            // Check if already enrolled
            boolean alreadyEnrolled = tuteeSubjectRepository
                .findByTutee_TuteeIdAndSubject_SubjectId(tuteeId, subjectId)
                .isPresent();
            
            if (!alreadyEnrolled) {
                TuteeSubjectEntity enrollment = TuteeSubjectEntity.builder()
                    .tutee(tutee)
                    .subject(subject)
                    .learningGoal("Learn " + subject.getSubjectName())
                    .startDate(LocalDate.now())
                    .status("ACTIVE")
                    .build();
                
                tuteeSubjectRepository.save(enrollment);
            }
        }
    }
    
    @Transactional
    private void removeTuteeFromSubjects(Long tuteeId, List<Long> subjectIds) {
        for (Long subjectId : subjectIds) {
            Optional<TuteeSubjectEntity> enrollment = tuteeSubjectRepository
                .findByTutee_TuteeIdAndSubject_SubjectId(tuteeId, subjectId);
            
            enrollment.ifPresent(e -> {
                e.setStatus("WITHDRAWN");
                tuteeSubjectRepository.save(e);
            });
        }
    }
    
    private Map<String, Double> calculateSubjectProgress(Long tuteeId) {
        List<TuteeSubjectEntity> enrollments = tuteeSubjectRepository.findByTutee_TuteeId(tuteeId);
        Map<String, Double> progress = new HashMap<>();
        
        for (TuteeSubjectEntity enrollment : enrollments) {
            // This is a simplified calculation - you can enhance this based on actual progress tracking
            double progressValue = switch (enrollment.getStatus()) {
                case "ACTIVE" -> 25.0;
                case "IN_PROGRESS" -> 50.0;
                case "NEAR_COMPLETION" -> 75.0;
                case "COMPLETED" -> 100.0;
                default -> 0.0;
            };
            
            progress.put(enrollment.getSubject().getSubjectName(), progressValue);
        }
        
        return progress;
    }
    
    // ========== Conversion Methods ==========
    
    private TuteeDTO convertToDTO(TuteeEntity tutee) {
        TuteeDTO dto = new TuteeDTO();
        dto.setTuteeId(tutee.getTuteeId());
        dto.setUserId(tutee.getUser().getUserId());
        dto.setHoursStudied(tutee.getHoursStudied());
        
        // Convert subjects
        List<TuteeSubjectDTO> subjectDTOs = tutee.getSubjects().stream()
            .map(this::convertToTuteeSubjectDTO)
            .collect(Collectors.toList());
        dto.setSubjects(subjectDTOs);
        
        return dto;
    }
    
    private TuteeSubjectDTO convertToTuteeSubjectDTO(TuteeSubjectEntity enrollment) {
        TuteeSubjectDTO dto = new TuteeSubjectDTO();
        dto.setTuteeSubjectId(enrollment.getTuteeSubjectId());
        dto.setSubjectId(enrollment.getSubject().getSubjectId());
        dto.setSubjectName(enrollment.getSubject().getSubjectName());
        dto.setLearningGoal(enrollment.getLearningGoal());
        dto.setStatus(enrollment.getStatus());
        dto.setStartDate(enrollment.getStartDate() != null ? 
            enrollment.getStartDate().toString() : null);
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
    
    // ========== Search & Filter Methods ==========
    
    public List<TuteeDTO> searchTuteesByName(String name) {
        // This would require a custom query in the repository
        // For now, we'll filter in memory (not efficient for large datasets)
        return tuteeRepository.findAll().stream()
            .filter(tutee -> tutee.getUser().getFirstName().toLowerCase().contains(name.toLowerCase()) ||
                            tutee.getUser().getLastName().toLowerCase().contains(name.toLowerCase()))
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<TuteeDTO> getTuteesBySubject(Long subjectId) {
        List<TuteeSubjectEntity> enrollments = tuteeSubjectRepository.findBySubject_SubjectId(subjectId);
        return enrollments.stream()
            .map(TuteeSubjectEntity::getTutee)
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // ========== Business Logic Methods ==========
    
    @Transactional
    public void incrementHoursStudied(Long tuteeId, int additionalHours) {
        TuteeEntity tutee = tuteeRepository.findById(tuteeId)
            .orElseThrow(() -> new RuntimeException("Tutee not found"));
        
        tutee.setHoursStudied(tutee.getHoursStudied() + additionalHours);
        tuteeRepository.save(tutee);
    }
    
    public boolean isTuteeEnrolledInSubject(Long tuteeId, Long subjectId) {
        return tuteeSubjectRepository
            .findByTutee_TuteeIdAndSubject_SubjectId(tuteeId, subjectId)
            .isPresent();
    }
    
    public List<TutorDTO> getRecommendedTutors(Long tuteeId) {
    // Get tutee's subjects
    List<TuteeSubjectEntity> tuteeSubjects = tuteeSubjectRepository.findByTutee_TuteeId(tuteeId);
    
    // For each subject, find available tutors
    List<TutorEntity> recommendedTutors = new ArrayList<>();
    for (TuteeSubjectEntity tuteeSubject : tuteeSubjects) {
        // This returns List<TutorEntity>
        List<TutorEntity> tutors = tutorRepository
            .findBySubjectName(tuteeSubject.getSubject().getSubjectName());
        
        for (TutorEntity tutor : tutors) {
            // Check if tutor has available subjects
            boolean hasAvailableSubject = tutor.getSubjects().stream()
                .anyMatch(TutorSubjectEntity::isAvailable);
            
            if (hasAvailableSubject && !recommendedTutors.contains(tutor)) {
                recommendedTutors.add(tutor);
            }
        }
    }
    
        // Sort by rating (highest first)
        recommendedTutors.sort(Comparator.comparing(TutorEntity::getAverageRating).reversed());
        
        // Convert to DTOs
        return recommendedTutors.stream()
            .map(this::convertToTutorDTO)
            .limit(10)
            .collect(Collectors.toList());
    }
    
    private TutorDTO convertToTutorDTO(TutorEntity tutor) {
        // Create a simple TutorDTO (you should create this class)
        TutorDTO dto = new TutorDTO();
        dto.setTutorId(tutor.getTutorId());
        dto.setUserId(tutor.getUser().getUserId());
        dto.setAverageRating(tutor.getAverageRating());
        dto.setDateStarted(tutor.getDateStarted());
        return dto;
    }
}