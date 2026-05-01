package com.ganzhong.controller;

import com.ganzhong.model.entity.PossibilityTask;
import com.ganzhong.service.PossibilityTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/possibility")
@RequiredArgsConstructor
public class PossibilityController {

    private final PossibilityTaskService possibilityTaskService;

    @GetMapping
    public List<PossibilityTask> getAll() {
        return possibilityTaskService.findAll();
    }

    @PostMapping
    public PossibilityTask create(@RequestBody Map<String, String> body) {
        return possibilityTaskService.create(body.get("title"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        possibilityTaskService.delete(id);
        return ResponseEntity.ok().build();
    }
}
