package com.cjainnovators.studdy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cjainnovators.studdy.entity.SubjectEntity;
import com.cjainnovators.studdy.repository.SubjectRepository;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public SubjectEntity createSubject(SubjectEntity subject) {
        return subjectRepository.save(subject);
    }

    public List<SubjectEntity> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public SubjectEntity getSubjectById(int subjectId) {
        return subjectRepository.findById(subjectId)
            .orElseThrow(() -> new NoSuchElementException("Subject with ID " + subjectId + " not found"));
    }

    public SubjectEntity updateSubject(int subjectId, SubjectEntity subject) {
        SubjectEntity existingSubject = getSubjectById(subjectId);
        existingSubject.setSubjectName(subject.getSubjectName());
        existingSubject.setMajor(subject.getMajor());
        existingSubject.setDescription(subject.getDescription());
        return subjectRepository.save(existingSubject);
    }

    public String deleteSubject(int subjectId) {
        if (subjectRepository.existsById(subjectId)) {
            subjectRepository.deleteById(subjectId);
            return "Subject with ID " + subjectId + " deleted successfully";
        }
        return "Subject with ID " + subjectId + " not found";
    }

    public List<SubjectEntity> getSubjectsByMajor(String major) {
        return subjectRepository.findByMajor(major);
    }

    public List<SubjectEntity> searchSubjectsByName(String name) {
        return subjectRepository.findBySubjectNameContainingIgnoreCase(name);
    }
}