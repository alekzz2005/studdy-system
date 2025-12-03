package com.appdevg5.cjainnovators.controller;

import com.appdevg5.cjainnovators.dto.subjectdto.*;
import com.appdevg5.cjainnovators.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:3000")
public class SubjectController {
    
    @Autowired
    private SubjectService subjectService;
    
    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }
    
    // ========== CREATE ==========
    
    @PostMapping
    public ResponseEntity<?> createSubject(@RequestBody CreateSubjectDTO createSubjectDTO) {
        try {
            SubjectDTO createdSubject = subjectService.createSubject(createSubjectDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSubject);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "success", false
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to create subject", "error", e.getMessage()));
        }
    }
    
    // ========== READ ==========
    
    @GetMapping
    public ResponseEntity<List<SubjectDTO>> getAllSubjects() {
        List<SubjectDTO> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubjectById(@PathVariable Long id) {
        try {
            SubjectDTO subject = subjectService.getSubjectById(id);
            return ResponseEntity.ok(subject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    @GetMapping("/name/{name}")
    public ResponseEntity<?> getSubjectByName(@PathVariable String name) {
        try {
            SubjectDTO subject = subjectService.getSubjectByName(name);
            return ResponseEntity.ok(subject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getSubjectCount() {
        long count = subjectService.getSubjectCount();
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @GetMapping("/exists/{id}")
    public ResponseEntity<Map<String, Boolean>> subjectExists(@PathVariable Long id) {
        boolean exists = subjectService.subjectExists(id);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
    
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Map<String, Boolean>> subjectExistsByName(@PathVariable String name) {
        boolean exists = subjectService.subjectExistsByName(name);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
    
    // ========== UPDATE ==========
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, 
                                           @RequestBody UpdateSubjectDTO updateSubjectDTO) {
        try {
            SubjectDTO updatedSubject = subjectService.updateSubject(id, updateSubjectDTO);
            return ResponseEntity.ok(updatedSubject);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> patchSubject(@PathVariable Long id, 
                                         @RequestBody UpdateSubjectDTO patchDTO) {
        try {
            SubjectDTO updatedSubject = subjectService.patchSubject(id, patchDTO);
            return ResponseEntity.ok(updatedSubject);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    // ========== DELETE ==========
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        try {
            subjectService.deleteSubject(id);
            return ResponseEntity.ok(Map.of(
                "message", "Subject deleted successfully",
                "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage(), "success", false));
        }
    }
}