package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.SubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<SubjectEntity, Long> {
    
    Optional<SubjectEntity> findBySubjectName(String subjectName);
    
    @Query("SELECT s FROM SubjectEntity s ORDER BY s.subjectName ASC")
    List<SubjectEntity> findAllOrderByName();
}