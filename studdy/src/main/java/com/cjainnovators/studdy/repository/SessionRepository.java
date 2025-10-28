package com.cjainnovators.studdy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cjainnovators.studdy.entity.SessionEntity;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<SessionEntity, Integer> {
    List<SessionEntity> findByTutorUserId(int tutorId);
    List<SessionEntity> findByTuteeUserId(int tuteeId);
    List<SessionEntity> findBySubjectSubjectId(int subjectId);
    List<SessionEntity> findBySessionDate(LocalDate sessionDate);
    List<SessionEntity> findByStatus(String status);
    List<SessionEntity> findByTutorUserIdAndStatus(int tutorId, String status);
    List<SessionEntity> findByTuteeUserIdAndStatus(int tuteeId, String status);
    List<SessionEntity> findBySessionDateBetween(LocalDate startDate, LocalDate endDate);
}