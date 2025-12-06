package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.sessiondto.*;
import com.appdevg5.cjainnovators.entity.*;
import com.appdevg5.cjainnovators.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class SessionService {

    @Autowired
    private final SessionRepository sessionRepository;
    
    @Autowired
    private final TutorRepository tutorRepository;
    
    @Autowired
    private final TuteeRepository tuteeRepository;
    
    @Autowired
    private final SubjectRepository subjectRepository;

    public SessionService(
            SessionRepository sessionRepository,
            TutorRepository tutorRepository,
            TuteeRepository tuteeRepository,
            SubjectRepository subjectRepository) {
        this.sessionRepository = sessionRepository;
        this.tutorRepository = tutorRepository;
        this.tuteeRepository = tuteeRepository;
        this.subjectRepository = subjectRepository;
    }

    // ========== CREATE ==========
    public SessionDTO createSession(CreateSessionDTO createSessionDTO) {
        // Validate and fetch related entities
        TutorEntity tutor = tutorRepository.findById(createSessionDTO.getTutorId())
                .orElseThrow(() -> new NoSuchElementException(
                        "Tutor not found with ID: " + createSessionDTO.getTutorId()));

        TuteeEntity tutee = tuteeRepository.findById(createSessionDTO.getTuteeId())
                .orElseThrow(() -> new NoSuchElementException(
                        "Tutee not found with ID: " + createSessionDTO.getTuteeId()));

        SubjectEntity subject = subjectRepository.findById(createSessionDTO.getSubjectId())
                .orElseThrow(() -> new NoSuchElementException(
                        "Subject not found with ID: " + createSessionDTO.getSubjectId()));

        // Calculate end time
        LocalTime endTime = createSessionDTO.getStartTime()
                .plusMinutes(createSessionDTO.getDuration());

        // Create session entity
        SessionEntity session = SessionEntity.builder()
                .tutor(tutor)
                .tutee(tutee)
                .subject(subject)
                .sessionDate(createSessionDTO.getSessionDate())
                .startTime(createSessionDTO.getStartTime())
                .endTime(endTime)
                .duration(createSessionDTO.getDuration())
                .status(createSessionDTO.getStatus() != null ? 
                        createSessionDTO.getStatus() : "SCHEDULED")
                .rating(null)
                .feedback(null)
                .build();

        // Save to database
        SessionEntity savedSession = sessionRepository.save(session);

        // Convert to DTO and return
        return convertToDTO(savedSession);
    }

    // ========== READ ==========
    public SessionDTO getSessionById(Long sessionId) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Session not found with ID: " + sessionId));
        return convertToDTO(session);
    }

    public List<SessionDTO> getAllSessions() {
        List<SessionEntity> sessions = sessionRepository.findAll();
        return sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionDTO> getSessionsByTutorId(Long tutorId) {
        List<SessionEntity> sessions = sessionRepository.findByTutor_TutorId(tutorId);
        return sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionDTO> getSessionsByTuteeId(Long tuteeId) {
        List<SessionEntity> sessions = sessionRepository.findByTutee_TuteeId(tuteeId);
        return sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionDTO> getSessionsBySubjectId(Long subjectId) {
        List<SessionEntity> sessions = sessionRepository.findBySubject_SubjectId(subjectId);
        return sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionDTO> getSessionsByStatus(String status) {
        List<SessionEntity> sessions = sessionRepository.findByStatus(status);
        return sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ========== UPDATE ==========
    public SessionDTO updateSession(Long sessionId, UpdateSessionDTO updateSessionDTO) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Session not found with ID: " + sessionId));

        // Update fields if provided
        if (updateSessionDTO.getSessionDate() != null) {
            session.setSessionDate(updateSessionDTO.getSessionDate());
        }

        if (updateSessionDTO.getStartTime() != null) {
            session.setStartTime(updateSessionDTO.getStartTime());
            
            // Recalculate end time if duration is provided
            if (updateSessionDTO.getDuration() != null) {
                session.setEndTime(updateSessionDTO.getStartTime()
                        .plusMinutes(updateSessionDTO.getDuration()));
                session.setDuration(updateSessionDTO.getDuration());
            }
        } else if (updateSessionDTO.getDuration() != null) {
            // Update duration and recalculate end time
            session.setDuration(updateSessionDTO.getDuration());
            session.setEndTime(session.getStartTime()
                    .plusMinutes(updateSessionDTO.getDuration()));
        }

        if (updateSessionDTO.getEndTime() != null) {
            session.setEndTime(updateSessionDTO.getEndTime());
        }

        if (updateSessionDTO.getStatus() != null) {
            session.setStatus(updateSessionDTO.getStatus());
        }

        if (updateSessionDTO.getRating() != null) {
            // Validate rating range (1-5)
            if (updateSessionDTO.getRating() < 1.0f || updateSessionDTO.getRating() > 5.0f) {
                throw new IllegalArgumentException("Rating must be between 1.0 and 5.0");
            }
            session.setRating(updateSessionDTO.getRating());
        }

        if (updateSessionDTO.getFeedback() != null) {
            session.setFeedback(updateSessionDTO.getFeedback());
        }

        SessionEntity updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // Update session status only
    public SessionDTO updateSessionStatus(Long sessionId, String status) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Session not found with ID: " + sessionId));

        session.setStatus(status);
        SessionEntity updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // Add rating and feedback to session
    public SessionDTO addSessionRating(Long sessionId, Float rating, String feedback) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Session not found with ID: " + sessionId));

        // Validate rating
        if (rating < 1.0f || rating > 5.0f) {
            throw new IllegalArgumentException("Rating must be between 1.0 and 5.0");
        }

        // Only allow rating if session is completed
        if (!"COMPLETED".equalsIgnoreCase(session.getStatus())) {
            throw new IllegalStateException("Cannot rate a session that is not completed");
        }

        session.setRating(rating);
        session.setFeedback(feedback);
        SessionEntity updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // ========== DELETE ==========
    public void deleteSession(Long sessionId) {
        if (!sessionRepository.existsById(sessionId)) {
            throw new NoSuchElementException("Session not found with ID: " + sessionId);
        }
        sessionRepository.deleteById(sessionId);
    }

    // ========== HELPER METHODS ==========
    private SessionDTO convertToDTO(SessionEntity session) {
        return SessionDTO.builder()
                .sessionId(session.getSessionId())
                .tutorId(session.getTutor() != null ? session.getTutor().getTutorId() : null)
                .tuteeId(session.getTutee() != null ? session.getTutee().getTuteeId() : null)
                .subjectId(session.getSubject() != null ? session.getSubject().getSubjectId() : null)
                .sessionDate(session.getSessionDate())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .duration(session.getDuration())
                .status(session.getStatus())
                .rating(session.getRating())
                .feedback(session.getFeedback())
                .build();
    }

    // Check if session exists
    public boolean sessionExists(Long sessionId) {
        return sessionRepository.existsById(sessionId);
    }

    // Get session count
    public long getSessionCount() {
        return sessionRepository.count();
    }
}