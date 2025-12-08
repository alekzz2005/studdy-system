package com.appdevg5.cjainnovators.service;

import com.appdevg5.cjainnovators.dto.sessiondto.SessionDTO;
import com.appdevg5.cjainnovators.dto.subjectdto.SubjectDTO;
import com.appdevg5.cjainnovators.dto.tuteedto.CreateTuteeDTO;
import com.appdevg5.cjainnovators.dto.tuteedto.TuteeDTO;
import com.appdevg5.cjainnovators.dto.tutordto.CreateTutorDTO;
import com.appdevg5.cjainnovators.dto.tutordto.TutorDTO;
import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectDTO;
import com.appdevg5.cjainnovators.dto.userdto.*;
import com.appdevg5.cjainnovators.entity.UserEntity;
import com.appdevg5.cjainnovators.repository.UserRepository;

import lombok.Builder;
import lombok.Data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
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
    private TutorSubjectService tutorSubjectService;

    @Autowired
    private TuteeService tuteeService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private SessionService sessionService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get user profile with all related data
    public UserProfileDTO getUserProfile(Long userId) {
        // Get basic user info
        UserEntity userEntity = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        
        UserDTO userDTO = convertToDTO(userEntity);
        TutorDTO tutorData = null;
        TuteeDTO tuteeData = null;
        List<TutorSubjectDTO> tutorSubjects = new ArrayList<>();
        List<SubjectDTO> availableSubjects = new ArrayList<>();
        List<SessionDTO> sessions = new ArrayList<>();
        
        // Get tutor or tutee data based on user type
        if ("TUTOR".equalsIgnoreCase(userEntity.getType())) {
            try {
                tutorData = tutorService.getTutorByUserId(userId);
                
                // Get tutor subjects if tutor exists
                if (tutorData != null) {
                    try {
                        Object tutorId = getTutorIdFromTutorData(tutorData);
                        if (tutorId != null) {
                            tutorSubjects = tutorSubjectService.getSubjectsByTutorId((Long) tutorId);
                            
                            // Get available subjects (all subjects minus tutor's subjects)
                            List<SubjectDTO> allSubjects = subjectService.getAllSubjects();
                            List<Long> tutorSubjectIds = tutorSubjects.stream()
                                .map(subject -> getSubjectIdFromTutorSubject(subject))
                                .collect(Collectors.toList());
                            
                            availableSubjects = allSubjects.stream()
                                .filter(subject -> !tutorSubjectIds.contains(getSubjectIdFromSubject(subject)))
                                .collect(Collectors.toList());
                            
                            // Get tutor sessions
                            sessions = sessionService.getSessionsByTutorId((Long) tutorId);
                        }
                    } catch (Exception e) {
                        System.out.println("Error fetching tutor-related data: " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.out.println("No tutor profile found for user: " + userId);
            }
        } else if ("TUTEE".equalsIgnoreCase(userEntity.getType()) || "STUDENT".equalsIgnoreCase(userEntity.getType())) {
            try {
                tuteeData = tuteeService.getTuteeByUserId(userId);
                
                // Get tutee sessions if tutee exists
                if (tuteeData != null) {
                    try {
                        Object tuteeId = getTuteeIdFromTuteeData(tuteeData);
                        if (tuteeId != null) {
                            sessions = sessionService.getSessionsByTuteeId((Long) tuteeId);
                        }
                    } catch (Exception e) {
                        System.out.println("Error fetching tutee sessions: " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.out.println("No tutee profile found for user: " + userId);
            }
        }
        
        // Create profile completion stats
        Map<String, Object> stats = Map.of(
            "profileCompletion", calculateProfileCompletion(userEntity),
            "totalSessions", sessions.size(),
            "activeSessions", countActiveSessions(sessions)
        );
        
        return UserProfileDTO.builder()
            .user(userDTO)
            .tutor(tutorData)
            .tutee(tuteeData)
            .tutorSubjects(tutorSubjects)
            .sessions(sessions)
            .availableSubjects(availableSubjects)
            .stats(stats)
            .build();
    }
    
    // Helper method to get tutor ID from tutor data
    private Long getTutorIdFromTutorData(Object tutorData) {
        try {
            if (tutorData instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) tutorData;
                Object tutorId = map.get("tutorId");
                if (tutorId instanceof Number) {
                    return ((Number) tutorId).longValue();
                }
            }
            // Try reflection or other methods based on your actual TutorDTO class
            return null;
        } catch (Exception e) {
            return null;
        }
    }
    
    // Helper method to get subject ID from tutor subject
    private Long getSubjectIdFromTutorSubject(Object tutorSubject) {
        try {
            if (tutorSubject instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) tutorSubject;
                Object subject = map.get("subject");
                if (subject instanceof Map) {
                    Map<?, ?> subjectMap = (Map<?, ?>) subject;
                    Object subjectId = subjectMap.get("subjectId");
                    if (subjectId instanceof Number) {
                        return ((Number) subjectId).longValue();
                    }
                }
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
    
    // Helper method to get subject ID from subject
    private Long getSubjectIdFromSubject(Object subject) {
        try {
            if (subject instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) subject;
                Object subjectId = map.get("subjectId");
                if (subjectId instanceof Number) {
                    return ((Number) subjectId).longValue();
                }
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
    
    // Helper method to get tutee ID from tutee data
    private Long getTuteeIdFromTuteeData(Object tuteeData) {
        try {
            if (tuteeData instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) tuteeData;
                Object tuteeId = map.get("tuteeId");
                if (tuteeId instanceof Number) {
                    return ((Number) tuteeId).longValue();
                }
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
    
    // Calculate profile completion percentage
    private int calculateProfileCompletion(UserEntity user) {
        int totalFields = 10;
        int completedFields = 0;
        
        if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) completedFields++;
        if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) completedFields++;
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) completedFields++;
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().trim().isEmpty()) completedFields++;
        if (user.getDateOfBirth() != null) completedFields++;
        if (user.getAddress() != null && !user.getAddress().trim().isEmpty()) completedFields++;
        if (user.getSchool() != null && !user.getSchool().trim().isEmpty()) completedFields++;
        if (user.getGradeLevel() != 0) completedFields++;
        if (user.getMajor() != null && !user.getMajor().trim().isEmpty()) completedFields++;
        if (user.getBio() != null && !user.getBio().trim().isEmpty()) completedFields++;
        
        return (int) Math.round((completedFields / (double) totalFields) * 100);
    }
    
    // Count active sessions
    private int countActiveSessions(List<SessionDTO> sessions) {
        int count = 0;
        for (SessionDTO session : sessions) {
            if (session instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) session;
                Object status = map.get("status");
                if ("Confirmed".equals(status) || "Pending".equals(status)) {
                    count++;
                }
            }
        }
        return count;
    }
    
    // Update user profile (comprehensive update)
    public UserDTO updateUserProfile(Long userId, UpdateUserDTO updateUserDTO) {
        UserEntity userEntity = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        
        // Update all fields if provided
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
        
        // Only update active status if provided
        if (updateUserDTO.isActive() != userEntity.isActive()) {
            userEntity.setActive(updateUserDTO.isActive());
        }
        
        UserEntity updatedUser = userRepository.save(userEntity);
        return convertToDTO(updatedUser);
    }
    
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
            .dateStarted(LocalDate.now()) // Set to current date automatically
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