package com.appdevg5.cjainnovators.repository;

import com.appdevg5.cjainnovators.entity.SessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<SessionEntity, Long> {
    
    List<SessionEntity> findByTutor_TutorId(Long tutorId);
    
    List<SessionEntity> findByTutee_TuteeId(Long tuteeId);
    
    List<SessionEntity> findBySubject_SubjectId(Long subjectId);
    
    List<SessionEntity> findByStatus(String status);
    
    List<SessionEntity> findBySessionYearAndSessionMonthAndSessionDay(int year, int month, int day);
    
    List<SessionEntity> findBySessionYearAndSessionMonth(int year, int month);
    
    List<SessionEntity> findByRatingGreaterThanEqual(Float minRating);
    
    @Query("SELECT s FROM SessionEntity s WHERE s.tutor.tutorId = :tutorId AND s.sessionYear = :year AND s.sessionMonth = :month AND s.sessionDay = :day AND s.status != 'Cancelled'")
    List<SessionEntity> findTutorSessionsByDate(@Param("tutorId") Long tutorId, 
                                                @Param("year") int year, 
                                                @Param("month") int month, 
                                                @Param("day") int day);
    
    @Query("SELECT s FROM SessionEntity s WHERE s.tutor.tutorId = :tutorId AND s.tutee.tuteeId = :tuteeId")
    List<SessionEntity> findSessionsBetweenTutorAndTutee(@Param("tutorId") Long tutorId, 
                                                         @Param("tuteeId") Long tuteeId);
    
    @Query("SELECT s FROM SessionEntity s " +
           "WHERE s.tutor.user.school = :school")
    List<SessionEntity> findBySchool(@Param("school") String school);
    
    @Query("SELECT s FROM SessionEntity s " +
           "WHERE s.tutor.tutorId = :tutorId " +
           "AND s.status = 'Completed' " +
           "ORDER BY s.sessionYear DESC, s.sessionMonth DESC, s.sessionDay DESC")
    List<SessionEntity> findCompletedSessionsByTutor(@Param("tutorId") Long tutorId);
    
    @Query("SELECT s FROM SessionEntity s " +
           "WHERE s.tutee.tuteeId = :tuteeId " +
           "AND s.status = 'Completed' " +
           "ORDER BY s.sessionYear DESC, s.sessionMonth DESC, s.sessionDay DESC")
    List<SessionEntity> findCompletedSessionsByTutee(@Param("tuteeId") Long tuteeId);
    
    @Query("SELECT s FROM SessionEntity s " +
           "WHERE s.sessionYear = :year AND s.sessionMonth = :month AND s.sessionDay = :day " +
           "AND s.status NOT IN ('Cancelled', 'Completed')")
    List<SessionEntity> findActiveSessionsByDate(@Param("year") int year, 
                                                 @Param("month") int month, 
                                                 @Param("day") int day);
    
    @Query("SELECT s FROM SessionEntity s " +
           "WHERE s.tutor.tutorId = :tutorId " +
           "AND s.sessionYear = :year AND s.sessionMonth = :month " +
           "AND s.status = 'Completed'")
    List<SessionEntity> findMonthlyCompletedSessionsByTutor(@Param("tutorId") Long tutorId,
                                                            @Param("year") int year,
                                                            @Param("month") int month);                                                    
}