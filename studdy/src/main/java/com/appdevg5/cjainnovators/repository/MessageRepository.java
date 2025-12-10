package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.MessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    
    @Query("SELECT m FROM MessageEntity m WHERE m.conversation.conversationId = :conversationId ORDER BY m.timestamp ASC")
    List<MessageEntity> findByConversationIdOrderByTimestampAsc(@Param("conversationId") Long conversationId);
    
    @Query("SELECT m FROM MessageEntity m WHERE m.conversation.conversationId = :conversationId ORDER BY m.timestamp DESC")
    Page<MessageEntity> findByConversationIdOrderByTimestampDesc(@Param("conversationId") Long conversationId, Pageable pageable);
    
    @Query("SELECT m FROM MessageEntity m WHERE m.conversation.conversationId = :conversationId AND m.senderId != :userId AND m.isRead = false")
    List<MessageEntity> findUnreadMessages(@Param("conversationId") Long conversationId, 
                                           @Param("userId") Long userId);
    
    @Query("SELECT COUNT(m) FROM MessageEntity m WHERE m.conversation.conversationId = :conversationId AND m.senderId != :userId AND m.isRead = false")
    Long countUnreadMessages(@Param("conversationId") Long conversationId, 
                             @Param("userId") Long userId);
    
    List<MessageEntity> findByConversationConversationIdAndSenderIdNotAndIsReadFalse(Long conversationId, Long userId);
}
