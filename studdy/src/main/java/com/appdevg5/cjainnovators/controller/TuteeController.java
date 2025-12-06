package com.appdevg5.cjainnovators.controller;

import com.appdevg5.cjainnovators.dto.sessiondto.SessionDTO;
import com.appdevg5.cjainnovators.dto.tuteedto.*;
import com.appdevg5.cjainnovators.service.TuteeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tutees")
@CrossOrigin(origins = "http://localhost:3000")
public class TuteeController {
    
    @Autowired
    private final TuteeService tuteeService;
    
    public TuteeController(TuteeService tuteeService) {
        this.tuteeService = tuteeService;
    }
    
    @PostMapping
    public ResponseEntity<?> createTutee(@RequestBody CreateTuteeDTO createTuteeDTO) {
        try {
            TuteeDTO tutee = tuteeService.createTutee(createTuteeDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(tutee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "success", false
            ));
        }
    }
    
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getTuteeById(@PathVariable Long id) {
        try {
            TuteeDTO tutee = tuteeService.getTuteeById(id);
            return ResponseEntity.ok(tutee);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTuteeByUserId(@PathVariable Long userId) {
        try {
            TuteeDTO tutee = tuteeService.getTuteeByUserId(userId);
            return ResponseEntity.ok(tutee);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<TuteeDTO>> getAllTutees() {
        return ResponseEntity.ok(tuteeService.getAllTutees());
    }
    
    @GetMapping("/sessions/{id}")
    public ResponseEntity<List<SessionDTO>> getTuteeSessions(@PathVariable Long id) {
        List<SessionDTO> sessions = tuteeService.getTuteeSessions(id);
        return ResponseEntity.ok(sessions);
    }
}