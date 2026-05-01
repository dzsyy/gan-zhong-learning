package com.ganzhong.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "timer_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimerRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 20)
    private String phase; // planning, execution, review

    @Column(name = "duration_seconds")
    private Integer durationSeconds = 0;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();
}
