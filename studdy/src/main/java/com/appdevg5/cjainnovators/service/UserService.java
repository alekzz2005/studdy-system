package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.tuteedto.CreateTuteeDTO;
import com.appdevg5.cjainnovators.dto.tutordto.CreateTutorDTO;
import com.appdevg5.cjainnovators.dto.userdto.*;
import com.appdevg5.cjainnovators.entity.UserEntity;
import com.appdevg5.cjainnovators.repository.UserRepository;

import lombok.Builder;
import lombok.Data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TutorService tutorService;

    @Autowired
    private TuteeService tuteeService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Helper method to convert UserEntity to UserDTO
    private UserDTO convertToDTO(UserEntity user) {
        return UserDTO.builder()
            .userId(user.getUserId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phoneNumber(user.getPhoneNumber())
            .dateOfBirth(user.getDateOfBirth())
            .address(user.getAddress())
            .bio(user.getBio())
            .school(user.getSchool())
            .gradeLevel(user.getGradeLevel())
            .major(user.getMajor())
            .dateStarted(user.getDateStarted())
            .type(user.getType())
            .active(user.isActive())
            .build();
    }
    
    // Helper method to convert CreateUserDTO to UserEntity
    private UserEntity convertToEntity(CreateUserDTO dto) {
        return UserEntity.builder()
            .firstName(dto.getFirstName())
            .lastName(dto.getLastName())
            .email(dto.getEmail())
            .password(passwordEncoder.encode(dto.getPassword())) // Encrypt password
            .phoneNumber(dto.getPhoneNumber())
            .dateOfBirth(dto.getDateOfBirth())
            .address(dto.getAddress())
            .bio(dto.getBio())
            .school(dto.getSchool())
            .gradeLevel(dto.getGradeLevel())
            .major(dto.getMajor())
            .type(dto.getType())
            .dateStarted(dto.getDateStarted())
            .active(true) // Default to active
            .build();
    }
    
    // Create new user
    public UserDTO createUser(CreateUserDTO createUserDTO) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(createUserDTO.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists: " + createUserDTO.getEmail());
        }
        
        UserEntity userEntity = convertToEntity(createUserDTO);
        UserEntity savedUser = userRepository.save(userEntity);

        // Automatically create tutor/tutee profile based on user type
        if ("TUTOR".equalsIgnoreCase(savedUser.getType())) {
            createTutorProfile(savedUser.getUserId());
        } else if ("TUTEE".equalsIgnoreCase(savedUser.getType())) {
            createTuteeProfile(savedUser.getUserId());
        }
        
        return convertToDTO(savedUser);
    }
    
    // Get user by ID
    public UserDTO getUserById(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        
        return convertToDTO(userEntity);
    }
    
    // Get user by email
    public UserDTO getUserByEmail(String email) {
        UserEntity userEntity = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return convertToDTO(userEntity);
    }
    
    // Get all users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Update user
    public UserDTO updateUser(Long userId, UpdateUserDTO updateUserDTO) {
        UserEntity userEntity = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        
        // Update fields if they are provided in the DTO
        if (updateUserDTO.getFirstName() != null) {
            userEntity.setFirstName(updateUserDTO.getFirstName());
        }
        if (updateUserDTO.getLastName() != null) {
            userEntity.setLastName(updateUserDTO.getLastName());
        }
        if (updateUserDTO.getPhoneNumber() != null) {
            userEntity.setPhoneNumber(updateUserDTO.getPhoneNumber());
        }
        if (updateUserDTO.getDateOfBirth() != null) {
            userEntity.setDateOfBirth(updateUserDTO.getDateOfBirth());
        }
        if (updateUserDTO.getAddress() != null) {
            userEntity.setAddress(updateUserDTO.getAddress());
        }
        if (updateUserDTO.getBio() != null) {
            userEntity.setBio(updateUserDTO.getBio());
        }
        if (updateUserDTO.getSchool() != null) {
            userEntity.setSchool(updateUserDTO.getSchool());
        }
        if (updateUserDTO.getGradeLevel() != 0) {
            userEntity.setGradeLevel(updateUserDTO.getGradeLevel());
        }
        if (updateUserDTO.getMajor() != null) {
            userEntity.setMajor(updateUserDTO.getMajor());
        }
        
        userEntity.setActive(updateUserDTO.isActive());
        
        UserEntity updatedUser = userRepository.save(userEntity);
        return convertToDTO(updatedUser);
    }
    
    // Delete user
    public void deleteUser(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
            
        userRepository.delete(userEntity);
    }
    
    // Authenticate user (login)
    public UserDTO authenticateUser(LoginDTO loginDTO) {
        UserEntity userEntity = userRepository.findByEmail(loginDTO.getEmail())
            .orElseThrow(() -> new NoSuchElementException("User not found with email: " + loginDTO.getEmail()));
        
        // Check if account is active
        if (!userEntity.isActive()) {
            throw new RuntimeException("User account is not active");
        }
        
        // Verify password
        if (!passwordEncoder.matches(loginDTO.getPassword(), userEntity.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        return convertToDTO(userEntity);
    }

    // Change password
    public void changePassword(Long userId, ChangePasswordDTO changePasswordDTO) {
        UserEntity userEntity = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        
        // Verify current password
        if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), userEntity.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Verify new passwords match
        if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }
        
        // Update password
        userEntity.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userRepository.save(userEntity);
    }
    
    // Search users by name
    public List<UserDTO> searchUsersByName(String name) {
        return userRepository.findByNameContaining(name).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Check if email exists
    public boolean checkEmailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
    
    // Simple validation for CreateUserDTO
    public boolean validateCreateUserDTO(CreateUserDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (dto.getFirstName() == null || dto.getFirstName().trim().isEmpty()) {
            throw new RuntimeException("First name is required");
        }
        if (dto.getLastName() == null || dto.getLastName().trim().isEmpty()) {
            throw new RuntimeException("Last name is required");
        }
        return true;
    }
    
    // Get user count statistics
    public UserStatsDTO getUserStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActiveTrue();
        
        return UserStatsDTO.builder()
            .totalUsers(totalUsers)
            .activeUsers(activeUsers)
            .inactiveUsers(totalUsers - activeUsers)
            .build();
    }

    public String generateToken(UserDTO user) {
        // Simple base64 token for testing
        String tokenData = user.getUserId() + ":" + user.getEmail() + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(tokenData.getBytes());
    }
    
    private void createTutorProfile(Long userId) {
        CreateTutorDTO tutorDTO = new CreateTutorDTO();
        tutorDTO.setUserId(userId);
        // Set default subjects or empty list
        tutorDTO.setSubjects(new ArrayList<>());
        tutorService.createTutor(tutorDTO);
    }

    private void createTuteeProfile(Long userId) {
        CreateTuteeDTO tuteeDTO = new CreateTuteeDTO();
        tuteeDTO.setUserId(userId);
        tuteeService.createTutee(tuteeDTO);
    }
    // Inner DTO for statistics
    @Data
    @Builder
    public static class UserStatsDTO {
        private long totalUsers;
        private long activeUsers;
        private long inactiveUsers;
    }
}