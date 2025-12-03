package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.tutorsubjectdto.*;
import com.appdevg5.cjainnovators.entity.TutorEntity;
import com.appdevg5.cjainnovators.entity.TutorSubjectEntity;
import com.appdevg5.cjainnovators.entity.SubjectEntity;
import com.appdevg5.cjainnovators.repository.TutorRepository;
import com.appdevg5.cjainnovators.repository.TutorSubjectRepository;
import com.appdevg5.cjainnovators.repository.SubjectRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TutorSubjectService {
    
    private final TutorSubjectRepository tutorSubjectRepository;
    private final TutorRepository tutorRepository;
    private final SubjectRepository subjectRepository;

    // Convert Entity to DTO
    private TutorSubjectDTO convertToDTO(TutorSubjectEntity tutorSubject) {
        return TutorSubjectDTO.builder()
                .tutorSubjectId(tutorSubject.getTutorSubjectId())
                .tutorId(tutorSubject.getTutor().getTutorId())
                .subjectId(tutorSubject.getSubject().getSubjectId())
                .subjectName(tutorSubject.getSubject().getSubjectName())
                .proficiencyLevel(tutorSubject.getProficiencyLevel())
                .isAvailable(tutorSubject.isAvailable())
                .build();
    }

    // Convert DTO to Entity
    private TutorSubjectEntity convertToEntity(CreateTutorSubjectDTO dto) {
        TutorEntity tutor = tutorRepository.findById(dto.getTutorId())
                .orElseThrow(() -> new NoSuchElementException(
                        "Tutor with ID " + dto.getTutorId() + " not found"));
        
        SubjectEntity subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NoSuchElementException(
                        "Subject with ID " + dto.getSubjectId() + " not found"));
        
        return TutorSubjectEntity.builder()
                .tutor(tutor)
                .subject(subject)
                .proficiencyLevel(dto.getProficiencyLevel())
                .isAvailable(dto.isAvailable())
                .build();
    }

    // ============ CRUD OPERATIONS ============

    // CREATE - Add a new tutor-subject association
    @Transactional
    public TutorSubjectDTO createTutorSubject(CreateTutorSubjectDTO createDTO) {
        // Check if the association already exists
        boolean exists = tutorSubjectRepository.existsByTutor_TutorIdAndSubject_SubjectId(
                createDTO.getTutorId(), createDTO.getSubjectId());
        
        if (exists) {
            throw new IllegalArgumentException(
                    "Tutor is already associated with this subject");
        }

        // Validate proficiency level
        if (createDTO.getProficiencyLevel() < 1 || createDTO.getProficiencyLevel() > 5) {
            throw new IllegalArgumentException(
                    "Proficiency level must be between 1 and 5");
        }

        TutorSubjectEntity tutorSubject = convertToEntity(createDTO);
        TutorSubjectEntity savedEntity = tutorSubjectRepository.save(tutorSubject);
        
        return convertToDTO(savedEntity);
    }

    // READ - Get all tutor-subject associations
    public List<TutorSubjectDTO> getAllTutorSubjects() {
        return tutorSubjectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ - Get tutor-subject by ID
    public TutorSubjectDTO getTutorSubjectById(Long tutorSubjectId) {
        TutorSubjectEntity tutorSubject = tutorSubjectRepository.findById(tutorSubjectId)
                .orElseThrow(() -> new NoSuchElementException(
                        "TutorSubject with ID " + tutorSubjectId + " not found"));
        
        return convertToDTO(tutorSubject);
    }

    // READ - Get all subjects for a specific tutor
    public List<TutorSubjectDTO> getSubjectsByTutorId(Long tutorId) {
        return tutorSubjectRepository.findByTutor_TutorId(tutorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ - Get all tutors for a specific subject
    public List<TutorSubjectDTO> getTutorsBySubjectId(Long subjectId) {
        return tutorSubjectRepository.findBySubject_SubjectId(subjectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ - Get available tutors for a subject
    public List<TutorSubjectDTO> getAvailableTutorsBySubject(Long subjectId) {
        return tutorSubjectRepository.findBySubject_SubjectId(subjectId).stream()
                .filter(TutorSubjectEntity::isAvailable)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // UPDATE - Update a tutor-subject association
    @Transactional
    public TutorSubjectDTO updateTutorSubject(Long tutorSubjectId, UpdateTutorSubjectDTO updateDTO) {
        TutorSubjectEntity tutorSubject = tutorSubjectRepository.findById(tutorSubjectId)
                .orElseThrow(() -> new NoSuchElementException(
                        "TutorSubject with ID " + tutorSubjectId + " not found"));

        // Validate proficiency level if provided
        if (updateDTO.getProficiencyLevel() < 1 || updateDTO.getProficiencyLevel() > 5) {
            throw new IllegalArgumentException(
                    "Proficiency level must be between 1 and 5");
        }

        // Update fields
        tutorSubject.setProficiencyLevel(updateDTO.getProficiencyLevel());
        tutorSubject.setAvailable(updateDTO.isAvailable());

        TutorSubjectEntity updatedEntity = tutorSubjectRepository.save(tutorSubject);
        return convertToDTO(updatedEntity);
    }

    // DELETE - Remove a tutor-subject association
    @Transactional
    public void deleteTutorSubject(Long tutorSubjectId) {
        if (!tutorSubjectRepository.existsById(tutorSubjectId)) {
            throw new NoSuchElementException(
                    "TutorSubject with ID " + tutorSubjectId + " not found");
        }
        tutorSubjectRepository.deleteById(tutorSubjectId);
    }

    // DELETE - Remove association by tutor and subject IDs
    @Transactional
    public void deleteByTutorAndSubject(Long tutorId, Long subjectId) {
        tutorSubjectRepository.findByTutor_TutorIdAndSubject_SubjectId(tutorId, subjectId)
                .ifPresentOrElse(
                        tutorSubject -> tutorSubjectRepository.delete(tutorSubject),
                        () -> {
                            throw new NoSuchElementException(
                                    "No association found for tutorId: " + tutorId + 
                                    " and subjectId: " + subjectId);
                        }
                );
    }

    // Check if a tutor is associated with a subject
    public boolean existsByTutorAndSubject(Long tutorId, Long subjectId) {
        return tutorSubjectRepository.existsByTutor_TutorIdAndSubject_SubjectId(
                tutorId, subjectId);
    }

    // Get tutor's proficiency level for a subject
    public Integer getProficiencyLevel(Long tutorId, Long subjectId) {
        return tutorSubjectRepository.findByTutor_TutorIdAndSubject_SubjectId(tutorId, subjectId)
                .map(TutorSubjectEntity::getProficiencyLevel)
                .orElse(null);
    }

    // Toggle availability for a tutor-subject association
    @Transactional
    public TutorSubjectDTO toggleAvailability(Long tutorSubjectId) {
        TutorSubjectEntity tutorSubject = tutorSubjectRepository.findById(tutorSubjectId)
                .orElseThrow(() -> new NoSuchElementException(
                        "TutorSubject with ID " + tutorSubjectId + " not found"));

        tutorSubject.setAvailable(!tutorSubject.isAvailable());
        TutorSubjectEntity updatedEntity = tutorSubjectRepository.save(tutorSubject);
        
        return convertToDTO(updatedEntity);
    }
}