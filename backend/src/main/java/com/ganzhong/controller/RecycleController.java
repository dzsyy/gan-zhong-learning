package com.ganzhong.controller;

import com.ganzhong.model.entity.RecycleTask;
import com.ganzhong.service.RecycleTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recycle")
@RequiredArgsConstructor
public class RecycleController {

    private final RecycleTaskService recycleTaskService;

    @GetMapping
    public List<RecycleTask> getAll() {
        return recycleTaskService.findAll();
    }

    @PostMapping
    public RecycleTask create(@RequestBody Map<String, String> body) {
        return recycleTaskService.create(body.get("title"), body.get("originalLocation"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recycleTaskService.delete(id);
        return ResponseEntity.ok().build();
    }
}
