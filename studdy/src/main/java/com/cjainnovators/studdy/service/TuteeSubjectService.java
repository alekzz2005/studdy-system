package com.cjainnovators.studdy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cjainnovators.studdy.entity.TuteeSubjectEntity;
import com.cjainnovators.studdy.repository.TuteeSubjectRepository;
import com.cjainnovators.studdy.repository.UserRepository;
import com.cjainnovators.studdy.repository.SubjectRepository;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TuteeSubjectService {

    @Autowired
    private TuteeSubjectRepository tuteeSubjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public TuteeSubjectEntity assignSubjectToTutee(TuteeSubjectEntity tuteeSubject) {
        // Check if assignment already exists
        if (tuteeSubjectRepository.existsByUserUserIdAndSubjectSubjectId(
            tuteeSubject.getUser().getUserId(), 
            tuteeSubject.getSubject().getSubjectId())) {
            throw new IllegalArgumentException("Tutee is already assigned to this subject");
        }

        // Validate user and subject exist
        if (!userRepository.existsById(tuteeSubject.getUser().getUserId())) {
            throw new NoSuchElementException("User with ID " + tuteeSubject.getUser().getUserId() + " not found");
        }
        if (!subjectRepository.existsById(tuteeSubject.getSubject().getSubjectId())) {
            throw new NoSuchElementException("Subject with ID " + tuteeSubject.getSubject().getSubjectId() + " not found");
        }

        return tuteeSubjectRepository.save(tuteeSubject);
    }

    public List<TuteeSubjectEntity> getAllTuteeSubjects() {
        return tuteeSubjectRepository.findAll();
    }

    public List<TuteeSubjectEntity> getSubjectsByTutee(int tuteeId) {
        return tuteeSubjectRepository.findByUserUserId(tuteeId);
    }

    public List<TuteeSubjectEntity> getTuteesBySubject(int subjectId) {
        return tuteeSubjectRepository.findBySubjectSubjectId(subjectId);
    }

    public TuteeSubjectEntity updateTuteeProgress(int tuteeSubjectId, Float progress, String goalDescription) {
        TuteeSubjectEntity tuteeSubject = tuteeSubjectRepository.findById(tuteeSubjectId)
            .orElseThrow(() -> new NoSuchElementException("Tutee subject assignment with ID " + tuteeSubjectId + " not found"));
        
        if (progress != null) {
            tuteeSubject.setCurrentProgress(progress);
        }
        if (goalDescription != null) {
            tuteeSubject.setGoalDescription(goalDescription);
        }
        
        return tuteeSubjectRepository.save(tuteeSubject);
    }

    public String removeSubjectFromTutee(int tuteeSubjectId) {
        if (tuteeSubjectRepository.existsById(tuteeSubjectId)) {
            tuteeSubjectRepository.deleteById(tuteeSubjectId);
            return "Tutee subject assignment with ID " + tuteeSubjectId + " removed successfully";
        }
        return "Tutee subject assignment with ID " + tuteeSubjectId + " not found";
    }

    public List<TuteeSubjectEntity> getTuteesWithHighProgress(Float minProgress) {
        return tuteeSubjectRepository.findByCurrentProgressGreaterThan(minProgress);
    }

    public List<TuteeSubjectEntity> getTuteesWithLowProgress(Float maxProgress) {
        return tuteeSubjectRepository.findByCurrentProgressLessThan(maxProgress);
    }
}