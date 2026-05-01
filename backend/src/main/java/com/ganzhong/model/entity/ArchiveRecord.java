package com.ganzhong.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "archive_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArchiveRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(name = "completed_at")
    private LocalDateTime completedAt = LocalDateTime.now();

    @Column(name = "total_powders")
    private Integer totalPowders = 0;

    @Column(name = "completed_powders")
    private Integer completedPowders = 0;

    @Column(length = 20)
    private String status = "done"; // done, partial

    @Column(name = "review_outcome")
    private String reviewOutcome; // 产出成果

    @Column(name = "review_issue")
    private String reviewIssue; // 抛出问题

    @Column(name = "total_time_planning")
    private Integer totalTimePlanning = 0; // 统筹阶段总时间（秒）

    @Column(name = "total_time_execution")
    private Integer totalTimeExecution = 0; // 执行阶段总时间（秒）

    @Column(name = "total_time_review")
    private Integer totalTimeReview = 0; // 复盘阶段总时间（秒）
}
