package com.ganzhong.controller;

import com.ganzhong.model.entity.OutcomeRecord;
import com.ganzhong.service.OutcomeRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/outcomes")
@RequiredArgsConstructor
public class OutcomeRecordController {

    private final OutcomeRecordService outcomeRecordService;

    @GetMapping
    public List<OutcomeRecord> getAll() {
        return outcomeRecordService.findAll();
    }

    @GetMapping("/history")
    public List<OutcomeRecord> getHistory(@RequestParam String type) {
        if ("outcome".equals(type)) {
            return outcomeRecordService.getGlobalOutcomes();
        } else if ("issue".equals(type)) {
            return outcomeRecordService.getGlobalIssues();
        }
        return List.of();
    }

    @PostMapping
    public OutcomeRecord create(@RequestBody Map<String, Object> body) {
        String type = (String) body.get("type");
        String content = (String) body.get("content");
        Long projectId = body.get("projectId") != null
            ? ((Number) body.get("projectId")).longValue()
            : null;

        if ("outcome".equals(type)) {
            return outcomeRecordService.addOutcome(content, projectId);
        } else if ("issue".equals(type)) {
            return outcomeRecordService.addIssue(content, projectId);
        }
        throw new IllegalArgumentException("Invalid type: " + type);
    }
}