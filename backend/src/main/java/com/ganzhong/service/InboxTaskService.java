package com.ganzhong.service;

import com.ganzhong.model.entity.InboxTask;
import com.ganzhong.repository.InboxTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InboxTaskService {

    private final InboxTaskRepository inboxTaskRepository;

    public List<InboxTask> findAll() {
        return inboxTaskRepository.findAll();
    }

    @Transactional
    public InboxTask create(String title) {
        InboxTask task = new InboxTask();
        task.setTitle(title);
        return inboxTaskRepository.save(task);
    }

    @Transactional
    public void delete(Long id) {
        inboxTaskRepository.deleteById(id);
    }

    public InboxTask findById(Long id) {
        return inboxTaskRepository.findById(id).orElse(null);
    }
}
