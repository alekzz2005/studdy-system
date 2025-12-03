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
    
    List<TutorSubjectEntity> findByIsAvailableTrue();
    
    Optional<TutorSubjectEntity> findByTutor_TutorIdAndSubject_SubjectId(Long tutorId, Long subjectId);

    boolean existsByTutor_TutorIdAndSubject_SubjectId(Long tutorId, Long subjectId);
    
    @Query("SELECT ts FROM TutorSubjectEntity ts WHERE ts.tutor.tutorId = :tutorId AND ts.proficiencyLevel >= :minLevel")
    List<TutorSubjectEntity> findByTutorIdAndMinProficiency(@Param("tutorId") Long tutorId, 
                                                            @Param("minLevel") int minLevel);
    
    @Query("SELECT ts FROM TutorSubjectEntity ts WHERE ts.subject.subjectName = :subjectName AND ts.isAvailable = true")
    List<TutorSubjectEntity> findAvailableBySubjectName(@Param("subjectName") String subjectName);
    
    @Query("SELECT ts FROM TutorSubjectEntity ts " +
           "WHERE ts.tutor.user.active = true " +
           "AND ts.isAvailable = true")
    List<TutorSubjectEntity> findAllAvailable();
    
    @Transactional
    @Modifying
    @Query("DELETE FROM TutorSubjectEntity ts WHERE ts.tutor.tutorId = :tutorId")
    void deleteByTutor_TutorId(@Param("tutorId") Long tutorId);
    
    @Query("SELECT COUNT(ts) FROM TutorSubjectEntity ts WHERE ts.subject.subjectId = :subjectId")
    Long countBySubjectId(@Param("subjectId") Long subjectId);
    
    @Query("SELECT ts FROM TutorSubjectEntity ts " +
           "WHERE ts.tutor.user.school = :school " +
           "AND ts.subject.subjectName = :subjectName " +
           "AND ts.isAvailable = true")
    List<TutorSubjectEntity> findBySchoolAndSubject(@Param("school") String school, 
                                                    @Param("subjectName") String subjectName);
    
    @Query("SELECT DISTINCT ts.subject.subjectName FROM TutorSubjectEntity ts WHERE ts.isAvailable = true")
    List<String> findDistinctAvailableSubjectNames();
}