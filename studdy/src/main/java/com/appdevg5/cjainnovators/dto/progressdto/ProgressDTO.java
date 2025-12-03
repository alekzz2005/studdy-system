package com.appdevg5.cjainnovators.dto.progressdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressDTO {
    private Long progressId;
    private Long sessionId;
    private Long tuteeSubjectId;
    private List<String> topicsCovered;
}