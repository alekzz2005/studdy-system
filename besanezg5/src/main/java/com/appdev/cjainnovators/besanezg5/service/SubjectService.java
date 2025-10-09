package com.appdev.cjainnovators.besanezg5.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.cjainnovators.besanezg5.entity.SubjectEntity;
import com.appdev.cjainnovators.besanezg5.repository.SubjectRepository;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;
    public SubjectService() {}
    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    //Create / Post 
    public SubjectEntity insertSubject(SubjectEntity subject) {
        return subjectRepository.save(subject);
    }

    //Read / Get
    public List<SubjectEntity> getAllSubjects() {
        return subjectRepository.findAll();
    }

    //Update / Put
    @SuppressWarnings("finally")
    public SubjectEntity updateSubject(int subjectId, SubjectEntity newSubject) {
        SubjectEntity existingSubject = new SubjectEntity();
        try {
            existingSubject = subjectRepository.findById(subjectId).get();
            existingSubject.setSubjectName(newSubject.getSubjectName());
            existingSubject.setMajor(newSubject.getMajor());
            existingSubject.setSubjectDescription(newSubject.getSubjectDescription());
        } catch (NoSuchElementException e) {
            throw new NoSuchElementException("Subject with ID " + subjectId + " does not exist.");
        } finally {
            return subjectRepository.save(existingSubject);
        }
    }

    //Delete
    public String deleteSubject(int subjectId) {
        String msg = "";

        if (subjectRepository.existsById(subjectId)) {
            subjectRepository.deleteById(subjectId);
            msg = "Subject with ID " + subjectId + " was successfully deleted.";
        } else {
            msg = "Subject with ID " + subjectId + " does not exist.";
        }

        return msg;
    }
}
