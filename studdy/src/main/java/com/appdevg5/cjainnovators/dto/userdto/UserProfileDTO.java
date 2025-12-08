package com.appdevg5.cjainnovators.dto.userdto;

import java.util.List;
import java.util.Map;

import com.appdevg5.cjainnovators.dto.tuteedto.TuteeDTO;
import com.appdevg5.cjainnovators.dto.tutordto.TutorDTO;
import com.appdevg5.cjainnovators.dto.tutorsubjectdto.TutorSubjectDTO;
import com.appdevg5.cjainnovators.dto.sessiondto.SessionDTO;
import com.appdevg5.cjainnovators.dto.subjectdto.SubjectDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private UserDTO user;
    private TutorDTO tutor;
    private TuteeDTO tutee;
    private List<TutorSubjectDTO> tutorSubjects;
    private List<SessionDTO> sessions;
    private List<SubjectDTO> availableSubjects;
    
    @Builder.Default
    private Map<String, Object> stats = Map.of();
}
