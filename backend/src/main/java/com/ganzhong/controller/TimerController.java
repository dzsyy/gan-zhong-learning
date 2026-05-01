package com.ganzhong.controller;

import com.ganzhong.model.entity.TimerRecord;
import com.ganzhong.model.dto.TimerRecordRequest;
import com.ganzhong.service.TimerRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/timer")
@RequiredArgsConstructor
public class TimerController {

    private final TimerRecordService timerRecordService;

    @GetMapping("/project/{projectId}")
    public List<TimerRecord> getByProject(@PathVariable Long projectId) {
        return timerRecordService.findByProjectId(projectId);
    }

    @PostMapping("/record")
    public TimerRecord record(@RequestBody TimerRecordRequest request) {
        return timerRecordService.record(
            request.getProjectId(),
            request.getPhase(),
            request.getDurationSeconds()
        );
    }
}
