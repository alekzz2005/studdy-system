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

    // CREATE 
    @Transactional
    public TutorSubjectDTO createTutorSubject(CreateTutorSubjectDTO createDTO) {
        // Check if the association already exists
        boolean exists = tutorSubjectRepository.existsByTutor_TutorIdAndSubject_SubjectId(
                createDTO.getTutorId(), createDTO.getSubjectId());
        
        if (exists) {
            throw new IllegalArgumentException(
                    "Tutor is already associated with this subject");
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

    // Convert Entity to DTO
    private TutorSubjectDTO convertToDTO(TutorSubjectEntity tutorSubject) {
        return TutorSubjectDTO.builder()
                .tutorSubjectId(tutorSubject.getTutorSubjectId())
                .tutorId(tutorSubject.getTutor().getTutorId())
                .subjectId(tutorSubject.getSubject().getSubjectId())
                .subjectName(tutorSubject.getSubject().getSubjectName())
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
                .build();
    }

}