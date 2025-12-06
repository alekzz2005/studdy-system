package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.TutorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TutorRepository extends JpaRepository<TutorEntity, Long> {
    
    Optional<TutorEntity> findByUser_UserId(Long userId);
    
    Optional<TutorEntity> findByUser_Email(String email);
    
    @Query("SELECT t FROM TutorEntity t WHERE t.averageRating >= :minRating")
    List<TutorEntity> findByMinRating(@Param("minRating") Float minRating);
    
    @Query("SELECT t FROM TutorEntity t WHERE t.user.active = true")
    List<TutorEntity> findAllActiveTutors();
}