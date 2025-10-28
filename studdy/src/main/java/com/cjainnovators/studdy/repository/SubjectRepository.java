package com.cjainnovators.studdy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cjainnovators.studdy.entity.SubjectEntity;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<SubjectEntity, Integer> {
    List<SubjectEntity> findBySubjectNameContainingIgnoreCase(String subjectName);
    List<SubjectEntity> findByMajor(String major);
    List<SubjectEntity> findBySubjectNameAndMajor(String subjectName, String major);
}