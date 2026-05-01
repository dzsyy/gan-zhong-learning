package com.ganzhong.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "possibility_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PossibilityTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
