package com.ganzhong.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "recycle_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecycleTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(name = "original_location", length = 50)
    private String originalLocation; // 来源位置

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
