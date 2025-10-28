package com.cjainnovators.studdy.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cjainnovators.studdy.entity.ProgressEntity;
import com.cjainnovators.studdy.entity.UserEntity;
import com.cjainnovators.studdy.repository.ProgressRepository;
import com.cjainnovators.studdy.repository.UserRepository;

@Service
public class ProgressService {
    
    @Autowired
    private ProgressRepository progressRepository;
    
    @Autowired
    private UserRepository userRepository;

    public ProgressService() {}
    
    public ProgressService(ProgressRepository progressRepository, UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    // Create / Post
    public ProgressEntity postProgress(ProgressEntity progress) {
        // Ensure the user exists
        if (progress.getUser() == null || progress.getUser().getUserId() == 0) {
            throw new IllegalArgumentException("User must be specified for progress tracking");
        }
        
        // Set last updated timestamp if not set
        if (progress.getLastUpdated() == null) {
            progress.setLastUpdated(LocalDateTime.now());
        }
        
        return progressRepository.save(progress);
    }

    // Create progress with user ID
    public ProgressEntity postProgressWithUserId(int userId, ProgressEntity progress) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User with ID " + userId + " does not exist."));
        
        progress.setUser(user);
        if (progress.getLastUpdated() == null) {
            progress.setLastUpdated(LocalDateTime.now());
        }
        
        return progressRepository.save(progress);
    }

    // Read / Get all progress records
    public List<ProgressEntity> getAllProgress() {
        return progressRepository.findAll();
    }

    // Get progress by ID
    public ProgressEntity getProgressById(int progressId) {
        return progressRepository.findById(progressId)
            .orElseThrow(() -> new NoSuchElementException("Progress record with ID " + progressId + " does not exist."));
    }

    // Get all progress records for a specific user
    public List<ProgressEntity> getProgressByUserId(int userId) {
        return progressRepository.findByUser_UserId(userId);
    }

    // Get progress records by subject ID
    public List<ProgressEntity> getProgressBySubjectId(int subjectId) {
        return progressRepository.findBySubjectId(subjectId);
    }

    // Get progress records for a specific user and subject
    public List<ProgressEntity> getProgressByUserAndSubject(int userId, int subjectId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User with ID " + userId + " does not exist."));
        
        return progressRepository.findByUserAndSubjectId(user, subjectId);
    }

    // Get average progress percentage for a user
    public Float getAverageProgressByUserId(int userId) {
        return progressRepository.findAverageProgressByUserId(userId);
    }

    // Update / Put
    public ProgressEntity updateProgress(int progressId, ProgressEntity progress) {
        ProgressEntity existingProgress = progressRepository.findById(progressId)
            .orElseThrow(() -> new NoSuchElementException("Progress record with ID " + progressId + " does not exist."));

        // Update fields if they are provided
        if (progress.getTopicsCovered() != null) {
            existingProgress.setTopicsCovered(progress.getTopicsCovered());
        }
        
        if (progress.getProgressPercentage() >= 0) {
            existingProgress.setProgressPercentage(progress.getProgressPercentage());
        }
        
        if (progress.getSubjectId() > 0) {
            existingProgress.setSubjectId(progress.getSubjectId());
        }
        
        // Always update the lastUpdated timestamp
        existingProgress.setLastUpdated(LocalDateTime.now());

        return progressRepository.save(existingProgress);
    }

    // Delete
    public String deleteProgress(int progressId) {
        if (progressRepository.existsById(progressId)) {
            progressRepository.deleteById(progressId);
            return "Progress record with ID " + progressId + " was successfully deleted.";
        } else {
            return "Progress record with ID " + progressId + " does not exist.";
        }
    }

    // Delete all progress records for a user
    public String deleteAllProgressByUserId(int userId) {
        List<ProgressEntity> userProgress = progressRepository.findByUser_UserId(userId);
        if (!userProgress.isEmpty()) {
            progressRepository.deleteAll(userProgress);
            return "All progress records for user ID " + userId + " were successfully deleted.";
        } else {
            return "No progress records found for user ID " + userId + ".";
        }
    }

    // Get progress records with high progress (above 75%)
    public List<ProgressEntity> getHighProgressRecords() {
        return progressRepository.findByProgressPercentageGreaterThan(75.0f);
    }

    // Get progress records with low progress (below 25%)
    public List<ProgressEntity> getLowProgressRecords() {
        return progressRepository.findByProgressPercentageLessThan(25.0f);
    }
}