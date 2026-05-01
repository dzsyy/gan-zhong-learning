package com.ganzhong.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 20)
    private String stage = "planning"; // planning, execution, review

    private Integer progress = 0;

    @Column(name = "total_powders")
    private Integer totalPowders = 0;

    @Column(name = "completed_powders")
    private Integer completedPowders = 0;

    @Column(name = "planning_time")
    private Integer planningTime = 0; // 阶段1拆解时间（秒）

    @Column(name = "execution_time")
    private Integer executionTime = 0; // 阶段2执行时间（秒）

    @Column(name = "review_time")
    private Integer reviewTime = 0; // 阶段3复盘时间（秒）

    @Column(name = "is_locked")
    private Boolean isLocked = false; // 思维导图是否锁定

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
