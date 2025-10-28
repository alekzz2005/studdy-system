package com.cjainnovators.studdy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cjainnovators.studdy.entity.TuteeSubjectEntity;
import java.util.List;

@Repository
public interface TuteeSubjectRepository extends JpaRepository<TuteeSubjectEntity, Integer> {
    List<TuteeSubjectEntity> findByUserUserId(int userId);
    List<TuteeSubjectEntity> findBySubjectSubjectId(int subjectId);
    List<TuteeSubjectEntity> findByCurrentProgressGreaterThan(Float progress);
    List<TuteeSubjectEntity> findByCurrentProgressLessThan(Float progress);
    List<TuteeSubjectEntity> findByUserUserIdAndSubjectSubjectId(int userId, int subjectId);
    boolean existsByUserUserIdAndSubjectSubjectId(int userId, int subjectId);
}