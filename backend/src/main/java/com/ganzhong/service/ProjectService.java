package com.ganzhong.service;

import com.ganzhong.model.dto.CreateProjectRequest;
import com.ganzhong.model.dto.NodeDTO;
import com.ganzhong.model.dto.ProjectDTO;
import com.ganzhong.model.entity.ArchiveRecord;
import com.ganzhong.model.entity.Node;
import com.ganzhong.model.entity.OutcomeRecord;
import com.ganzhong.model.entity.Project;
import com.ganzhong.model.entity.TimerRecord;
import com.ganzhong.repository.NodeRepository;
import com.ganzhong.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final NodeRepository nodeRepository;
    private final ArchiveRecordService archiveRecordService;
    private final TimerRecordService timerRecordService;
    private final OutcomeRecordService outcomeRecordService;

    public List<ProjectDTO> findAll() {
        return projectRepository.findAll().stream().map(this::toProjectDTO).collect(Collectors.toList());
    }

    private ProjectDTO toProjectDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setStage(project.getStage());
        dto.setProgress(project.getProgress());
        dto.setTotalPowders(project.getTotalPowders());
        dto.setCompletedPowders(project.getCompletedPowders());
        dto.setPlanningTime(project.getPlanningTime());
        dto.setExecutionTime(project.getExecutionTime());
        dto.setReviewTime(project.getReviewTime());
        dto.setIsLocked(project.getIsLocked());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        // 计算总时长：从TimerRecord中汇总三个阶段的时长
        List<TimerRecord> timers = timerRecordService.findByProjectId(project.getId());
        int totalDuration = timers.stream().mapToInt(TimerRecord::getDurationSeconds).sum();
        dto.setTotalDuration(totalDuration);

        return dto;
    }

    public ProjectDTO findById(Long id) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) return null;

        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setStage(project.getStage());
        dto.setProgress(project.getProgress());
        dto.setTotalPowders(project.getTotalPowders());
        dto.setCompletedPowders(project.getCompletedPowders());
        dto.setPlanningTime(project.getPlanningTime());
        dto.setExecutionTime(project.getExecutionTime());
        dto.setReviewTime(project.getReviewTime());
        dto.setIsLocked(project.getIsLocked());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        // 计算总时长：从TimerRecord中汇总三个阶段的时长
        List<TimerRecord> timers = timerRecordService.findByProjectId(id);
        int totalDuration = timers.stream().mapToInt(TimerRecord::getDurationSeconds).sum();
        dto.setTotalDuration(totalDuration);

        // 获取节点树
        List<Node> nodes = nodeRepository.findByProjectIdOrderByLevelAscSortOrderAsc(id);
        dto.setNodes(nodes.stream().map(this::toNodeDTO).collect(Collectors.toList()));

        return dto;
    }

    @Transactional
    public Project create(CreateProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setStage("planning");
        project.setProgress(0);
        project.setTotalPowders(0);
        project.setCompletedPowders(0);
        return projectRepository.save(project);
    }

    @Transactional
    public Project update(Long id, String name, String stage, Integer progress, Integer totalPowders, Integer completedPowders) {
        return projectRepository.findById(id).map(project -> {
            if (name != null) project.setName(name);
            if (stage != null) project.setStage(stage);
            if (progress != null) project.setProgress(progress);
            if (totalPowders != null) project.setTotalPowders(totalPowders);
            if (completedPowders != null) project.setCompletedPowders(completedPowders);
            return projectRepository.save(project);
        }).orElse(null);
    }

    @Transactional
    public Project updateFields(Long id, java.util.Map<String, Object> fields) {
        return projectRepository.findById(id).map(project -> {
            if (fields.containsKey("planningTime")) project.setPlanningTime((Integer) fields.get("planningTime"));
            if (fields.containsKey("executionTime")) project.setExecutionTime((Integer) fields.get("executionTime"));
            if (fields.containsKey("reviewTime")) project.setReviewTime((Integer) fields.get("reviewTime"));
            if (fields.containsKey("isLocked")) project.setIsLocked((Boolean) fields.get("isLocked"));
            if (fields.containsKey("stage")) project.setStage((String) fields.get("stage"));
            if (fields.containsKey("totalPowders")) project.setTotalPowders((Integer) fields.get("totalPowders"));
            if (fields.containsKey("completedPowders")) project.setCompletedPowders((Integer) fields.get("completedPowders"));
            return projectRepository.save(project);
        }).orElse(null);
    }

    @Transactional
    public void delete(Long id) {
        // 删除项目会级联删除节点
        projectRepository.deleteById(id);
    }

    @Transactional
    public void updateProgress(Long projectId) {
        projectRepository.findById(projectId).ifPresent(project -> {
            Integer total = nodeRepository.countPowdersByProjectId(projectId);
            Integer completed = nodeRepository.countCompletedPowdersByProjectId(projectId);
            project.setTotalPowders(total);
            project.setCompletedPowders(completed);
            if (total > 0) {
                project.setProgress((completed * 100) / total);
            } else {
                project.setProgress(0);
            }
            projectRepository.save(project);
        });
    }

    private NodeDTO toNodeDTO(Node node) {
        NodeDTO dto = new NodeDTO();
        dto.setId(node.getId());
        dto.setProjectId(node.getProjectId());
        dto.setParentId(node.getParentId());
        dto.setName(node.getName());
        dto.setLevel(node.getLevel());
        dto.setNodeType(node.getNodeType());
        dto.setSortOrder(node.getSortOrder());
        dto.setIsCompleted(node.getIsCompleted());
        dto.setCompletedAt(node.getCompletedAt());
        return dto;
    }

    @Transactional
    public Project advanceStage(Long id) {
        return projectRepository.findById(id).map(project -> {
            String currentStage = project.getStage();
            if ("planning".equals(currentStage)) {
                project.setStage("execution");
            } else if ("execution".equals(currentStage)) {
                project.setStage("review");
            }
            return projectRepository.save(project);
        }).orElse(null);
    }

    public Project getActiveProject() {
        return projectRepository.findByStageIn(java.util.Arrays.asList("planning", "execution", "review"));
    }

    @Transactional
    public ArchiveRecord archiveProject(Long id) {
        return projectRepository.findById(id).map(project -> {
            // 获取时间记录
            List<TimerRecord> timers = timerRecordService.findByProjectId(id);
            int planningTime = timers.stream().filter(t -> "planning".equals(t.getPhase())).mapToInt(TimerRecord::getDurationSeconds).sum();
            int executionTime = timers.stream().filter(t -> "execution".equals(t.getPhase())).mapToInt(TimerRecord::getDurationSeconds).sum();
            int reviewTime = timers.stream().filter(t -> "review".equals(t.getPhase())).mapToInt(TimerRecord::getDurationSeconds).sum();

            // 获取该项目的成果和问题记录
            List<OutcomeRecord> outcomes = outcomeRecordService.getByProjectId(id);
            String reviewOutcome = outcomes.stream()
                .filter(o -> "outcome".equals(o.getType()))
                .map(OutcomeRecord::getContent)
                .collect(Collectors.joining("；"));
            String reviewIssue = outcomes.stream()
                .filter(o -> "issue".equals(o.getType()))
                .map(OutcomeRecord::getContent)
                .collect(Collectors.joining("；"));

            // 创建归档记录
            ArchiveRecord archive = archiveRecordService.create(
                project.getName(),
                project.getTotalPowders(),
                project.getCompletedPowders(),
                project.getCompletedPowders() >= project.getTotalPowders() ? "done" : "partial"
            );
            archive.setTotalTimePlanning(planningTime);
            archive.setTotalTimeExecution(executionTime);
            archive.setTotalTimeReview(reviewTime);
            archive.setReviewOutcome(reviewOutcome);
            archive.setReviewIssue(reviewIssue);
            archiveRecordService.update(archive.getId(), archive);

            // 删除项目和节点
            nodeRepository.deleteByProjectId(id);
            projectRepository.deleteById(id);

            return archive;
        }).orElse(null);
    }
}
