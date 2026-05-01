package com.ganzhong.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private String name;
    private String stage;
    private Integer progress;
    private Integer totalPowders;
    private Integer completedPowders;
    private Integer planningTime;
    private Integer executionTime;
    private Integer reviewTime;
    private Integer totalDuration;
    private Boolean isLocked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<NodeDTO> nodes;
}
