package com.appdevg5.cjainnovators.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "message")
public class MessageEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;
    
    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private ConversationEntity conversation;
    
    @Column(nullable = false)
    private Long senderId;
    
    @Column(nullable = false)
    private String senderName;
    
    @Column(nullable = false)
    private String senderType;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;
    
    @Column(nullable = false)
    private boolean isRead;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
    
    @Column
    @Enumerated(EnumType.STRING)
    private MessageType type;
    
    public enum MessageType {
        TEXT, IMAGE, FILE, SYSTEM
    }
    
    public enum UserType {
        TUTOR, TUTEE, ADMIN
    }
}