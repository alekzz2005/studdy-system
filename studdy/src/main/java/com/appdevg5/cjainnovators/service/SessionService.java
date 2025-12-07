package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.sessiondto.*;
import com.appdevg5.cjainnovators.entity.*;
import com.appdevg5.cjainnovators.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // Create session entity
        SessionEntity session = SessionEntity.builder()
                .tutor(tutor)
                .tutee(tutee)
                .subject(subject)
                .goal(createSessionDTO.getGoal())
                .medium(createSessionDTO.getMedium())
                .duration(createSessionDTO.getDuration())
                .sessionMonth(createSessionDTO.getSessionMonth())
                .sessionDay(createSessionDTO.getSessionDay())
                .sessionYear(createSessionDTO.getSessionYear())
                .startHour(createSessionDTO.getStartHour())
                .startMinute(createSessionDTO.getStartMinute())
                .startAmPm(createSessionDTO.getStartAmPm())
                .status(createSessionDTO.getStatus() != null ? 
                        createSessionDTO.getStatus() : "Pending")
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

    public List<SessionDTO> getSessionsByDate(int year, int month, int day) {
        List<SessionEntity> sessions = sessionRepository.findBySessionYearAndSessionMonthAndSessionDay(year, month, day);
        return sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionDTO> getSessionsByMonth(int year, int month) {
        List<SessionEntity> sessions = sessionRepository.findBySessionYearAndSessionMonth(year, month);
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
        if (updateSessionDTO.getGoal() != null) {
            session.setGoal(updateSessionDTO.getGoal());
        }

        if (updateSessionDTO.getMedium() != null) {
            session.setMedium(updateSessionDTO.getMedium());
        }

        if (updateSessionDTO.getDuration() != null) {
            session.setDuration(updateSessionDTO.getDuration());
        }

        if (updateSessionDTO.getSessionMonth() != 0) {
            session.setSessionMonth(updateSessionDTO.getSessionMonth());
        }

        if (updateSessionDTO.getSessionDay() != 0) {
            session.setSessionDay(updateSessionDTO.getSessionDay());
        }

        if (updateSessionDTO.getSessionYear() != 0) {
            session.setSessionYear(updateSessionDTO.getSessionYear());
        }

        if (updateSessionDTO.getStartHour() != 0) {
            session.setStartHour(updateSessionDTO.getStartHour());
        }

        if (updateSessionDTO.getStartMinute() != 0) {
            session.setStartMinute(updateSessionDTO.getStartMinute());
        }

        if (updateSessionDTO.getStartAmPm() != null) {
            session.setStartAmPm(updateSessionDTO.getStartAmPm());
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
        if (!"Completed".equalsIgnoreCase(session.getStatus())) {
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
                .goal(session.getGoal())
                .medium(session.getMedium())
                .duration(session.getDuration())
                .sessionMonth(session.getSessionMonth())
                .sessionDay(session.getSessionDay())
                .sessionYear(session.getSessionYear())
                .startHour(session.getStartHour())
                .startMinute(session.getStartMinute())
                .startAmPm(session.getStartAmPm())
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