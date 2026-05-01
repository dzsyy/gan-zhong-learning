package com.ganzhong.service;

import com.ganzhong.model.dto.CreateNodeRequest;
import com.ganzhong.model.entity.Node;
import com.ganzhong.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NodeService {

    private final NodeRepository nodeRepository;
    private final ProjectService projectService;

    public List<Node> findByProjectId(Long projectId) {
        return nodeRepository.findByProjectIdOrderByLevelAscSortOrderAsc(projectId);
    }

    public Node findById(Long id) {
        return nodeRepository.findById(id).orElse(null);
    }

    @Transactional
    public Node create(CreateNodeRequest request) {
        Node node = new Node();
        node.setProjectId(request.getProjectId());
        node.setParentId(request.getParentId());
        node.setName(request.getName());
        node.setLevel(request.getLevel());
        node.setNodeType(request.getNodeType());
        node.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
        node.setIsCompleted(false);
        Node saved = nodeRepository.save(node);

        // 更新项目粉末统计
        if (request.getLevel() == 4) {
            projectService.updateProgress(request.getProjectId());
        }

        return saved;
    }

    @Transactional
    public Node update(Long id, String name, Integer sortOrder) {
        return nodeRepository.findById(id).map(node -> {
            if (name != null) node.setName(name);
            if (sortOrder != null) node.setSortOrder(sortOrder);
            return nodeRepository.save(node);
        }).orElse(null);
    }

    @Transactional
    public void delete(Long id) {
        Node node = nodeRepository.findById(id).orElse(null);
        if (node != null) {
            Long projectId = node.getProjectId();
            nodeRepository.deleteById(id);
            // 更新项目粉末统计
            if (node.getLevel() == 4) {
                projectService.updateProgress(projectId);
            }
        }
    }

    @Transactional
    public void complete(Long id) {
        nodeRepository.findById(id).ifPresent(node -> {
            node.setIsCompleted(true);
            nodeRepository.save(node);
            if (node.getLevel() == 4) {
                projectService.updateProgress(node.getProjectId());
            }
        });
    }

    @Transactional
    public void uncomplete(Long id) {
        nodeRepository.findById(id).ifPresent(node -> {
            node.setIsCompleted(false);
            node.setCompletedAt(null);
            nodeRepository.save(node);
            if (node.getLevel() == 4) {
                projectService.updateProgress(node.getProjectId());
            }
        });
    }

    @Transactional
    public List<Node> createBatch(List<CreateNodeRequest> requests) {
        return requests.stream().map(request -> {
            Node node = new Node();
            node.setProjectId(request.getProjectId());
            node.setParentId(request.getParentId());
            node.setName(request.getName());
            node.setLevel(request.getLevel());
            node.setNodeType(request.getNodeType());
            node.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
            node.setIsCompleted(false);
            Node saved = nodeRepository.save(node);
            if (request.getLevel() == 4) {
                projectService.updateProgress(request.getProjectId());
            }
            return saved;
        }).collect(Collectors.toList());
    }
}
