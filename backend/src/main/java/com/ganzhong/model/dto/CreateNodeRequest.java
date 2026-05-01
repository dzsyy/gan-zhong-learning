package com.ganzhong.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateNodeRequest {
    private Long projectId;
    private Long parentId;
    private String name;
    private Integer level;
    private String nodeType;
    private Integer sortOrder;
}
