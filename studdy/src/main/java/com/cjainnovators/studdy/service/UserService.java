package com.cjainnovators.studdy.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cjainnovators.studdy.entity.UserEntity;
import com.cjainnovators.studdy.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserService() {}
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //Create / Post
    public UserEntity postUser(UserEntity user) {
        return userRepository.save(user);
    }

    //Read / Get
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    //Update / Put
    @SuppressWarnings("finally")
    public UserEntity updateUser(int userId, UserEntity user) {
        UserEntity existingUser = new UserEntity();
        try {
            existingUser = userRepository.findById(userId).get();
            existingUser.setFirstName(user.getFirstName());
            existingUser.setMiddleInitial(user.getMiddleInitial());
            existingUser.setLastName(user.getLastName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPhoneNumber(user.getPhoneNumber());
            existingUser.setAddress(user.getAddress());
            existingUser.setBio(user.getBio());
            existingUser.setSchool(user.getSchool());
            existingUser.setGradeLevel(user.getGradeLevel());
            existingUser.setMajor(user.getMajor());
            existingUser.setLearningGoals(user.getLearningGoals());
            existingUser.setSessionsCompleted(user.getSessionsCompleted());
            existingUser.setHoursStudied(user.getHoursStudied());
            existingUser.setHoursTutored(user.getHoursTutored());
            existingUser.setAverageRating(user.getAverageRating());
        } catch (NoSuchElementException e){
            throw new NoSuchElementException("User with ID " + userId + " does not exist.");
        } finally {
            return userRepository.save(existingUser);
        }
    }

    //Delete
    public String deleteUser(int userId) {
        String msg = "";
        
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            msg = "User with ID " + userId + " was successfully deleted.";
        } else {
            msg = "User with ID " + userId + " does not exist.";
        }

        return msg;
    }

    // Add this method to UserService class
    public UserEntity getUserById(int userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User with ID " + userId + " does not exist."));
    }
}