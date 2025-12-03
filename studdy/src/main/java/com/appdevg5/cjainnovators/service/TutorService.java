package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.sessiondto.SessionSummaryDTO;
import com.appdevg5.cjainnovators.dto.subjectdto.SubjectStatsDTO;
import com.appdevg5.cjainnovators.dto.tutordto.*;
import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectDTO;
import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectRequestDTO;
import com.appdevg5.cjainnovators.dto.userdto.UserDTO;
import com.appdevg5.cjainnovators.entity.*;
import com.appdevg5.cjainnovators.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TutorService {
    
    @Autowired
    private TutorRepository tutorRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private TutorSubjectRepository tutorSubjectRepository;
    
    @Autowired
    private SessionRepository sessionRepository;
    
    // Convert Entity to DTO methods
    private TutorDTO convertToTutorDTO(TutorEntity tutor) {
        TutorDTO dto = new TutorDTO();
        dto.setTutorId(tutor.getTutorId());
        dto.setDateStarted(tutor.getDateStarted());
        dto.setAverageRating(tutor.getAverageRating());
        
        if (tutor.getUser() != null) {
            dto.setUserId(tutor.getUser().getUserId());
            dto.setUserEmail(tutor.getUser().getEmail());
            dto.setFirstName(tutor.getUser().getFirstName());
            dto.setLastName(tutor.getUser().getLastName());
            dto.setPhoneNumber(tutor.getUser().getPhoneNumber());
            dto.setActive(tutor.getUser().isActive());
        }
        
        // Convert subjects
        if (tutor.getSubjects() != null) {
            List<TutorSubjectDTO> subjectDTOs = tutor.getSubjects().stream()
                .map(this::convertToTutorSubjectDTO)
                .collect(Collectors.toList());
            dto.setSubjects(subjectDTOs);
        }
        
        // Get total sessions
        List<SessionEntity> sessions = sessionRepository.findByTutor_TutorId(tutor.getTutorId());
        dto.setTotalSessions(sessions.size());
        
        return dto;
    }
    
    private TutorSubjectDTO convertToTutorSubjectDTO(TutorSubjectEntity tutorSubject) {
        TutorSubjectDTO dto = new TutorSubjectDTO();
        dto.setTutorSubjectId(tutorSubject.getTutorSubjectId());
        dto.setProficiencyLevel(tutorSubject.getProficiencyLevel());
        dto.setAvailable(tutorSubject.isAvailable());
        
        if (tutorSubject.getSubject() != null) {
            dto.setSubjectId(tutorSubject.getSubject().getSubjectId());
            dto.setSubjectName(tutorSubject.getSubject().getSubjectName());
            dto.setSubjectDesc(tutorSubject.getSubject().getSubjectDesc());
        }
        
        return dto;
    }
    
    // Create new tutor
    public TutorDTO createTutor(CreateTutorDTO createTutorDTO) {
        // Check if user exists
        UserEntity user = userRepository.findById(createTutorDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + createTutorDTO.getUserId()));
        
        // Check if user is already a tutor
        if (tutorRepository.findByUser_UserId(createTutorDTO.getUserId()).isPresent()) {
            throw new RuntimeException("User is already registered as a tutor");
        }
        
        // Create tutor entity
        TutorEntity tutor = TutorEntity.builder()
            .user(user)
            .dateStarted(createTutorDTO.getDateStarted() != null ? 
                        createTutorDTO.getDateStarted() : LocalDate.now())
            .averageRating(0.0f)
            .build();
        
        TutorEntity savedTutor = tutorRepository.save(tutor);
        
        // Add subjects if provided
        if (createTutorDTO.getSubjects() != null && !createTutorDTO.getSubjects().isEmpty()) {
            for (TutorSubjectRequestDTO subjectRequest : createTutorDTO.getSubjects()) {
                SubjectEntity subject = subjectRepository.findById(subjectRequest.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectRequest.getSubjectId()));
                
                TutorSubjectEntity tutorSubject = TutorSubjectEntity.builder()
                    .tutor(savedTutor)
                    .subject(subject)
                    .proficiencyLevel(subjectRequest.getProficiencyLevel())
                    .isAvailable(subjectRequest.isAvailable())
                    .build();
                
                tutorSubjectRepository.save(tutorSubject);
            }
        }
        
        return convertToTutorDTO(savedTutor);
    }
    
    // Get tutor by ID
    public TutorDTO getTutorById(Long tutorId) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        return convertToTutorDTO(tutor);
    }
    
    // Get tutor by user ID
    public TutorDTO getTutorByUserId(Long userId) {
        TutorEntity tutor = tutorRepository.findByUser_UserId(userId)
            .orElseThrow(() -> new RuntimeException("Tutor not found for user ID: " + userId));
        
        return convertToTutorDTO(tutor);
    }
    
    // Get all tutors
    public List<TutorDTO> getAllTutors() {
        return tutorRepository.findAll().stream()
            .map(this::convertToTutorDTO)
            .collect(Collectors.toList());
    }
    
    // Update tutor
    public TutorDTO updateTutor(Long tutorId, UpdateTutorDTO updateTutorDTO) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        // Update basic info
        if (updateTutorDTO.getDateStarted() != null) {
            tutor.setDateStarted(updateTutorDTO.getDateStarted());
        }
        if (updateTutorDTO.getAverageRating() != null) {
            tutor.setAverageRating(updateTutorDTO.getAverageRating());
        }
        
        // Update subjects if provided
        if (updateTutorDTO.getSubjects() != null) {
            // Remove existing subjects
            tutorSubjectRepository.deleteByTutor_TutorId(tutorId);
            
            // Add new subjects
            for (TutorSubjectRequestDTO subjectRequest : updateTutorDTO.getSubjects()) {
                SubjectEntity subject = subjectRepository.findById(subjectRequest.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectRequest.getSubjectId()));
                
                TutorSubjectEntity tutorSubject = TutorSubjectEntity.builder()
                    .tutor(tutor)
                    .subject(subject)
                    .proficiencyLevel(subjectRequest.getProficiencyLevel())
                    .isAvailable(subjectRequest.isAvailable())
                    .build();
                
                tutorSubjectRepository.save(tutorSubject);
            }
        }
        
        TutorEntity updatedTutor = tutorRepository.save(tutor);
        return convertToTutorDTO(updatedTutor);
    }
    
    // Delete tutor (soft delete by deactivating user)
    public String deleteTutor(Long tutorId) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        // Deactivate the associated user
        UserEntity user = tutor.getUser();
        user.setActive(false);
        userRepository.save(user);
        
        return "Tutor with ID " + tutorId + " has been deactivated";
    }
    
    // Search tutors with filters
    public List<TutorDTO> searchTutors(TutorSearchDTO searchDTO) {
        List<TutorEntity> tutors;
        
        if (searchDTO.getSubject() != null) {
            // Search by subject name
            tutors = tutorRepository.findBySubjectName(searchDTO.getSubject());
        } else if (searchDTO.getMinRating() != null) {
            // Search by minimum rating
            tutors = tutorRepository.findByMinRating(searchDTO.getMinRating());
        } else {
            // Get all active tutors
            tutors = tutorRepository.findAll().stream()
                .filter(t -> t.getUser() != null && t.getUser().isActive())
                .collect(Collectors.toList());
        }
        
        // Apply additional filters
        List<TutorEntity> filteredTutors = tutors.stream()
            .filter(tutor -> {
                if (searchDTO.getAvailableOnly() != null && searchDTO.getAvailableOnly()) {
                    // Check if tutor has available subjects
                    return tutor.getSubjects().stream()
                        .anyMatch(TutorSubjectEntity::isAvailable);
                }
                return true;
            })
            .filter(tutor -> {
                if (searchDTO.getMinProficiency() != null) {
                    // Check if tutor has minimum proficiency in any subject
                    return tutor.getSubjects().stream()
                        .anyMatch(ts -> ts.getProficiencyLevel() >= searchDTO.getMinProficiency());
                }
                return true;
            })
            .collect(Collectors.toList());
        
        // Sort if requested
        if (searchDTO.getSortBy() != null) {
            Comparator<TutorEntity> comparator;
            
            switch (searchDTO.getSortBy().toLowerCase()) {
                case "rating":
                    comparator = Comparator.comparing(TutorEntity::getAverageRating, 
                        Comparator.nullsLast(Comparator.reverseOrder()));
                    break;
                case "experience":
                    comparator = Comparator.comparing(TutorEntity::getDateStarted,
                        Comparator.nullsLast(Comparator.naturalOrder()));
                    break;
                case "sessions":
                    comparator = Comparator.comparing(t -> 
                        sessionRepository.findByTutor_TutorId(t.getTutorId()).size(),
                        Comparator.reverseOrder());
                    break;
                default:
                    comparator = Comparator.comparing(TutorEntity::getTutorId);
            }
            
            if ("desc".equalsIgnoreCase(searchDTO.getSortOrder())) {
                comparator = comparator.reversed();
            }
            
            filteredTutors.sort(comparator);
        }
        
        return filteredTutors.stream()
            .map(this::convertToTutorDTO)
            .collect(Collectors.toList());
    }
    
    // Get tutor profile with detailed information
    public TutorProfileDTO getTutorProfile(Long tutorId) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        TutorProfileDTO profile = new TutorProfileDTO();
        profile.setTutorInfo(convertToTutorDTO(tutor));
        
        // Get user info
        if (tutor.getUser() != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setUserId(tutor.getUser().getUserId());
            userDTO.setFirstName(tutor.getUser().getFirstName());
            userDTO.setLastName(tutor.getUser().getLastName());
            userDTO.setEmail(tutor.getUser().getEmail());
            userDTO.setPhoneNumber(tutor.getUser().getPhoneNumber());
            userDTO.setBio(tutor.getUser().getBio());
            userDTO.setSchool(tutor.getUser().getSchool());
            userDTO.setMajor(tutor.getUser().getMajor());
            profile.setUserInfo(userDTO);
        }
        
        // Get sessions
        List<SessionEntity> allSessions = sessionRepository.findByTutor_TutorId(tutorId);
        
        // Get upcoming sessions (scheduled)
        List<SessionSummaryDTO> upcomingSessions = allSessions.stream()
            .filter(s -> "SCHEDULED".equals(s.getStatus()))
            .filter(s -> s.getSessionDate() != null && 
                        (s.getSessionDate().isAfter(LocalDate.now()) || 
                         s.getSessionDate().isEqual(LocalDate.now())))
            .sorted(Comparator.comparing(SessionEntity::getSessionDate)
                    .thenComparing(SessionEntity::getStartTime))
            .map(this::convertToSessionSummaryDTO)
            .limit(5) // Limit to 5 upcoming sessions
            .collect(Collectors.toList());
        
        // Get recent sessions (completed)
        List<SessionSummaryDTO> recentSessions = allSessions.stream()
            .filter(s -> "COMPLETED".equals(s.getStatus()))
            .sorted(Comparator.comparing(SessionEntity::getSessionDate)
                    .thenComparing(SessionEntity::getStartTime)
                    .reversed())
            .map(this::convertToSessionSummaryDTO)
            .limit(5) // Limit to 5 recent sessions
            .collect(Collectors.toList());
        
        profile.setUpcomingSessions(upcomingSessions);
        profile.setRecentSessions(recentSessions);
        
        // Calculate average session rating
        Double averageRating = allSessions.stream()
            .filter(s -> s.getRating() != 0.0f)
            .mapToDouble(SessionEntity::getRating)
            .average()
            .orElse(0.0);
        profile.setAverageSessionRating(averageRating);
        
        // Calculate total hours tutored
        Integer totalHours = allSessions.stream()
            .filter(s -> "COMPLETED".equals(s.getStatus()))
            .mapToInt(SessionEntity::getDuration)
            .sum() / 60; // Convert minutes to hours
        profile.setTotalHoursTutored(totalHours);
        
        // Calculate subject statistics
        Map<String, SubjectStatsDTO> subjectStatsMap = new HashMap<>();
        
        for (SessionEntity session : allSessions) {
            if (session.getSubject() != null) {
                String subjectName = session.getSubject().getSubjectName();
                SubjectStatsDTO stats = subjectStatsMap.getOrDefault(subjectName, 
                    new SubjectStatsDTO());
                stats.setSubjectName(subjectName);
                stats.setSessionsCount(stats.getSessionsCount() != null ? 
                    stats.getSessionsCount() + 1 : 1);
                
                if (session.getRating() != 0.0f) {
                    if (stats.getAverageRating() == null) {
                        stats.setAverageRating((double) session.getRating());
                    } else {
                        // Recalculate average
                        double currentTotal = stats.getAverageRating() * (stats.getSessionsCount() - 1);
                        stats.setAverageRating((currentTotal + session.getRating()) / stats.getSessionsCount());
                    }
                }
                
                subjectStatsMap.put(subjectName, stats);
            }
        }
        
        profile.setSubjectStats(new ArrayList<>(subjectStatsMap.values()));
        
        return profile;
    }
    
    private SessionSummaryDTO convertToSessionSummaryDTO(SessionEntity session) {
        SessionSummaryDTO dto = new SessionSummaryDTO();
        dto.setSessionId(session.getSessionId());
        dto.setSubjectName(session.getSubject() != null ? 
            session.getSubject().getSubjectName() : null);
        dto.setSessionDate(session.getSessionDate() != null ? 
            session.getSessionDate().toString() : null);
        dto.setStatus(session.getStatus());
        dto.setRating(session.getRating());
        
        if (session.getTutee() != null && session.getTutee().getUser() != null) {
            String tuteeName = session.getTutee().getUser().getFirstName() + " " + 
                              session.getTutee().getUser().getLastName();
            dto.setTuteeName(tuteeName);
        }
        
        return dto;
    }
    
    // Add subject to tutor
    public TutorSubjectDTO addSubjectToTutor(Long tutorId, TutorSubjectRequestDTO subjectRequest) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        SubjectEntity subject = subjectRepository.findById(subjectRequest.getSubjectId())
            .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectRequest.getSubjectId()));
        
        // Check if subject already exists for tutor
        Optional<TutorSubjectEntity> existing = tutorSubjectRepository.findByTutor_TutorIdAndSubject_SubjectId(
            tutorId, subjectRequest.getSubjectId());
        
        if (existing.isPresent()) {
            throw new RuntimeException("Tutor already has this subject");
        }
        
        TutorSubjectEntity tutorSubject = TutorSubjectEntity.builder()
            .tutor(tutor)
            .subject(subject)
            .proficiencyLevel(subjectRequest.getProficiencyLevel())
            .isAvailable(subjectRequest.isAvailable())
            .build();
        
        TutorSubjectEntity savedSubject = tutorSubjectRepository.save(tutorSubject);
        return convertToTutorSubjectDTO(savedSubject);
    }
    
    // Remove subject from tutor
    public void removeSubjectFromTutor(Long tutorId, Long subjectId) {
        TutorSubjectEntity tutorSubject = tutorSubjectRepository
            .findByTutor_TutorIdAndSubject_SubjectId(tutorId, subjectId)
            .orElseThrow(() -> new RuntimeException("Subject not found for tutor"));
        
        tutorSubjectRepository.delete(tutorSubject);
    }
    
    // Update tutor rating based on session feedback
    public void updateTutorRating(Long tutorId) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        List<SessionEntity> sessions = sessionRepository.findByTutor_TutorId(tutorId);
        
        Double averageRating = sessions.stream()
            .filter(s -> s.getRating() != 0.0f)
            .mapToDouble(SessionEntity::getRating)
            .average()
            .orElse(0.0);
        
        tutor.setAverageRating(averageRating.floatValue());
        tutorRepository.save(tutor);
    }
    
    // Get available tutors for a specific subject
    public List<TutorDTO> getAvailableTutorsForSubject(String subjectName) {
        List<TutorEntity> tutors = tutorRepository.findBySubjectName(subjectName);
        
        return tutors.stream()
            .filter(tutor -> tutor.getSubjects().stream()
                .anyMatch(ts -> ts.getSubject().getSubjectName().equals(subjectName) && ts.isAvailable()))
            .filter(tutor -> tutor.getUser() != null && tutor.getUser().isActive())
            .map(this::convertToTutorDTO)
            .collect(Collectors.toList());
    }
}