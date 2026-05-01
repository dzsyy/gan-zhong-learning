package com.ganzhong.service;

import com.ganzhong.model.entity.PossibilityTask;
import com.ganzhong.repository.PossibilityTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PossibilityTaskService {

    private final PossibilityTaskRepository possibilityTaskRepository;

    public List<PossibilityTask> findAll() {
        return possibilityTaskRepository.findAll();
    }

    @Transactional
    public PossibilityTask create(String title) {
        PossibilityTask task = new PossibilityTask();
        task.setTitle(title);
        return possibilityTaskRepository.save(task);
    }

    @Transactional
    public void delete(Long id) {
        possibilityTaskRepository.deleteById(id);
    }

    public PossibilityTask findById(Long id) {
        return possibilityTaskRepository.findById(id).orElse(null);
    }
}
