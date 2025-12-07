package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.tutordto.*;
import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectDTO;
import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectRequestDTO;
import com.appdevg5.cjainnovators.entity.*;
import com.appdevg5.cjainnovators.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TutorService {
    
    @Autowired
    private TutorRepository tutorRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private TutorSubjectRepository tutorSubjectRepository;
    
    @Autowired
    private SessionRepository sessionRepository;
    
    // Convert Entity to DTO methods
    private TutorDTO convertToTutorDTO(TutorEntity tutor) {
        TutorDTO dto = new TutorDTO();
        dto.setTutorId(tutor.getTutorId());
        dto.setAverageRating(tutor.getAverageRating());
        
        if (tutor.getUser() != null) {
            dto.setUserId(tutor.getUser().getUserId());
            dto.setUserEmail(tutor.getUser().getEmail());
            dto.setFirstName(tutor.getUser().getFirstName());
            dto.setLastName(tutor.getUser().getLastName());
            dto.setPhoneNumber(tutor.getUser().getPhoneNumber());
            dto.setActive(tutor.getUser().isActive());
        }
        
        // Convert subjects
        if (tutor.getSubjects() != null) {
            List<TutorSubjectDTO> subjectDTOs = tutor.getSubjects().stream()
                .map(this::convertToTutorSubjectDTO)
                .collect(Collectors.toList());
            dto.setSubjects(subjectDTOs);
        }
        
        // Get total sessions
        List<SessionEntity> sessions = sessionRepository.findByTutor_TutorId(tutor.getTutorId());
        dto.setTotalSessions(sessions.size());
        
        return dto;
    }
    
    private TutorSubjectDTO convertToTutorSubjectDTO(TutorSubjectEntity tutorSubject) {
        TutorSubjectDTO dto = new TutorSubjectDTO();
        dto.setTutorSubjectId(tutorSubject.getTutorSubjectId());
        
        if (tutorSubject.getSubject() != null) {
            dto.setSubjectId(tutorSubject.getSubject().getSubjectId());
            dto.setSubjectName(tutorSubject.getSubject().getSubjectName());
            dto.setSubjectDesc(tutorSubject.getSubject().getSubjectDesc());
        }
        
        return dto;
    }
    
    // Create new tutor
    public TutorDTO createTutor(CreateTutorDTO createTutorDTO) {
        UserEntity user = userRepository.findById(createTutorDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + createTutorDTO.getUserId()));
        
        if (tutorRepository.findByUser_UserId(createTutorDTO.getUserId()).isPresent()) {
            throw new RuntimeException("User is already registered as a tutor");
        }
        
        // Create tutor entity
        TutorEntity tutor = TutorEntity.builder()
            .user(user)
            .averageRating(0.0f)
            .build();
        
        TutorEntity savedTutor = tutorRepository.save(tutor);
        
        // Add subjects if provided
        if (createTutorDTO.getSubjects() != null && !createTutorDTO.getSubjects().isEmpty()) {
            for (TutorSubjectRequestDTO subjectRequest : createTutorDTO.getSubjects()) {
                SubjectEntity subject = subjectRepository.findById(subjectRequest.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectRequest.getSubjectId()));
                
                TutorSubjectEntity tutorSubject = TutorSubjectEntity.builder()
                    .tutor(savedTutor)
                    .subject(subject)
                    .build();
                
                tutorSubjectRepository.save(tutorSubject);
            }
        }
        
        return convertToTutorDTO(savedTutor);
    }
    
    // Get tutor by ID
    public TutorDTO getTutorById(Long tutorId) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        return convertToTutorDTO(tutor);
    }
    
    // Get tutor by user ID
    public TutorDTO getTutorByUserId(Long userId) {
        TutorEntity tutor = tutorRepository.findByUser_UserId(userId)
            .orElseThrow(() -> new RuntimeException("Tutor not found for user ID: " + userId));
        
        return convertToTutorDTO(tutor);
    }
    
    // Get all tutors
    public List<TutorDTO> getAllTutors() {
        return tutorRepository.findAll().stream()
            .map(this::convertToTutorDTO)
            .collect(Collectors.toList());
    }
    
    // Update tutor
    public TutorDTO updateTutor(Long tutorId, UpdateTutorDTO updateTutorDTO) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        // Update basic info
        if (updateTutorDTO.getAverageRating() != null) {
            tutor.setAverageRating(updateTutorDTO.getAverageRating());
        }
        
        // Update subjects if provided
        if (updateTutorDTO.getSubjects() != null) {
            // Remove existing subjects
            tutorSubjectRepository.deleteByTutor_TutorId(tutorId);
            
            // Add new subjects
            for (TutorSubjectRequestDTO subjectRequest : updateTutorDTO.getSubjects()) {
                SubjectEntity subject = subjectRepository.findById(subjectRequest.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectRequest.getSubjectId()));
                
                TutorSubjectEntity tutorSubject = TutorSubjectEntity.builder()
                    .tutor(tutor)
                    .subject(subject)
                    .build();
                
                tutorSubjectRepository.save(tutorSubject);
            }
        }
        
        TutorEntity updatedTutor = tutorRepository.save(tutor);
        return convertToTutorDTO(updatedTutor);
    }
    
    // Delete tutor=
    public String deleteTutor(Long tutorId) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        tutorRepository.delete(tutor);
        
        return "Tutor with ID " + tutorId + " has been deleted";
    }
    
    // Add subject to tutor
    public TutorSubjectDTO addSubjectToTutor(Long tutorId, TutorSubjectRequestDTO subjectRequest) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        SubjectEntity subject = subjectRepository.findById(subjectRequest.getSubjectId())
            .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectRequest.getSubjectId()));
        
        // Check if subject already exists for tutor
        Optional<TutorSubjectEntity> existing = tutorSubjectRepository.findByTutor_TutorIdAndSubject_SubjectId(
            tutorId, subjectRequest.getSubjectId());
        
        if (existing.isPresent()) {
            throw new RuntimeException("Tutor already has this subject");
        }
        
        TutorSubjectEntity tutorSubject = TutorSubjectEntity.builder()
            .tutor(tutor)
            .subject(subject)
            .build();
        
        TutorSubjectEntity savedSubject = tutorSubjectRepository.save(tutorSubject);
        return convertToTutorSubjectDTO(savedSubject);
    }
    
    // Remove subject from tutor
    public void removeSubjectFromTutor(Long tutorId, Long subjectId) {
        TutorSubjectEntity tutorSubject = tutorSubjectRepository
            .findByTutor_TutorIdAndSubject_SubjectId(tutorId, subjectId)
            .orElseThrow(() -> new RuntimeException("Subject not found for tutor"));
        
        tutorSubjectRepository.delete(tutorSubject);
    }
    
    // Update tutor rating based on session feedback
    public void updateTutorRating(Long tutorId) {
        TutorEntity tutor = tutorRepository.findById(tutorId)
            .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        
        List<SessionEntity> sessions = sessionRepository.findByTutor_TutorId(tutorId);
        
        Double averageRating = sessions.stream()
            .filter(s -> s.getRating() != 0.0f)
            .mapToDouble(SessionEntity::getRating)
            .average()
            .orElse(0.0);
        
        tutor.setAverageRating(averageRating.floatValue());
        tutorRepository.save(tutor);
    }
}