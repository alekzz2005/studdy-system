package com.appdevg5.cjainnovators.controller;

import com.appdevg5.cjainnovators.dto.sessiondto.*;
import com.appdevg5.cjainnovators.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:3000")
public class SessionController {

    @Autowired
    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody CreateSessionDTO createSessionDTO) {
        try {
            SessionDTO session = sessionService.createSession(createSessionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "success", false
            ));
        }
    }

    // READ - Get by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getSessionById(@PathVariable Long id) {
        try {
            SessionDTO session = sessionService.getSessionById(id);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // READ - Get all
    @GetMapping
    public ResponseEntity<List<SessionDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    // READ - Get by tutor
    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<SessionDTO>> getSessionsByTutor(@PathVariable Long tutorId) {
        return ResponseEntity.ok(sessionService.getSessionsByTutorId(tutorId));
    }

    // READ - Get by tutee
    @GetMapping("/tutee/{tuteeId}")
    public ResponseEntity<List<SessionDTO>> getSessionsByTutee(@PathVariable Long tuteeId) {
        return ResponseEntity.ok(sessionService.getSessionsByTuteeId(tuteeId));
    }

    // READ - Get by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SessionDTO>> getSessionsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(sessionService.getSessionsByStatus(status));
    }

    // READ - Get by date
    @GetMapping("/date/{year}/{month}/{day}")
    public ResponseEntity<List<SessionDTO>> getSessionsByDate(
            @PathVariable int year,
            @PathVariable int month,
            @PathVariable int day) {
        return ResponseEntity.ok(sessionService.getSessionsByDate(year, month, day));
    }

    // READ - Get by month
    @GetMapping("/month/{year}/{month}")
    public ResponseEntity<List<SessionDTO>> getSessionsByMonth(
            @PathVariable int year,
            @PathVariable int month) {
        return ResponseEntity.ok(sessionService.getSessionsByMonth(year, month));
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSession(
            @PathVariable Long id,
            @RequestBody UpdateSessionDTO updateSessionDTO) {
        try {
            SessionDTO updatedSession = sessionService.updateSession(id, updateSessionDTO);
            return ResponseEntity.ok(updatedSession);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // UPDATE status only
    @PatchMapping("/status/{id}")
    public ResponseEntity<?> updateSessionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            SessionDTO updatedSession = sessionService.updateSessionStatus(id, status);
            return ResponseEntity.ok(updatedSession);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // UPDATE rating
    @PatchMapping("/rating/{id}")
    public ResponseEntity<?> addSessionRating(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Float rating = Float.parseFloat(request.get("rating").toString());
            String feedback = (String) request.get("feedback");
            
            SessionDTO updatedSession = sessionService.addSessionRating(id, rating, feedback);
            return ResponseEntity.ok(updatedSession);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        try {
            sessionService.deleteSession(id);
            return ResponseEntity.ok(Map.of(
                "message", "Session deleted successfully",
                "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
}