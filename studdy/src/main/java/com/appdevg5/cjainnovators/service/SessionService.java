package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.notificationdto.NotificationRequestDTO;
import com.appdevg5.cjainnovators.dto.sessiondto.*;
import com.appdevg5.cjainnovators.entity.*;
import com.appdevg5.cjainnovators.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SessionService {
    
    private final SessionRepository sessionRepository;
    private final TutorRepository tutorRepository;
    private final TuteeRepository tuteeRepository;
    private final SubjectRepository subjectRepository;
    private final NotificationService notificationService;
    private final NotificationMessageService notificationMessageService;
    private final UserRepository userRepository;

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

        // Create notification for tutor about new booking
        createTutorBookingNotification(savedSession);
        
        // Send message from tutee to tutor about the booking request
        notificationMessageService.sendBookingRequestMessage(savedSession);

        // Convert to DTO and return
        return convertToDTO(savedSession);
    }

    // ========== UPDATE ==========
    public SessionDTO updateSessionStatus(Long sessionId, String status) {
        return updateSessionStatusWithReason(sessionId, status, null);
    }

    // Overloaded update method for UpdateSessionDTO
    public SessionDTO updateSession(Long sessionId, UpdateSessionDTO updateSessionDTO) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Session not found with ID: " + sessionId));

        String previousStatus = session.getStatus();
        
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

        if (updateSessionDTO.getStatus() != null && 
            !updateSessionDTO.getStatus().equals(previousStatus)) {
            session.setStatus(updateSessionDTO.getStatus());
            handleStatusChangeNotificationsAndMessages(session, previousStatus, updateSessionDTO.getStatus(), null);
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

    // ========== NOTIFICATION METHODS ==========

    /**
     * Create notification for tutor when tutee books a session
     */
    private void createTutorBookingNotification(SessionEntity session) {
        try {
            // Get the tutor's user entity
            UserEntity tutorUser = userRepository.findById(session.getTutor().getUser().getUserId())
                    .orElseThrow(() -> new NoSuchElementException("Tutor user not found"));

            String formattedDateTime = formatSessionDateTime(session);
            
            NotificationRequestDTO notification = NotificationRequestDTO.builder()
                    .userId(tutorUser.getUserId())
                    .notificationType("SESSION_BOOKING")
                    .title("New Session Booking")
                    .message(String.format(
                            "%s has booked a %s session with you on %s for %d minutes via %s. Goal: %s",
                            session.getTutee().getUser().getFirstName(),
                            session.getSubject().getSubjectName(),
                            formattedDateTime,
                            session.getDuration(),
                            session.getMedium(),
                            session.getGoal()
                    ))
                    .build();

            notificationService.createNotification(notification);
        } catch (Exception e) {
            // Log error but don't fail the session creation
            System.err.println("Failed to create tutor booking notification: " + e.getMessage());
        }
    }

    /**
     * Create notification for tutee when tutor accepts booking
     */
    private void createTuteeBookingAcceptedNotification(SessionEntity session) {
        try {
            UserEntity tuteeUser = userRepository.findById(session.getTutee().getUser().getUserId())
                    .orElseThrow(() -> new NoSuchElementException("Tutee user not found"));

            String formattedDateTime = formatSessionDateTime(session);
            
            NotificationRequestDTO notification = NotificationRequestDTO.builder()
                    .userId(tuteeUser.getUserId())
                    .notificationType("SESSION_ACCEPTED")
                    .title("Session Accepted")
                    .message(String.format(
                            "%s has accepted your %s session on %s. Get ready for your %d-minute session via %s!",
                            session.getTutor().getUser().getFirstName(),
                            session.getSubject().getSubjectName(),
                            formattedDateTime,
                            session.getDuration(),
                            session.getMedium()
                    ))
                    .build();

            notificationService.createNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to create tutee acceptance notification: " + e.getMessage());
        }
    }

    /**
     * Create notification for tutee when tutor declines booking
     */
    private void createTuteeBookingDeclinedNotification(SessionEntity session, String reason) {
        try {
            UserEntity tuteeUser = userRepository.findById(session.getTutee().getUser().getUserId())
                    .orElseThrow(() -> new NoSuchElementException("Tutee user not found"));

            String formattedDateTime = formatSessionDateTime(session);
            
            NotificationRequestDTO notification = NotificationRequestDTO.builder()
                    .userId(tuteeUser.getUserId())
                    .notificationType("SESSION_DECLINED")
                    .title("Session Declined")
                    .message(String.format(
                            "%s has declined your %s session on %s. %s",
                            session.getTutor().getUser().getFirstName(),
                            session.getSubject().getSubjectName(),
                            formattedDateTime,
                            reason != null ? "Reason: " + reason : ""
                    ))
                    .build();

            notificationService.createNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to create tutee decline notification: " + e.getMessage());
        }
    }

    /**
     * Create notification for tutee when tutor cancels confirmed booking
     */
    private void createTuteeBookingCancelledNotification(SessionEntity session, String reason) {
        try {
            UserEntity tuteeUser = userRepository.findById(session.getTutee().getUser().getUserId())
                    .orElseThrow(() -> new NoSuchElementException("Tutee user not found"));

            String formattedDateTime = formatSessionDateTime(session);
            
            NotificationRequestDTO notification = NotificationRequestDTO.builder()
                    .userId(tuteeUser.getUserId())
                    .notificationType("SESSION_CANCELLED")
                    .title("Session Cancelled")
                    .message(String.format(
                            "%s has cancelled your %s session on %s. %s",
                            session.getTutor().getUser().getFirstName(),
                            session.getSubject().getSubjectName(),
                            formattedDateTime,
                            reason != null ? "Reason: " + reason : ""
                    ))
                    .build();

            notificationService.createNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to create tutee cancellation notification: " + e.getMessage());
        }
    }

    /**
     * NEW: Create notification for tutor when tutee cancels pending booking
     */
    private void createTutorPendingBookingCancelledNotification(SessionEntity session, String reason) {
        try {
            UserEntity tutorUser = userRepository.findById(session.getTutor().getUser().getUserId())
                    .orElseThrow(() -> new NoSuchElementException("Tutor user not found"));

            String formattedDateTime = formatSessionDateTime(session);
            
            NotificationRequestDTO notification = NotificationRequestDTO.builder()
                    .userId(tutorUser.getUserId())
                    .notificationType("SESSION_CANCELLED")
                    .title("Session Cancelled by Tutee")
                    .message(String.format(
                            "%s has cancelled their pending %s session on %s. %s",
                            session.getTutee().getUser().getFirstName(),
                            session.getSubject().getSubjectName(),
                            formattedDateTime,
                            reason != null ? "Reason: " + reason : ""
                    ))
                    .build();

            notificationService.createNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to create tutor cancellation notification: " + e.getMessage());
        }
    }

    /**
     * NEW: Create notification for tutor when tutee cancels confirmed booking
     */
    private void createTutorConfirmedBookingCancelledNotification(SessionEntity session, String reason) {
        try {
            UserEntity tutorUser = userRepository.findById(session.getTutor().getUser().getUserId())
                    .orElseThrow(() -> new NoSuchElementException("Tutor user not found"));

            String formattedDateTime = formatSessionDateTime(session);
            
            NotificationRequestDTO notification = NotificationRequestDTO.builder()
                    .userId(tutorUser.getUserId())
                    .notificationType("SESSION_CANCELLED")
                    .title("Session Cancelled by Tutee")
                    .message(String.format(
                            "%s has cancelled the confirmed %s session on %s. %s",
                            session.getTutee().getUser().getFirstName(),
                            session.getSubject().getSubjectName(),
                            formattedDateTime,
                            reason != null ? "Reason: " + reason : ""
                    ))
                    .build();

            notificationService.createNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to create tutor cancellation notification: " + e.getMessage());
        }
    }

    /**
     * Handle status change notifications AND messages
     */
    private void handleStatusChangeNotificationsAndMessages(SessionEntity session, String previousStatus, String newStatus, String reason) {
        if ("Pending".equals(previousStatus) && "Confirmed".equals(newStatus)) {
            // Tutor accepted the booking
            createTuteeBookingAcceptedNotification(session);
            notificationMessageService.sendAcceptanceMessage(session);
        } 
        else if ("Pending".equals(previousStatus) && "Declined".equals(newStatus)) {
            // Tutor declined the booking
            createTuteeBookingDeclinedNotification(session, reason);
            notificationMessageService.sendDeclineMessage(session, reason);
        }
        else if ("Confirmed".equals(previousStatus) && "Cancelled".equals(newStatus)) {
            // Check who initiated the cancellation
            // This would need additional logic to track who cancelled, but for now
            // we'll assume it's the tutor when coming from Confirmed status
            createTuteeBookingCancelledNotification(session, reason);
            notificationMessageService.sendCancellationMessage(session, reason);
        }
        else if ("Pending".equals(previousStatus) && "Cancelled".equals(newStatus)) {
            // Tutee cancelled a pending booking
            createTutorPendingBookingCancelledNotification(session, reason);
            notificationMessageService.sendTuteeCancellationMessage(session, reason, false); // false = pending
        }
        else if ("Confirmed".equals(previousStatus) && "Cancelled".equals(newStatus)) {
            // Tutee cancelled a confirmed booking (this could be from tutee as well)
            // We need additional logic to determine who cancelled
            // For now, we'll handle both cases
            createTuteeBookingCancelledNotification(session, reason);
            notificationMessageService.sendCancellationMessage(session, reason);
        }
    }

    /**
     * Format session date and time for notification messages
     */
    private String formatSessionDateTime(SessionEntity session) {
        String monthName = getMonthName(session.getSessionMonth());
        String amPm = "AM".equalsIgnoreCase(session.getStartAmPm()) ? "AM" : "PM";
        
        return String.format("%s %d, %d at %d:%02d %s",
                monthName,
                session.getSessionDay(),
                session.getSessionYear(),
                session.getStartHour(),
                session.getStartMinute(),
                amPm
        );
    }

    /**
     * Get month name from month number
     */
    private String getMonthName(int month) {
        String[] monthNames = {
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        };
        
        if (month < 1 || month > 12) {
            return "Month " + month;
        }
        return monthNames[month - 1];
    }

    // ========== ADDITIONAL METHODS FOR SPECIFIC MESSAGE SCENARIOS ==========

    /**
     * Update session status with custom reason message
     */
    public SessionDTO updateSessionStatusWithReason(Long sessionId, String status, String reason) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Session not found with ID: " + sessionId));

        String previousStatus = session.getStatus();
        session.setStatus(status);
        SessionEntity updatedSession = sessionRepository.save(session);

        // Handle notifications and messages with custom reason
        handleStatusChangeNotificationsAndMessages(session, previousStatus, status, reason);

        return convertToDTO(updatedSession);
    }

    /**
     * NEW: Method specifically for tutee cancelling a session
     */
    public SessionDTO cancelSessionByTutee(Long sessionId, String reason) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Session not found with ID: " + sessionId));

        String previousStatus = session.getStatus();
        
        // Validate tutee can cancel
        if (!"Pending".equals(previousStatus) && !"Confirmed".equals(previousStatus)) {
            throw new IllegalStateException("Session cannot be cancelled in its current status: " + previousStatus);
        }

        session.setStatus("Cancelled");
        SessionEntity updatedSession = sessionRepository.save(session);

        // Create specific notifications for tutee cancellation
        if ("Pending".equals(previousStatus)) {
            // Tutee cancelled a pending booking
            createTutorPendingBookingCancelledNotification(session, reason);
            notificationMessageService.sendTuteeCancellationMessage(session, reason, false); // false = pending
        } else if ("Confirmed".equals(previousStatus)) {
            // Tutee cancelled a confirmed booking
            createTutorConfirmedBookingCancelledNotification(session, reason);
            notificationMessageService.sendTuteeCancellationMessage(session, reason, true); // true = confirmed
        }

        return convertToDTO(updatedSession);
    }

    /**
     * NEW: Method specifically for tutor cancelling a session (different from tutee cancellation)
     */
    public SessionDTO cancelSessionByTutor(Long sessionId, String reason) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Session not found with ID: " + sessionId));

        String previousStatus = session.getStatus();
        
        // Validate tutor can cancel
        if (!"Pending".equals(previousStatus) && !"Confirmed".equals(previousStatus)) {
            throw new IllegalStateException("Session cannot be cancelled in its current status: " + previousStatus);
        }

        session.setStatus("Cancelled");
        SessionEntity updatedSession = sessionRepository.save(session);

        // Create notifications for tutor cancellation
        if ("Pending".equals(previousStatus)) {
            // Tutor declined a pending booking (already handled in other methods)
            createTuteeBookingDeclinedNotification(session, reason);
            notificationMessageService.sendDeclineMessage(session, reason);
        } else if ("Confirmed".equals(previousStatus)) {
            // Tutor cancelled a confirmed booking
            createTuteeBookingCancelledNotification(session, reason);
            notificationMessageService.sendCancellationMessage(session, reason);
        }

        return convertToDTO(updatedSession);
    }

    /**
     * Send follow-up message from tutor to tutee (custom message)
     */
    public void sendCustomMessageToTutee(Long sessionId, String messageText) {
        try {
            SessionEntity session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Session not found with ID: " + sessionId));

            Long tutorUserId = session.getTutor().getUser().getUserId();
            Long tuteeUserId = session.getTutee().getUser().getUserId();
            String subjectName = session.getSubject().getSubjectName();

            // Use NotificationMessageService for custom messages too
            notificationMessageService.sendCustomMessage(tutorUserId, tuteeUserId, 
                "Regarding our " + subjectName + " session", messageText);
        } catch (Exception e) {
            System.err.println("Failed to send custom message: " + e.getMessage());
            throw new RuntimeException("Failed to send message: " + e.getMessage());
        }
    }

    // ========== REST OF THE METHODS ==========
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

    public void deleteSession(Long sessionId) {
        if (!sessionRepository.existsById(sessionId)) {
            throw new NoSuchElementException("Session not found with ID: " + sessionId);
        }
        sessionRepository.deleteById(sessionId);
    }

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

    public boolean sessionExists(Long sessionId) {
        return sessionRepository.existsById(sessionId);
    }

    public long getSessionCount() {
        return sessionRepository.count();
    }
}