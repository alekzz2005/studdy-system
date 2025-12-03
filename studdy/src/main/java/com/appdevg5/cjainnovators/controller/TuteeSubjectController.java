package com.appdevg5.cjainnovators.controller;

import com.appdevg5.cjainnovators.dto.tuteesubjectdto.*;
import com.appdevg5.cjainnovators.service.TuteeSubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tutee-subjects")
@CrossOrigin(origins = "http://localhost:3000")
public class TuteeSubjectController {

    private final TuteeSubjectService tuteeSubjectService;

    @Autowired
    public TuteeSubjectController(TuteeSubjectService tuteeSubjectService) {
        this.tuteeSubjectService = tuteeSubjectService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<?> createTuteeSubject(@RequestBody CreateTuteeSubjectDTO createDTO) {
        try {
            TuteeSubjectResponseDTO response = tuteeSubjectService.createTuteeSubject(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }

    // READ - Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTuteeSubjectById(@PathVariable Long id) {
        try {
            TuteeSubjectResponseDTO response = tuteeSubjectService.getTuteeSubjectById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }

    // READ - Get all
    @GetMapping
    public ResponseEntity<List<TuteeSubjectResponseDTO>> getAllTuteeSubjects() {
        List<TuteeSubjectResponseDTO> responses = tuteeSubjectService.getAllTuteeSubjects();
        return ResponseEntity.ok(responses);
    }

    // READ - Get by tutee ID
    @GetMapping("/tutee/{tuteeId}")
    public ResponseEntity<?> getTuteeSubjectsByTuteeId(@PathVariable Long tuteeId) {
        try {
            List<TuteeSubjectResponseDTO> responses = 
                tuteeSubjectService.getTuteeSubjectsByTuteeId(tuteeId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }

    // READ - Get by subject ID
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getTuteeSubjectsBySubjectId(@PathVariable Long subjectId) {
        try {
            List<TuteeSubjectResponseDTO> responses = 
                tuteeSubjectService.getTuteeSubjectsBySubjectId(subjectId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTuteeSubject(
            @PathVariable Long id,
            @RequestBody UpdateTuteeSubjectDTO updateDTO) {
        try {
            TuteeSubjectResponseDTO response = 
                tuteeSubjectService.updateTuteeSubject(id, updateDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTuteeSubject(@PathVariable Long id) {
        try {
            String message = tuteeSubjectService.deleteTuteeSubject(id);
            return ResponseEntity.ok(Map.of(
                    "message", message,
                    "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }

    // Additional endpoints
    @GetMapping("/check")
    public ResponseEntity<?> checkTuteeSubject(
            @RequestParam Long tuteeId,
            @RequestParam Long subjectId) {
        try {
            TuteeSubjectResponseDTO response = 
                tuteeSubjectService.getByTuteeAndSubject(tuteeId, subjectId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TuteeSubjectResponseDTO>> getByStatus(@PathVariable String status) {
        List<TuteeSubjectResponseDTO> responses = tuteeSubjectService.getByStatus(status);
        return ResponseEntity.ok(responses);
    }
}