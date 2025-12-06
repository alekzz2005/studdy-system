package com.appdevg5.cjainnovators.controller;

import com.appdevg5.cjainnovators.dto.tutorsubjectdto.*;
import com.appdevg5.cjainnovators.service.TutorSubjectService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tutor-subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TutorSubjectController {
    
    private final TutorSubjectService tutorSubjectService;

    // CREATE
    @PostMapping
    public ResponseEntity<?> createTutorSubject(@RequestBody CreateTutorSubjectDTO createDTO) {
        try {
            TutorSubjectDTO created = tutorSubjectService.createTutorSubject(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "success", false
            ));
        }
    }

    // READ - Get all
    @GetMapping
    public ResponseEntity<List<TutorSubjectDTO>> getAllTutorSubjects() {
        return ResponseEntity.ok(tutorSubjectService.getAllTutorSubjects());
    }

    // READ - Get by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getTutorSubjectById(@PathVariable Long id) {
        try {
            TutorSubjectDTO tutorSubject = tutorSubjectService.getTutorSubjectById(id);
            return ResponseEntity.ok(tutorSubject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // READ - Get by tutor ID
    @GetMapping("/get-tutor/{tutorId}")
    public ResponseEntity<List<TutorSubjectDTO>> getSubjectsByTutorId(@PathVariable Long tutorId) {
        return ResponseEntity.ok(tutorSubjectService.getSubjectsByTutorId(tutorId));
    }

    // READ - Get by subject ID
    @GetMapping("/get-subject/{subjectId}")
    public ResponseEntity<List<TutorSubjectDTO>> getTutorsBySubjectId(@PathVariable Long subjectId) {
        return ResponseEntity.ok(tutorSubjectService.getTutorsBySubjectId(subjectId));
    }

    // DELETE
    @DeleteMapping("/delete-tutor/{id}")
    public ResponseEntity<?> deleteTutorSubject(@PathVariable Long id) {
        try {
            tutorSubjectService.deleteTutorSubject(id);
            return ResponseEntity.ok(Map.of(
                "message", "Tutor-subject association deleted successfully",
                "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Check existence
    @GetMapping("/exists")
    public ResponseEntity<Map<String, Boolean>> existsByTutorAndSubject(
            @RequestParam Long tutorId, 
            @RequestParam Long subjectId) {
        boolean exists = tutorSubjectService.existsByTutorAndSubject(tutorId, subjectId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}