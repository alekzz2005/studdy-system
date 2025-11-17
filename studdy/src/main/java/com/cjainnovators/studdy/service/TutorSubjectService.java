package com.cjainnovators.studdy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cjainnovators.studdy.entity.TutorSubjectEntity;
import com.cjainnovators.studdy.repository.TutorSubjectRepository;
import com.cjainnovators.studdy.repository.UserRepository;
import com.cjainnovators.studdy.repository.SubjectRepository;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TutorSubjectService {

    @Autowired
    private TutorSubjectRepository tutorSubjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public TutorSubjectEntity assignSubjectToTutor(TutorSubjectEntity tutorSubject) {
        // Check if assignment already exists
        if (tutorSubjectRepository.existsByUserUserIdAndSubjectSubjectId(
            tutorSubject.getUser().getUserId(), 
            tutorSubject.getSubject().getSubjectId())) {
            throw new IllegalArgumentException("Tutor is already assigned to this subject");
        }

        // Validate user and subject exist
        if (!userRepository.existsById(tutorSubject.getUser().getUserId())) {
            throw new NoSuchElementException("User with ID " + tutorSubject.getUser().getUserId() + " not found");
        }
        if (!subjectRepository.existsById(tutorSubject.getSubject().getSubjectId())) {
            throw new NoSuchElementException("Subject with ID " + tutorSubject.getSubject().getSubjectId() + " not found");
        }

        return tutorSubjectRepository.save(tutorSubject);
    }

    public List<TutorSubjectEntity> getAllTutorSubjects() {
        return tutorSubjectRepository.findAll();
    }

    public List<TutorSubjectEntity> getSubjectsByTutor(int tutorId) {
        return tutorSubjectRepository.findByUserUserId(tutorId);
    }

    public List<TutorSubjectEntity> getTutorsBySubject(int subjectId) {
        return tutorSubjectRepository.findBySubjectSubjectId(subjectId);
    }

    public TutorSubjectEntity updateExpertiseLevel(int tutorSubjectId, String expertiseLevel) {
        TutorSubjectEntity tutorSubject = tutorSubjectRepository.findById(tutorSubjectId)
            .orElseThrow(() -> new NoSuchElementException("Tutor subject assignment with ID " + tutorSubjectId + " not found"));
        tutorSubject.setExpertiseLevel(expertiseLevel);
        return tutorSubjectRepository.save(tutorSubject);
    }

    public String removeSubjectFromTutor(int tutorSubjectId) {
        if (tutorSubjectRepository.existsById(tutorSubjectId)) {
            tutorSubjectRepository.deleteById(tutorSubjectId);
            return "Tutor subject assignment with ID " + tutorSubjectId + " removed successfully";
        }
        return "Tutor subject assignment with ID " + tutorSubjectId + " not found";
    }

    public boolean isTutorAssignedToSubject(int tutorId, int subjectId) {
        return tutorSubjectRepository.existsByUserUserIdAndSubjectSubjectId(tutorId, subjectId);
    }
}