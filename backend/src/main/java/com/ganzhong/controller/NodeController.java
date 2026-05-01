package com.ganzhong.controller;

import com.ganzhong.model.dto.CreateNodeRequest;
import com.ganzhong.model.entity.Node;
import com.ganzhong.service.NodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NodeController {

    private final NodeService nodeService;

    @PostMapping("/projects/{projectId}/nodes")
    public Node createNode(@PathVariable Long projectId, @RequestBody CreateNodeRequest request) {
        request.setProjectId(projectId);
        return nodeService.create(request);
    }

    @GetMapping("/projects/{projectId}/nodes")
    public List<Node> getNodesByProject(@PathVariable Long projectId) {
        return nodeService.findByProjectId(projectId);
    }

    @PutMapping("/nodes/{id}")
    public Node update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        Integer sortOrder = (Integer) body.get("sortOrder");
        return nodeService.update(id, name, sortOrder);
    }

    @DeleteMapping("/nodes/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        nodeService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/nodes/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable Long id) {
        nodeService.complete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/nodes/{id}/uncomplete")
    public ResponseEntity<Void> uncomplete(@PathVariable Long id) {
        nodeService.uncomplete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/projects/{projectId}/nodes/batch")
    public List<Node> createNodesBatch(@PathVariable Long projectId, @RequestBody List<CreateNodeRequest> requests) {
        return nodeService.createBatch(requests);
    }
}
