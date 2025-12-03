package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.tuteesubjectdto.*;
import com.appdevg5.cjainnovators.entity.SubjectEntity;
import com.appdevg5.cjainnovators.entity.TuteeEntity;
import com.appdevg5.cjainnovators.entity.TuteeSubjectEntity;
import com.appdevg5.cjainnovators.repository.SubjectRepository;
import com.appdevg5.cjainnovators.repository.TuteeRepository;
import com.appdevg5.cjainnovators.repository.TuteeSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class TuteeSubjectService {

    private final TuteeSubjectRepository tuteeSubjectRepository;
    private final TuteeRepository tuteeRepository;
    private final SubjectRepository subjectRepository;

    @Autowired
    public TuteeSubjectService(
            TuteeSubjectRepository tuteeSubjectRepository,
            TuteeRepository tuteeRepository,
            SubjectRepository subjectRepository) {
        this.tuteeSubjectRepository = tuteeSubjectRepository;
        this.tuteeRepository = tuteeRepository;
        this.subjectRepository = subjectRepository;
    }

    // ========== CREATE ==========
    @Transactional
    public TuteeSubjectResponseDTO createTuteeSubject(CreateTuteeSubjectDTO createDTO) {
        // Validate tutee exists
        TuteeEntity tutee = tuteeRepository.findById(createDTO.getTuteeId())
                .orElseThrow(() -> new NoSuchElementException(
                        "Tutee not found with ID: " + createDTO.getTuteeId()));

        // Validate subject exists
        SubjectEntity subject = subjectRepository.findById(createDTO.getSubjectId())
                .orElseThrow(() -> new NoSuchElementException(
                        "Subject not found with ID: " + createDTO.getSubjectId()));

        // Check if tutee already has this subject
        tuteeSubjectRepository.findByTutee_TuteeIdAndSubject_SubjectId(
                createDTO.getTuteeId(), createDTO.getSubjectId())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "Tutee already has this subject assigned");
                });

        // Create new TuteeSubjectEntity
        TuteeSubjectEntity tuteeSubject = TuteeSubjectEntity.builder()
                .tutee(tutee)
                .subject(subject)
                .learningGoal(createDTO.getLearningGoal())
                .startDate(createDTO.getStartDate() != null ? 
                          createDTO.getStartDate() : 
                          java.time.LocalDate.now())
                .status(createDTO.getStatus() != null ? 
                       createDTO.getStatus() : 
                       "ACTIVE")
                .build();

        // Save to database
        TuteeSubjectEntity savedEntity = tuteeSubjectRepository.save(tuteeSubject);

        // Convert to response DTO
        return convertToResponseDTO(savedEntity);
    }

    // ========== READ ==========
    public TuteeSubjectResponseDTO getTuteeSubjectById(Long tuteeSubjectId) {
        TuteeSubjectEntity tuteeSubject = tuteeSubjectRepository.findById(tuteeSubjectId)
                .orElseThrow(() -> new NoSuchElementException(
                        "TuteeSubject not found with ID: " + tuteeSubjectId));

        return convertToResponseDTO(tuteeSubject);
    }

    public List<TuteeSubjectResponseDTO> getAllTuteeSubjects() {
        return tuteeSubjectRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<TuteeSubjectResponseDTO> getTuteeSubjectsByTuteeId(Long tuteeId) {
        // Validate tutee exists
        if (!tuteeRepository.existsById(tuteeId)) {
            throw new NoSuchElementException("Tutee not found with ID: " + tuteeId);
        }

        return tuteeSubjectRepository.findByTutee_TuteeId(tuteeId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<TuteeSubjectResponseDTO> getTuteeSubjectsBySubjectId(Long subjectId) {
        // Validate subject exists
        if (!subjectRepository.existsById(subjectId)) {
            throw new NoSuchElementException("Subject not found with ID: " + subjectId);
        }

        return tuteeSubjectRepository.findBySubject_SubjectId(subjectId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // ========== UPDATE ==========
    @Transactional
    public TuteeSubjectResponseDTO updateTuteeSubject(
            Long tuteeSubjectId, 
            UpdateTuteeSubjectDTO updateDTO) {
        
        TuteeSubjectEntity tuteeSubject = tuteeSubjectRepository.findById(tuteeSubjectId)
                .orElseThrow(() -> new NoSuchElementException(
                        "TuteeSubject not found with ID: " + tuteeSubjectId));

        // Update fields if provided in DTO
        if (updateDTO.getLearningGoal() != null) {
            tuteeSubject.setLearningGoal(updateDTO.getLearningGoal());
        }
        
        if (updateDTO.getStartDate() != null) {
            tuteeSubject.setStartDate(updateDTO.getStartDate());
        }
        
        if (updateDTO.getStatus() != null) {
            tuteeSubject.setStatus(updateDTO.getStatus());
        }

        // Save updated entity
        TuteeSubjectEntity updatedEntity = tuteeSubjectRepository.save(tuteeSubject);

        return convertToResponseDTO(updatedEntity);
    }

    // ========== DELETE ==========
    @Transactional
    public String deleteTuteeSubject(Long tuteeSubjectId) {
        if (!tuteeSubjectRepository.existsById(tuteeSubjectId)) {
            throw new NoSuchElementException(
                    "TuteeSubject not found with ID: " + tuteeSubjectId);
        }

        tuteeSubjectRepository.deleteById(tuteeSubjectId);
        return "TuteeSubject with ID " + tuteeSubjectId + " was successfully deleted.";
    }

    // ========== HELPER METHODS ==========
    private TuteeSubjectResponseDTO convertToResponseDTO(TuteeSubjectEntity entity) {
        return TuteeSubjectResponseDTO.builder()
                .tuteeSubjectId(entity.getTuteeSubjectId())
                .tuteeId(entity.getTutee().getTuteeId())
                .tuteeName(entity.getTutee().getUser().getFirstName() + " " + 
                          entity.getTutee().getUser().getLastName())
                .subjectId(entity.getSubject().getSubjectId())
                .subjectName(entity.getSubject().getSubjectName())
                .learningGoal(entity.getLearningGoal())
                .startDate(entity.getStartDate())
                .status(entity.getStatus())
                .build();
    }

    // ========== ADDITIONAL CRUD OPERATIONS ==========
    
    /**
     * Get tutee subject by tutee and subject IDs
     */
    public TuteeSubjectResponseDTO getByTuteeAndSubject(Long tuteeId, Long subjectId) {
        TuteeSubjectEntity tuteeSubject = tuteeSubjectRepository
                .findByTutee_TuteeIdAndSubject_SubjectId(tuteeId, subjectId)
                .orElseThrow(() -> new NoSuchElementException(
                        "TuteeSubject not found for tutee ID: " + 
                        tuteeId + " and subject ID: " + subjectId));

        return convertToResponseDTO(tuteeSubject);
    }

    /**
     * Get tutee subjects by status
     */
    public List<TuteeSubjectResponseDTO> getByStatus(String status) {
        return tuteeSubjectRepository.findAll()
                .stream()
                .filter(ts -> status.equalsIgnoreCase(ts.getStatus()))
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Check if tutee has a specific subject
     */
    public boolean tuteeHasSubject(Long tuteeId, Long subjectId) {
        return tuteeSubjectRepository
                .findByTutee_TuteeIdAndSubject_SubjectId(tuteeId, subjectId)
                .isPresent();
    }

    /**
     * Count tutee subjects
     */
    public Long countTuteeSubjects(Long tuteeId) {
        return tuteeSubjectRepository.countByTutee_TuteeId(tuteeId);
    }
}