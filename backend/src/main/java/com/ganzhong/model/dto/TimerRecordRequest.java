package com.ganzhong.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimerRecordRequest {
    private Long projectId;
    private String phase;
    private Integer durationSeconds;
}
