package com.ganzhong.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "outcome_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutcomeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id")
    private Long projectId; // 可为空，表示全局历史记录

    @Column(nullable = false, length = 10)
    private String type; // "outcome" 产出成果, "issue" 抛出问题

    @Column(nullable = false, length = 500)
    private String content; // 内容

    @Column(nullable = false)
    private Integer count = 1; // 出现次数，用于排序

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // 查找或创建记录，如果已存在则count+1
    public static OutcomeRecord of(String type, String content) {
        OutcomeRecord record = new OutcomeRecord();
        record.setType(type);
        record.setContent(content);
        record.setCount(1);
        return record;
    }
}