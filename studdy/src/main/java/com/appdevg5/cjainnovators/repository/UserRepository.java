package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    
    Optional<UserEntity> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM UserEntity u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    List<UserEntity> findByNameContaining(@Param("name") String name);
    
    List<UserEntity> findByActiveTrue();
    
    long countByActiveTrue();
}