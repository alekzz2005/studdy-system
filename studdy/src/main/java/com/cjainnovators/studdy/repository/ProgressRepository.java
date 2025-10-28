package com.cjainnovators.studdy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cjainnovators.studdy.entity.ProgressEntity;
import com.cjainnovators.studdy.entity.UserEntity;

import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<ProgressEntity, Integer> {
    
    // Find all progress records for a specific user
    List<ProgressEntity> findByUser(UserEntity user);
    
    // Find all progress records for a specific user ID
    List<ProgressEntity> findByUser_UserId(int userId);
    
    // Find progress records by subject ID
    List<ProgressEntity> findBySubjectId(int subjectId);
    
    // Find progress records for a specific user and subject
    List<ProgressEntity> findByUserAndSubjectId(UserEntity user, int subjectId);
    
    // Find progress records with progress percentage greater than specified value
    List<ProgressEntity> findByProgressPercentageGreaterThan(float progressPercentage);
    
    // Find progress records with progress percentage less than specified value
    List<ProgressEntity> findByProgressPercentageLessThan(float progressPercentage);
    
    // Custom query to find average progress percentage by user
    @Query("SELECT AVG(p.progressPercentage) FROM ProgressEntity p WHERE p.user.userId = :userId")
    Float findAverageProgressByUserId(@Param("userId") int userId);
    
    // Custom query to find progress records ordered by last updated (descending)
    List<ProgressEntity> findByUserOrderByLastUpdatedDesc(UserEntity user);
    
    // Find progress records by user ID ordered by progress percentage (descending)
    List<ProgressEntity> findByUser_UserIdOrderByProgressPercentageDesc(int userId);
}