package com.appdev.cjainnovators.besanezg5.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.cjainnovators.besanezg5.entity.SubjectEntity;

@Repository
public interface SubjectRepository extends JpaRepository<SubjectEntity, Integer> {
    public SubjectEntity findBySubjectName(String subjectName);
    public SubjectEntity findByMajor(String major);
    public SubjectEntity findBySubjectDescription(String subjectDescription); 
}
