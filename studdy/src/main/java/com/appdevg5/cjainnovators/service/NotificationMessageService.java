package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.messagedto.SendMessageRequest;
import com.appdevg5.cjainnovators.entity.SessionEntity;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationMessageService {
    
    @Autowired
    private final MessageService messageService;
    
    public void sendBookingRequestMessage(SessionEntity session) {
        try {
            Long tuteeUserId = session.getTutee().getUser().getUserId();
            Long tutorUserId = session.getTutor().getUser().getUserId();
            
            String formattedDateTime = formatSessionDateTime(session);
            String subjectName = session.getSubject().getSubjectName();
            
            String messageText = String.format(
                "Hi! I'd like to book a %s session with you on %s for %d minutes via %s. Goal: %s. Please let me know if this works for you!",
                subjectName,
                formattedDateTime,
                session.getDuration(),
                session.getMedium(),
                session.getGoal()
            );
            
            SendMessageRequest messageRequest = SendMessageRequest.builder()
                .receiverId(tutorUserId)
                .text(messageText)
                .subject(subjectName + " Session Request")
                .type("TEXT")
                .build();
            
            messageService.sendMessage(messageRequest, tuteeUserId);
        } catch (Exception e) {
            System.err.println("Failed to send booking request message: " + e.getMessage());
        }
    }
    
    public void sendAcceptanceMessage(SessionEntity session) {
        try {
            Long tutorUserId = session.getTutor().getUser().getUserId();
            Long tuteeUserId = session.getTutee().getUser().getUserId();
            
            String formattedDateTime = formatSessionDateTime(session);
            String subjectName = session.getSubject().getSubjectName();
            
            String messageText = String.format(
                "Great! I've accepted your %s session on %s. Looking forward to our %d-minute session via %s!",
                subjectName,
                formattedDateTime,
                session.getDuration(),
                session.getMedium()
            );
            
            SendMessageRequest messageRequest = SendMessageRequest.builder()
                .receiverId(tuteeUserId)
                .text(messageText)
                .subject("Session Accepted - " + subjectName)
                .type("TEXT")
                .build();
            
            messageService.sendMessage(messageRequest, tutorUserId);
        } catch (Exception e) {
            System.err.println("Failed to send acceptance message: " + e.getMessage());
        }
    }
    
    public void sendDeclineMessage(SessionEntity session, String reason) {
        try {
            Long tutorUserId = session.getTutor().getUser().getUserId();
            Long tuteeUserId = session.getTutee().getUser().getUserId();
            
            String formattedDateTime = formatSessionDateTime(session);
            String subjectName = session.getSubject().getSubjectName();
            
            String baseMessage = String.format(
                "I'm sorry, but I need to decline your %s session on %s.",
                subjectName,
                formattedDateTime
            );
            
            String fullMessage = reason != null && !reason.trim().isEmpty() 
                ? baseMessage + " Reason: " + reason
                : baseMessage + " Unfortunately, I'm not available at that time.";
            
            SendMessageRequest messageRequest = SendMessageRequest.builder()
                .receiverId(tuteeUserId)
                .text(fullMessage)
                .subject("Session Declined - " + subjectName)
                .type("TEXT")
                .build();
            
            messageService.sendMessage(messageRequest, tutorUserId);
        } catch (Exception e) {
            System.err.println("Failed to send decline message: " + e.getMessage());
        }
    }
    
    public void sendCancellationMessage(SessionEntity session, String reason) {
        try {
            Long tutorUserId = session.getTutor().getUser().getUserId();
            Long tuteeUserId = session.getTutee().getUser().getUserId();
            
            String formattedDateTime = formatSessionDateTime(session);
            String subjectName = session.getSubject().getSubjectName();
            
            String baseMessage = String.format(
                "I need to cancel our %s session on %s.",
                subjectName,
                formattedDateTime
            );
            
            String fullMessage = reason != null && !reason.trim().isEmpty() 
                ? baseMessage + " Reason: " + reason
                : baseMessage + " I apologize for the inconvenience.";
            
            SendMessageRequest messageRequest = SendMessageRequest.builder()
                .receiverId(tuteeUserId)
                .text(fullMessage)
                .subject("Session Cancelled - " + subjectName)
                .type("TEXT")
                .build();
            
            messageService.sendMessage(messageRequest, tutorUserId);
        } catch (Exception e) {
            System.err.println("Failed to send cancellation message: " + e.getMessage());
        }
    }

    public void sendTuteeCancellationMessage(SessionEntity session, String reason, boolean wasConfirmed) {
        try {
            Long tuteeUserId = session.getTutee().getUser().getUserId();
            Long tutorUserId = session.getTutor().getUser().getUserId();
            String subjectName = session.getSubject().getSubjectName();
            String formattedDateTime = formatSessionDateTime(session);
            
            String message;
            String subject;
            
            if (wasConfirmed) {
                subject = "Session Cancelled by Tutee - " + subjectName;
                message = String.format(
                    "I need to cancel our confirmed %s session scheduled for %s. %s", 
                    subjectName, 
                    formattedDateTime,
                    reason != null && !reason.trim().isEmpty() ? "Reason: " + reason : "I apologize for the inconvenience."
                );
            } else {
                subject = "Pending Session Cancelled - " + subjectName;
                message = String.format(
                    "I need to cancel my pending %s session request for %s. %s", 
                    subjectName,
                    formattedDateTime,
                    reason != null && !reason.trim().isEmpty() ? "Reason: " + reason : ""
                );
            }
            
            SendMessageRequest messageRequest = SendMessageRequest.builder()
                .receiverId(tutorUserId)
                .text(message)
                .subject(subject)
                .type("TEXT")
                .build();
            
            messageService.sendMessage(messageRequest, tuteeUserId);
        } catch (Exception e) {
            System.err.println("Failed to send tutee cancellation message: " + e.getMessage());
        }
    }

    public void sendCustomMessage(Long senderId, Long receiverId, String subject, String messageText) {
        SendMessageRequest messageRequest = SendMessageRequest.builder()
            .receiverId(receiverId)
            .text(messageText)
            .subject(subject)
            .type("TEXT")
            .build();
        
        messageService.sendMessage(messageRequest, senderId);
    }
    
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
}