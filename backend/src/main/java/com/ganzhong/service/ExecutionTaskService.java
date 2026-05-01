package com.ganzhong.service;

import com.ganzhong.model.entity.ExecutionTask;
import com.ganzhong.repository.ExecutionTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExecutionTaskService {

    private final ExecutionTaskRepository executionTaskRepository;

    public List<ExecutionTask> findAll() {
        return executionTaskRepository.findAll();
    }

    @Transactional
    public ExecutionTask create(String title, String source, Long projectId) {
        ExecutionTask task = new ExecutionTask();
        task.setTitle(title);
        task.setSource(source);
        task.setProjectId(projectId);
        return executionTaskRepository.save(task);
    }

    @Transactional
    public void complete(Long id) {
        executionTaskRepository.findById(id).ifPresent(task -> {
            task.setIsCompleted(true);
            task.setCompletedAt(LocalDateTime.now());
            executionTaskRepository.save(task);
        });
    }

    @Transactional
    public void delete(Long id) {
        executionTaskRepository.deleteById(id);
    }

    public ExecutionTask findById(Long id) {
        return executionTaskRepository.findById(id).orElse(null);
    }
}
