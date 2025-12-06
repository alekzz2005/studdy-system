package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.TuteeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TuteeRepository extends JpaRepository<TuteeEntity, Long> {
    
    Optional<TuteeEntity> findByUser_UserId(Long userId);
    
    Optional<TuteeEntity> findByUser_Email(String email);
    
    @Query("SELECT t FROM TuteeEntity t WHERE t.hoursStudied >= :minHours")
    List<TuteeEntity> findByMinHoursStudied(@Param("minHours") int minHours);
    
    @Query("SELECT t FROM TuteeEntity t WHERE t.user.active = true")
    List<TuteeEntity> findAllActiveTutees();
    
    @Query("SELECT t FROM TuteeEntity t ORDER BY t.hoursStudied DESC")
    List<TuteeEntity> findAllOrderByHoursStudiedDesc();
    
    @Query("SELECT t FROM TuteeEntity t " +
           "WHERE t.user.school = :school")
    List<TuteeEntity> findBySchool(@Param("school") String school);
    
    @Query("SELECT t FROM TuteeEntity t " +
           "WHERE t.user.gradeLevel = :gradeLevel")
    List<TuteeEntity> findByGradeLevel(@Param("gradeLevel") int gradeLevel);
}