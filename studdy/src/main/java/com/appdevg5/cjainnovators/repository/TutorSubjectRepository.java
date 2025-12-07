package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.TutorSubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface TutorSubjectRepository extends JpaRepository<TutorSubjectEntity, Long> {
    
    List<TutorSubjectEntity> findByTutor_TutorId(Long tutorId);
    
    List<TutorSubjectEntity> findBySubject_SubjectId(Long subjectId);
    
    Optional<TutorSubjectEntity> findByTutor_TutorIdAndSubject_SubjectId(Long tutorId, Long subjectId);

    boolean existsByTutor_TutorIdAndSubject_SubjectId(Long tutorId, Long subjectId);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM TutorSubjectEntity ts WHERE ts.tutor.tutorId = :tutorId")
    void deleteByTutor_TutorId(@Param("tutorId") Long tutorId);
    
    @Query("SELECT COUNT(ts) FROM TutorSubjectEntity ts WHERE ts.subject.subjectId = :subjectId")
    Long countBySubjectId(@Param("subjectId") Long subjectId);
    
}