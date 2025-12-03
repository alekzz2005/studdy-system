package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.subjectdto.*;
import com.appdevg5.cjainnovators.entity.SubjectEntity;
import com.appdevg5.cjainnovators.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class SubjectService {
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private ObjectMapper objectMapper; // For JSON serialization
    
    public SubjectService(SubjectRepository subjectRepository, ObjectMapper objectMapper) {
        this.subjectRepository = subjectRepository;
        this.objectMapper = objectMapper;
    }
    
    // ========== CREATE ==========
    
    /**
     * Create a new subject
     */
    public SubjectDTO createSubject(CreateSubjectDTO createSubjectDTO) {
        // Check if subject already exists
        if (subjectRepository.findBySubjectName(createSubjectDTO.getSubjectName()).isPresent()) {
            throw new IllegalArgumentException("Subject with name '" + createSubjectDTO.getSubjectName() + "' already exists.");
        }
        
        SubjectEntity subject = new SubjectEntity();
        subject.setSubjectName(createSubjectDTO.getSubjectName());
        subject.setSubjectDesc(createSubjectDTO.getSubjectDesc());
        
        // Convert topics list to JSON string
        if (createSubjectDTO.getTopics() != null && !createSubjectDTO.getTopics().isEmpty()) {
            try {
                String topicsJson = objectMapper.writeValueAsString(createSubjectDTO.getTopics());
                subject.setTopics(topicsJson);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize topics to JSON", e);
            }
        }
        
        SubjectEntity savedSubject = subjectRepository.save(subject);
        return convertToDTO(savedSubject);
    }
    
    // ========== READ ==========
    
    /**
     * Get all subjects
     */
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get subject by ID
     */
    public SubjectDTO getSubjectById(Long subjectId) {
        SubjectEntity subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new NoSuchElementException("Subject with ID " + subjectId + " not found."));
        return convertToDTO(subject);
    }
    
    /**
     * Get subject by name
     */
    public SubjectDTO getSubjectByName(String subjectName) {
        SubjectEntity subject = subjectRepository.findBySubjectName(subjectName)
                .orElseThrow(() -> new NoSuchElementException("Subject with name '" + subjectName + "' not found."));
        return convertToDTO(subject);
    }
    
    // ========== UPDATE ==========
    
    /**
     * Update subject by ID
     */
    public SubjectDTO updateSubject(Long subjectId, UpdateSubjectDTO updateSubjectDTO) {
        SubjectEntity existingSubject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new NoSuchElementException("Subject with ID " + subjectId + " not found."));
        
        // Check if new subject name conflicts with another subject
        if (updateSubjectDTO.getSubjectName() != null && 
            !updateSubjectDTO.getSubjectName().equals(existingSubject.getSubjectName())) {
            subjectRepository.findBySubjectName(updateSubjectDTO.getSubjectName())
                .ifPresent(s -> {
                    throw new IllegalArgumentException("Subject with name '" + updateSubjectDTO.getSubjectName() + "' already exists.");
                });
        }
        
        // Update fields if provided
        if (updateSubjectDTO.getSubjectName() != null) {
            existingSubject.setSubjectName(updateSubjectDTO.getSubjectName());
        }
        
        if (updateSubjectDTO.getSubjectDesc() != null) {
            existingSubject.setSubjectDesc(updateSubjectDTO.getSubjectDesc());
        }
        
        // Update topics if provided
        if (updateSubjectDTO.getTopics() != null) {
            try {
                String topicsJson = objectMapper.writeValueAsString(updateSubjectDTO.getTopics());
                existingSubject.setTopics(topicsJson);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize topics to JSON", e);
            }
        }
        
        SubjectEntity updatedSubject = subjectRepository.save(existingSubject);
        return convertToDTO(updatedSubject);
    }
    
    /**
     * Partially update subject (PATCH-like operation)
     */
    public SubjectDTO patchSubject(Long subjectId, UpdateSubjectDTO patchDTO) {
        SubjectEntity existingSubject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new NoSuchElementException("Subject with ID " + subjectId + " not found."));
        
        // Only update fields that are not null in the patch DTO
        if (patchDTO.getSubjectName() != null) {
            // Check for name conflict
            subjectRepository.findBySubjectName(patchDTO.getSubjectName())
                .ifPresent(s -> {
                    if (!s.getSubjectId().equals(subjectId)) {
                        throw new IllegalArgumentException("Subject with name '" + patchDTO.getSubjectName() + "' already exists.");
                    }
                });
            existingSubject.setSubjectName(patchDTO.getSubjectName());
        }
        
        if (patchDTO.getSubjectDesc() != null) {
            existingSubject.setSubjectDesc(patchDTO.getSubjectDesc());
        }
        
        if (patchDTO.getTopics() != null) {
            try {
                String topicsJson = objectMapper.writeValueAsString(patchDTO.getTopics());
                existingSubject.setTopics(topicsJson);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize topics to JSON", e);
            }
        }
        
        SubjectEntity updatedSubject = subjectRepository.save(existingSubject);
        return convertToDTO(updatedSubject);
    }
    
    // ========== DELETE ==========
    
    /**
     * Delete subject by ID
     */
    public void deleteSubject(Long subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            throw new NoSuchElementException("Subject with ID " + subjectId + " not found.");
        }
        subjectRepository.deleteById(subjectId);
    }
    
    /**
     * Check if subject exists by ID
     */
    public boolean subjectExists(Long subjectId) {
        return subjectRepository.existsById(subjectId);
    }
    
    /**
     * Check if subject exists by name
     */
    public boolean subjectExistsByName(String subjectName) {
        return subjectRepository.findBySubjectName(subjectName).isPresent();
    }
    
    // ========== HELPER METHODS ==========
    
    /**
     * Convert SubjectEntity to SubjectDTO
     */
    private SubjectDTO convertToDTO(SubjectEntity subject) {
        SubjectDTO dto = new SubjectDTO();
        dto.setSubjectId(subject.getSubjectId());
        dto.setSubjectName(subject.getSubjectName());
        dto.setSubjectDesc(subject.getSubjectDesc());
        dto.setTopics(subject.getTopics());
        return dto;
    }
    
    /**
     * Convert topics JSON string back to List
     */
    public List<String> parseTopics(String topicsJson) {
        if (topicsJson == null || topicsJson.trim().isEmpty()) {
            return List.of();
        }
        
        try {
            return objectMapper.readValue(topicsJson, 
                objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (JsonProcessingException e) {
            // Fallback to comma-separated parsing
            return List.of(topicsJson.split(","));
        }
    }
    
    /**
     * Get total count of subjects
     */
    public long getSubjectCount() {
        return subjectRepository.count();
    }
}