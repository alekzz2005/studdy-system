package com.cjainnovators.studdy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cjainnovators.studdy.entity.TutorSubjectEntity;

@Repository
public interface TutorSubjectRepository extends JpaRepository<TutorSubjectEntity, Integer> {
    List<TutorSubjectEntity> findByUserUserId(int userId);
    List<TutorSubjectEntity> findBySubjectSubjectId(int subjectId);
    List<TutorSubjectEntity> findByExpertiseLevel(String expertiseLevel);
    List<TutorSubjectEntity> findByUserUserIdAndSubjectSubjectId(int userId, int subjectId);
    boolean existsByUserUserIdAndSubjectSubjectId(int userId, int subjectId);
}