package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.ProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<ProgressEntity, Long> {
    
    Optional<ProgressEntity> findBySession_SessionId(Long sessionId);
    
    List<ProgressEntity> findByTuteeSubject_TuteeSubjectId(Long tuteeSubjectId);
    
    @Query("SELECT p FROM ProgressEntity p WHERE p.tuteeSubject.tutee.tuteeId = :tuteeId")
    List<ProgressEntity> findByTuteeId(@Param("tuteeId") Long tuteeId);
    
    @Query("SELECT p FROM ProgressEntity p WHERE p.tuteeSubject.subject.subjectId = :subjectId")
    List<ProgressEntity> findBySubjectId(@Param("subjectId") Long subjectId);
    
    @Query("SELECT p FROM ProgressEntity p WHERE p.tuteeSubject.tutee.tuteeId = :tuteeId AND p.tuteeSubject.subject.subjectId = :subjectId")
    List<ProgressEntity> findByTuteeAndSubject(@Param("tuteeId") Long tuteeId, 
                                               @Param("subjectId") Long subjectId);
    
    @Query("SELECT p FROM ProgressEntity p WHERE p.session.tutor.tutorId = :tutorId")
    List<ProgressEntity> findByTutorId(@Param("tutorId") Long tutorId);
    
    @Query("SELECT p FROM ProgressEntity p " +
           "WHERE p.tuteeSubject.tutee.user.gradeLevel = :gradeLevel")
    List<ProgressEntity> findByGradeLevel(@Param("gradeLevel") int gradeLevel);
    
    @Query("SELECT p FROM ProgressEntity p " +
           "WHERE p.session.sessionDate >= :startDate " +
           "AND p.session.sessionDate <= :endDate")
    List<ProgressEntity> findByDateRange(@Param("startDate") java.time.LocalDate startDate,
                                         @Param("endDate") java.time.LocalDate endDate);
    
    @Query("SELECT p FROM ProgressEntity p " +
           "WHERE p.tuteeSubject.status = :status")
    List<ProgressEntity> findByTuteeSubjectStatus(@Param("status") String status);
}