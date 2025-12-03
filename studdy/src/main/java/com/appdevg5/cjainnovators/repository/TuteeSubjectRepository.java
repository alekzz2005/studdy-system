package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.TuteeSubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TuteeSubjectRepository extends JpaRepository<TuteeSubjectEntity, Long> {
    
    List<TuteeSubjectEntity> findByTutee_TuteeId(Long tuteeId);
    
    List<TuteeSubjectEntity> findBySubject_SubjectId(Long subjectId);
    
    Optional<TuteeSubjectEntity> findByTutee_TuteeIdAndSubject_SubjectId(Long tuteeId, Long subjectId);
    
    @Query("SELECT ts FROM TuteeSubjectEntity ts WHERE ts.tutee.tuteeId = :tuteeId AND ts.status = :status")
    List<TuteeSubjectEntity> findByTuteeIdAndStatus(@Param("tuteeId") Long tuteeId, 
                                                    @Param("status") String status);
    
    @Query("SELECT ts FROM TuteeSubjectEntity ts WHERE ts.subject.subjectName = :subjectName")
    List<TuteeSubjectEntity> findBySubjectName(@Param("subjectName") String subjectName);
    
    @Query("SELECT ts FROM TuteeSubjectEntity ts " +
           "WHERE ts.tutee.user.active = true " +
           "AND ts.status = 'ACTIVE'")
    List<TuteeSubjectEntity> findAllActive();
    
    @Query("SELECT COUNT(ts) FROM TuteeSubjectEntity ts WHERE ts.subject.subjectId = :subjectId")
    Long countBySubjectId(@Param("subjectId") Long subjectId);
    
    @Query("SELECT ts FROM TuteeSubjectEntity ts " +
           "WHERE ts.tutee.user.school = :school " +
           "AND ts.subject.subjectName = :subjectName")
    List<TuteeSubjectEntity> findBySchoolAndSubject(@Param("school") String school, 
                                                    @Param("subjectName") String subjectName);

                                                     // Add this method for count
    @Query("SELECT COUNT(ts) FROM TuteeSubjectEntity ts WHERE ts.tutee.tuteeId = :tuteeId")
    Long countByTutee_TuteeId(@Param("tuteeId") Long tuteeId);
}