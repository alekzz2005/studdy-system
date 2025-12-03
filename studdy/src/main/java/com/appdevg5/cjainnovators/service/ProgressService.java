package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.progressdto.*;
import com.appdevg5.cjainnovators.entity.ProgressEntity;
import com.appdevg5.cjainnovators.entity.SessionEntity;
import com.appdevg5.cjainnovators.entity.TuteeSubjectEntity;
import com.appdevg5.cjainnovators.repository.ProgressRepository;
import com.appdevg5.cjainnovators.repository.SessionRepository;
import com.appdevg5.cjainnovators.repository.TuteeSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ProgressService {
    
    private final ProgressRepository progressRepository;
    private final SessionRepository sessionRepository;
    private final TuteeSubjectRepository tuteeSubjectRepository;
    
    @Autowired
    public ProgressService(
            ProgressRepository progressRepository,
            SessionRepository sessionRepository,
            TuteeSubjectRepository tuteeSubjectRepository) {
        this.progressRepository = progressRepository;
        this.sessionRepository = sessionRepository;
        this.tuteeSubjectRepository = tuteeSubjectRepository;
    }
    
    // ========== CREATE ==========
    public ProgressDTO createProgress(CreateProgressDTO createProgressDTO) {
        // Validate session exists
        SessionEntity session = sessionRepository.findById(createProgressDTO.getSessionId())
            .orElseThrow(() -> new NoSuchElementException(
                "Session not found with ID: " + createProgressDTO.getSessionId()
            ));
        
        // Validate tutee subject exists
        TuteeSubjectEntity tuteeSubject = tuteeSubjectRepository.findById(createProgressDTO.getTuteeSubjectId())
            .orElseThrow(() -> new NoSuchElementException(
                "TuteeSubject not found with ID: " + createProgressDTO.getTuteeSubjectId()
            ));
        
        // Validate session and tutee subject belong to same tutee
        if (!session.getTutee().getTuteeId().equals(tuteeSubject.getTutee().getTuteeId())) {
            throw new IllegalArgumentException(
                "Session and TuteeSubject do not belong to the same tutee"
            );
        }
        
        // Check if progress already exists for this session
        progressRepository.findBySession_SessionId(createProgressDTO.getSessionId())
            .ifPresent(progress -> {
                throw new IllegalArgumentException(
                    "Progress already exists for session ID: " + createProgressDTO.getSessionId()
                );
            });
        
        // Convert topics list to JSON string
        String topicsCoveredJson = convertTopicsToJson(createProgressDTO.getTopicsCovered());
        
        // Create new progress entity
        ProgressEntity progress = ProgressEntity.builder()
            .session(session)
            .tuteeSubject(tuteeSubject)
            .topicsCovered(topicsCoveredJson)
            .build();
        
        // Save to database
        ProgressEntity savedProgress = progressRepository.save(progress);
        
        // Convert to DTO and return
        return convertToDTO(savedProgress);
    }
    
    // ========== READ ==========
    public ProgressDTO getProgressById(Long progressId) {
        ProgressEntity progress = progressRepository.findById(progressId)
            .orElseThrow(() -> new NoSuchElementException(
                "Progress not found with ID: " + progressId
            ));
        
        return convertToDTO(progress);
    }
    
    public List<ProgressDTO> getAllProgress() {
        List<ProgressEntity> progressList = progressRepository.findAll();
        
        return progressList.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ProgressDTO> getProgressBySessionId(Long sessionId) {
        List<ProgressEntity> progressList = progressRepository.findBySession_SessionId(sessionId)
            .map(List::of)
            .orElse(List.of());
        
        return progressList.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ProgressDTO> getProgressByTuteeSubjectId(Long tuteeSubjectId) {
        List<ProgressEntity> progressList = progressRepository.findByTuteeSubject_TuteeSubjectId(tuteeSubjectId);
        
        return progressList.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ProgressDTO> getProgressByTuteeId(Long tuteeId) {
        List<ProgressEntity> progressList = progressRepository.findByTuteeId(tuteeId);
        
        return progressList.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ProgressDTO> getProgressBySubjectId(Long subjectId) {
        List<ProgressEntity> progressList = progressRepository.findBySubjectId(subjectId);
        
        return progressList.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // ========== UPDATE ==========
    public ProgressDTO updateProgress(Long progressId, UpdateProgressDTO updateProgressDTO) {
        ProgressEntity progress = progressRepository.findById(progressId)
            .orElseThrow(() -> new NoSuchElementException(
                "Progress not found with ID: " + progressId
            ));
        
        // Update fields
        if (updateProgressDTO.getTopicsCovered() != null) {
            String topicsCoveredJson = convertTopicsToJson(updateProgressDTO.getTopicsCovered());
            progress.setTopicsCovered(topicsCoveredJson);
        }
        
        // Save updated progress
        ProgressEntity updatedProgress = progressRepository.save(progress);
        
        return convertToDTO(updatedProgress);
    }
    
    // ========== DELETE ==========
    public String deleteProgress(Long progressId) {
        if (!progressRepository.existsById(progressId)) {
            throw new NoSuchElementException("Progress not found with ID: " + progressId);
        }
        
        progressRepository.deleteById(progressId);
        return "Progress with ID " + progressId + " was successfully deleted.";
    }
    
    // ========== HELPER METHODS ==========
    private ProgressDTO convertToDTO(ProgressEntity progress) {
        List<String> topicsCovered = convertJsonToTopics(progress.getTopicsCovered());
        
        return ProgressDTO.builder()
            .progressId(progress.getProgressId())
            .sessionId(progress.getSession().getSessionId())
            .tuteeSubjectId(progress.getTuteeSubject().getTuteeSubjectId())
            .topicsCovered(topicsCovered)
            .build();
    }
    
    private String convertTopicsToJson(List<String> topics) {
        if (topics == null || topics.isEmpty()) {
            return "[]";
        }
        
        // Simple JSON array conversion
        // For production, use a JSON library like Jackson ObjectMapper
        StringBuilder jsonBuilder = new StringBuilder("[");
        for (int i = 0; i < topics.size(); i++) {
            jsonBuilder.append("\"").append(topics.get(i).replace("\"", "\\\"")).append("\"");
            if (i < topics.size() - 1) {
                jsonBuilder.append(",");
            }
        }
        jsonBuilder.append("]");
        
        return jsonBuilder.toString();
    }
    
    private List<String> convertJsonToTopics(String json) {
        if (json == null || json.trim().isEmpty() || json.equals("[]")) {
            return List.of();
        }
        
        // Simple JSON parsing
        // For production, use a JSON library like Jackson ObjectMapper
        try {
            String cleanJson = json.trim();
            if (cleanJson.startsWith("[") && cleanJson.endsWith("]")) {
                String content = cleanJson.substring(1, cleanJson.length() - 1);
                if (content.isEmpty()) {
                    return List.of();
                }
                
                return List.of(content.split(",")).stream()
                    .map(topic -> topic.trim().replace("\"", "").replace("\\\"", "\""))
                    .collect(Collectors.toList());
            }
        } catch (Exception e) {
            // If JSON parsing fails, return empty list
        }
        
        return List.of();
    }
    
    // ========== VALIDATION METHODS ==========
    public boolean existsBySessionId(Long sessionId) {
        return progressRepository.findBySession_SessionId(sessionId).isPresent();
    }
    
    public boolean existsByTuteeSubjectId(Long tuteeSubjectId) {
        return !progressRepository.findByTuteeSubject_TuteeSubjectId(tuteeSubjectId).isEmpty();
    }
}