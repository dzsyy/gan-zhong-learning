package com.ganzhong.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeDTO {
    private Long id;
    private Long projectId;
    private Long parentId;
    private String name;
    private Integer level;
    private String nodeType;
    private Integer sortOrder;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
}
