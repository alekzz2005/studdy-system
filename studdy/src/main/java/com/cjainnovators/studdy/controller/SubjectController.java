package com.cjainnovators.studdy.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cjainnovators.studdy.entity.SubjectEntity;
import com.cjainnovators.studdy.service.SubjectService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/subject/api")
public class SubjectController {
    @Autowired
    private SubjectService subjectService;

    public SubjectController() {}
    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping("/createSubject")
    public SubjectEntity insertSubject(@RequestBody SubjectEntity subject) {
        return subjectService.createSubject(subject);
    }

    @GetMapping("/getAllSubjects")
    public List<SubjectEntity> getAllSubjects() {
        return subjectService.getAllSubjects();
    }
    
    @PutMapping("/updateSubject")
    public SubjectEntity updateSubject(@RequestParam int subjectId, @RequestBody SubjectEntity subject) {
        return subjectService.updateSubject(subjectId, subject);
    }

    @DeleteMapping("/deleteSubject/{subjectId}")
    public String deleteSubject(@PathVariable int subjectId) {
        return subjectService.deleteSubject(subjectId);
    }
}