package com.ganzhong.controller;

import com.ganzhong.model.dto.CreateProjectRequest;
import com.ganzhong.model.dto.ProjectDTO;
import com.ganzhong.model.entity.ArchiveRecord;
import com.ganzhong.model.entity.Project;
import com.ganzhong.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<ProjectDTO> getAll() {
        return projectService.findAll();
    }

    @GetMapping("/{id}")
    public ProjectDTO getById(@PathVariable Long id) {
        return projectService.findById(id);
    }

    @PostMapping
    public Project create(@RequestBody CreateProjectRequest request) {
        return projectService.create(request);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String stage = (String) body.get("stage");
        Integer progress = (Integer) body.get("progress");
        Integer totalPowders = (Integer) body.get("totalPowders");
        Integer completedPowders = (Integer) body.get("completedPowders");

        // 检查是否只更新时间字段
        if (name == null && stage == null && progress == null && totalPowders == null && completedPowders == null) {
            return projectService.updateFields(id, body);
        }
        return projectService.update(id, name, stage, progress, totalPowders, completedPowders);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/advance-stage")
    public Project advanceStage(@PathVariable Long id) {
        return projectService.advanceStage(id);
    }

    @GetMapping("/active")
    public Project getActiveProject() {
        return projectService.getActiveProject();
    }

    @PostMapping("/{id}/archive")
    public ArchiveRecord archiveProject(@PathVariable Long id) {
        return projectService.archiveProject(id);
    }
}
