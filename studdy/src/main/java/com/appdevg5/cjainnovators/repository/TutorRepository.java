package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.TutorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TutorRepository extends JpaRepository<TutorEntity, Long> {
    
    Optional<TutorEntity> findByUser_UserId(Long userId);
    
    Optional<TutorEntity> findByUser_Email(String email);
    
    @Query("SELECT t FROM TutorEntity t WHERE t.averageRating >= :minRating")
    List<TutorEntity> findByMinRating(@Param("minRating") Float minRating);
    
    @Query("SELECT DISTINCT t FROM TutorEntity t " +
           "JOIN t.subjects ts " +
           "JOIN ts.subject s " +
           "WHERE LOWER(s.subjectName) LIKE LOWER(CONCAT('%', :subjectName, '%'))")
    List<TutorEntity> findBySubjectName(@Param("subjectName") String subjectName);
    
    @Query("SELECT t FROM TutorEntity t WHERE t.dateStarted >= :startDate")
    List<TutorEntity> findTutorsJoinedAfter(@Param("startDate") LocalDate startDate);
    
    @Query("SELECT t FROM TutorEntity t WHERE t.dateStarted BETWEEN :startDate AND :endDate")
    List<TutorEntity> findTutorsJoinedBetween(@Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT t FROM TutorEntity t WHERE t.user.active = true")
    List<TutorEntity> findAllActiveTutors();
    
    @Query("SELECT t FROM TutorEntity t " +
           "JOIN t.subjects ts " +
           "WHERE ts.isAvailable = true " +
           "GROUP BY t " +
           "HAVING COUNT(ts) > 0")
    List<TutorEntity> findTutorsWithAvailableSubjects();
    
    @Query("SELECT t FROM TutorEntity t " +
           "JOIN t.subjects ts " +
           "WHERE ts.proficiencyLevel >= :minProficiency")
    List<TutorEntity> findByMinProficiencyLevel(@Param("minProficiency") int minProficiency);
}