package com.appdevg5.cjainnovators.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "conversation")
public class ConversationEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conversationId;
    
    @Column(nullable = false)
    private Long user1Id;
    
    @Column(nullable = false)
    private String user1Name;
    
    @Column(nullable = false)
    private String user1Type;
    
    @Column(nullable = false)
    private Long user2Id;
    
    @Column(nullable = false)
    private String user2Name;
    
    @Column(nullable = false)
    private String user2Type;
    
    @Column
    private String lastMessage;
    
    @Column
    private Long lastMessageSenderId;
    
    @Column
    private boolean lastMessageRead;
    
    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private String subject;
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("timestamp DESC")
    private List<MessageEntity> messages;
    
    @Transient
    private int unreadCount;
    
    @Transient
    private boolean online;
}
