package com.appdevg5.cjainnovators.dto.tuteedto;

import lombok.Data;
import java.util.List;

import com.appdevg5.cjainnovators.dto.tuteesubjectdto.TuteeSubjectDTO;

@Data
public class TuteeDTO {
    private Long tuteeId;
    private Long userId;
    private int hoursStudied;
    private List<TuteeSubjectDTO> subjects;
}


