package com.ganzhong.controller;

import com.ganzhong.model.entity.ExecutionTask;
import com.ganzhong.service.ExecutionTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/execution")
@RequiredArgsConstructor
public class ExecutionController {

    private final ExecutionTaskService executionTaskService;

    @GetMapping
    public List<ExecutionTask> getAll() {
        return executionTaskService.findAll();
    }

    @PostMapping
    public ExecutionTask create(@RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String source = (String) body.get("source");
        Long projectId = body.get("projectId") != null ? ((Number) body.get("projectId")).longValue() : null;
        return executionTaskService.create(title, source, projectId);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable Long id) {
        executionTaskService.complete(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        executionTaskService.delete(id);
        return ResponseEntity.ok().build();
    }
}
