package com.cjainnovators.studdy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cjainnovators.studdy.entity.SessionEntity;
import com.cjainnovators.studdy.repository.SessionRepository;
import com.cjainnovators.studdy.repository.UserRepository;
import com.cjainnovators.studdy.repository.SubjectRepository;
import java.util.List;
import java.util.NoSuchElementException;
import java.time.LocalDate;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public SessionEntity createSession(SessionEntity session) {
        // Validate that tutor, tutee, and subject exist
        if (!userRepository.existsById(session.getTutor().getUserId())) {
            throw new NoSuchElementException("Tutor with ID " + session.getTutor().getUserId() + " not found");
        }
        if (!userRepository.existsById(session.getTutee().getUserId())) {
            throw new NoSuchElementException("Tutee with ID " + session.getTutee().getUserId() + " not found");
        }
        if (!subjectRepository.existsById(session.getSubject().getSubjectId())) {
            throw new NoSuchElementException("Subject with ID " + session.getSubject().getSubjectId() + " not found");
        }

        return sessionRepository.save(session);
    }

    public List<SessionEntity> getAllSessions() {
        return sessionRepository.findAll();
    }

    public SessionEntity getSessionById(int sessionId) {
        return sessionRepository.findById(sessionId)
            .orElseThrow(() -> new NoSuchElementException("Session with ID " + sessionId + " not found"));
    }

    public SessionEntity updateSession(int sessionId, SessionEntity session) {
        SessionEntity existingSession = getSessionById(sessionId);
        existingSession.setSessionDate(session.getSessionDate());
        existingSession.setStartTime(session.getStartTime());
        existingSession.setEndTime(session.getEndTime());
        existingSession.setStatus(session.getStatus());
        existingSession.setRating(session.getRating());
        existingSession.setFeedback(session.getFeedback());
        return sessionRepository.save(existingSession);
    }

    public String deleteSession(int sessionId) {
        if (sessionRepository.existsById(sessionId)) {
            sessionRepository.deleteById(sessionId);
            return "Session with ID " + sessionId + " deleted successfully";
        }
        return "Session with ID " + sessionId + " not found";
    }

    public List<SessionEntity> getSessionsByTutor(int tutorId) {
        return sessionRepository.findByTutorUserId(tutorId);
    }

    public List<SessionEntity> getSessionsByTutee(int tuteeId) {
        return sessionRepository.findByTuteeUserId(tuteeId);
    }

    public List<SessionEntity> getSessionsByStatus(String status) {
        return sessionRepository.findByStatus(status);
    }

    public List<SessionEntity> getSessionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return sessionRepository.findBySessionDateBetween(startDate, endDate);
    }

    public SessionEntity updateSessionStatus(int sessionId, String status) {
        SessionEntity session = getSessionById(sessionId);
        session.setStatus(status);
        return sessionRepository.save(session);
    }

    public SessionEntity addSessionRating(int sessionId, int rating, String feedback) {
        SessionEntity session = getSessionById(sessionId);
        session.setRating(rating);
        session.setFeedback(feedback);
        session.setStatus("COMPLETED");
        return sessionRepository.save(session);
    }
}