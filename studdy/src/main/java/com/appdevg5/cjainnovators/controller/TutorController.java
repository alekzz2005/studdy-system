package com.appdevg5.cjainnovators.controller;

import com.appdevg5.cjainnovators.dto.tutordto.*;
import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectDTO;
import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectRequestDTO;
import com.appdevg5.cjainnovators.service.TutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tutors")
@CrossOrigin(origins = "http://localhost:3000")
public class TutorController {
    
    @Autowired
    private TutorService tutorService;
    
    @PostMapping
    public ResponseEntity<?> createTutor(@RequestBody CreateTutorDTO createTutorDTO) {
        try {
            TutorDTO tutor = tutorService.createTutor(createTutorDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(tutor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "success", false
            ));
        }
    }
    
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getTutorById(@PathVariable Long id) {
        try {
            TutorDTO tutor = tutorService.getTutorById(id);
            return ResponseEntity.ok(tutor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTutorByUserId(@PathVariable Long userId) {
        try {
            TutorDTO tutor = tutorService.getTutorByUserId(userId);
            return ResponseEntity.ok(tutor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<TutorDTO>> getAllTutors() {
        return ResponseEntity.ok(tutorService.getAllTutors());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTutor(@PathVariable Long id, @RequestBody UpdateTutorDTO updateTutorDTO) {
        try {
            TutorDTO updatedTutor = tutorService.updateTutor(id, updateTutorDTO);
            return ResponseEntity.ok(updatedTutor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTutor(@PathVariable Long id) {
        try {
            String message = tutorService.deleteTutor(id);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/subjects/{id}")
    public ResponseEntity<?> addSubjectToTutor(
            @PathVariable Long id, 
            @RequestBody TutorSubjectRequestDTO subjectRequest) {
        try {
            TutorSubjectDTO addedSubject = tutorService.addSubjectToTutor(id, subjectRequest);
            return ResponseEntity.ok(addedSubject);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{tutorId}/subjects/{subjectId}")
    public ResponseEntity<?> removeSubjectFromTutor(
            @PathVariable Long tutorId, 
            @PathVariable Long subjectId) {
        try {
            tutorService.removeSubjectFromTutor(tutorId, subjectId);
            return ResponseEntity.ok(Map.of("message", "Subject removed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
}