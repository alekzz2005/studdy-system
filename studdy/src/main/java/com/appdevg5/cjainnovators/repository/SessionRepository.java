package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.SessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<SessionEntity, Long> {
    
    List<SessionEntity> findByTutor_TutorId(Long tutorId);
    
    List<SessionEntity> findByTutee_TuteeId(Long tuteeId);
    
    List<SessionEntity> findBySubject_SubjectId(Long subjectId);
    
    List<SessionEntity> findByStatus(String status);
    
    List<SessionEntity> findBySessionDate(LocalDate sessionDate);
    
    List<SessionEntity> findBySessionDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<SessionEntity> findByRatingGreaterThanEqual(Float minRating);
    
    @Query("SELECT s FROM SessionEntity s WHERE s.tutor.tutorId = :tutorId AND s.sessionDate = :date AND s.status != 'CANCELLED'")
    List<SessionEntity> findTutorSessionsByDate(@Param("tutorId") Long tutorId, @Param("date") LocalDate date);
    
    @Query("SELECT s FROM SessionEntity s WHERE s.tutor.tutorId = :tutorId AND s.tutee.tuteeId = :tuteeId")
    List<SessionEntity> findSessionsBetweenTutorAndTutee(@Param("tutorId") Long tutorId, 
                                                         @Param("tuteeId") Long tuteeId);
    
    @Query("SELECT s FROM SessionEntity s WHERE s.sessionDate = :date AND s.startTime <= :time AND s.endTime >= :time")
    List<SessionEntity> findOngoingSessions(@Param("date") LocalDate date, 
                                            @Param("time") LocalTime time);
    
    @Query("SELECT s FROM SessionEntity s WHERE s.sessionDate >= :startDate AND s.sessionDate <= :endDate")
    List<SessionEntity> findSessionsInDateRange(@Param("startDate") LocalDate startDate, 
                                                @Param("endDate") LocalDate endDate);
    
    @Query("SELECT s FROM SessionEntity s WHERE s.tutor.user.school = :school")
    List<SessionEntity> findBySchool(@Param("school") String school);
    
    @Query("SELECT s FROM SessionEntity s " +
           "WHERE s.tutor.tutorId = :tutorId " +
           "AND s.status = 'COMPLETED' " +
           "ORDER BY s.sessionDate DESC")
    List<SessionEntity> findCompletedSessionsByTutor(@Param("tutorId") Long tutorId);
    
    @Query("SELECT s FROM SessionEntity s " +
           "WHERE s.tutee.tuteeId = :tuteeId " +
           "AND s.status = 'COMPLETED' " +
           "ORDER BY s.sessionDate DESC")
    List<SessionEntity> findCompletedSessionsByTutee(@Param("tuteeId") Long tuteeId);
    
    @Query("SELECT s FROM SessionEntity s " +
           "WHERE s.sessionDate = :date " +
           "AND ((s.startTime BETWEEN :startTime AND :endTime) " +
           "OR (s.endTime BETWEEN :startTime AND :endTime) " +
           "OR (:startTime BETWEEN s.startTime AND s.endTime) " +
           "OR (:endTime BETWEEN s.startTime AND s.endTime))")
    List<SessionEntity> findOverlappingSessions(@Param("date") LocalDate date,
                                                @Param("startTime") LocalTime startTime,
                                                @Param("endTime") LocalTime endTime);
    
    @Query("SELECT s FROM SessionEntity s " +
           "WHERE s.tutor.tutorId = :tutorId " +
           "AND s.sessionDate >= :startDate " +
           "AND s.status = 'COMPLETED'")
    List<SessionEntity> findCompletedSessionsByTutorAfterDate(@Param("tutorId") Long tutorId,
                                                              @Param("startDate") LocalDate startDate);
    
    @Query("SELECT AVG(s.rating) FROM SessionEntity s WHERE s.tutor.tutorId = :tutorId AND s.rating IS NOT NULL")
    Double calculateAverageRatingByTutor(@Param("tutorId") Long tutorId);
    
    @Query("SELECT SUM(s.duration) FROM SessionEntity s WHERE s.tutor.tutorId = :tutorId AND s.status = 'COMPLETED'")
    Integer calculateTotalDurationByTutor(@Param("tutorId") Long tutorId);
}