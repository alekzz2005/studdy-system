package com.cjainnovators.studdy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cjainnovators.studdy.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    public UserEntity findByFirstName(String firstName);
    public UserEntity findByLastName(String lastName);
    public UserEntity findByEmail(String email);
    public UserEntity findBySchool(String school);
    public UserEntity findByGradeLevel(int gradeLevel);
    public UserEntity findByMajor(String major);
}