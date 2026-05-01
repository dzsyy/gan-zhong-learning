package com.ganzhong.controller;

import com.ganzhong.model.entity.InboxTask;
import com.ganzhong.service.InboxTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inbox")
@RequiredArgsConstructor
public class InboxController {

    private final InboxTaskService inboxTaskService;

    @GetMapping
    public List<InboxTask> getAll() {
        return inboxTaskService.findAll();
    }

    @PostMapping
    public InboxTask create(@RequestBody Map<String, String> body) {
        return inboxTaskService.create(body.get("title"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inboxTaskService.delete(id);
        return ResponseEntity.ok().build();
    }
}
