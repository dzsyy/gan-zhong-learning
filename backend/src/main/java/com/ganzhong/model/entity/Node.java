package com.ganzhong.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "nodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Node {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer level; // 1=根节点, 2=阶段, 3=节点, 4=粉末

    @Column(name = "node_type", length = 20)
    private String nodeType; // root, phase, node, powder

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
