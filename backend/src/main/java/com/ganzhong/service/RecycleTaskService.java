package com.ganzhong.service;

import com.ganzhong.model.entity.RecycleTask;
import com.ganzhong.repository.RecycleTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecycleTaskService {

    private final RecycleTaskRepository recycleTaskRepository;

    public List<RecycleTask> findAll() {
        return recycleTaskRepository.findAll();
    }

    @Transactional
    public RecycleTask create(String title, String originalLocation) {
        RecycleTask task = new RecycleTask();
        task.setTitle(title);
        task.setOriginalLocation(originalLocation);
        return recycleTaskRepository.save(task);
    }

    @Transactional
    public void delete(Long id) {
        recycleTaskRepository.deleteById(id);
    }

    public RecycleTask findById(Long id) {
        return recycleTaskRepository.findById(id).orElse(null);
    }
}
