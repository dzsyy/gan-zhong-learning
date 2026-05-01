package com.ganzhong.service;

import com.ganzhong.model.entity.OutcomeRecord;
import com.ganzhong.repository.OutcomeRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OutcomeRecordService {

    private final OutcomeRecordRepository outcomeRecordRepository;

    /**
     * 添加产出成果或抛出问题
     * 如果已存在相同的content和type，则count+1
     * 否则创建新记录
     */
    @Transactional
    public OutcomeRecord add(String type, String content, Long projectId) {
        Optional<OutcomeRecord> existing = outcomeRecordRepository.findByTypeAndContent(type, content);

        if (existing.isPresent()) {
            OutcomeRecord record = existing.get();
            record.setCount(record.getCount() + 1);
            if (projectId != null) {
                record.setProjectId(projectId);
            }
            return outcomeRecordRepository.save(record);
        } else {
            OutcomeRecord record = new OutcomeRecord();
            record.setType(type);
            record.setContent(content);
            record.setCount(1);
            record.setProjectId(projectId);
            return outcomeRecordRepository.save(record);
        }
    }

    /**
     * 添加产出成果
     */
    @Transactional
    public OutcomeRecord addOutcome(String content, Long projectId) {
        return add("outcome", content, projectId);
    }

    /**
     * 添加抛出问题
     */
    @Transactional
    public OutcomeRecord addIssue(String content, Long projectId) {
        return add("issue", content, projectId);
    }

    /**
     * 获取全局产出成果历史，按次数降序
     */
    public List<OutcomeRecord> getGlobalOutcomes() {
        return outcomeRecordRepository.findGlobalByTypeOrderByCountDesc("outcome");
    }

    /**
     * 获取全局抛出问题历史，按次数降序
     */
    public List<OutcomeRecord> getGlobalIssues() {
        return outcomeRecordRepository.findGlobalByTypeOrderByCountDesc("issue");
    }

    /**
     * 获取项目的所有产出记录
     */
    public List<OutcomeRecord> getByProjectId(Long projectId) {
        return outcomeRecordRepository.findByProjectId(projectId);
    }

    /**
     * 获取项目产出记录（合并全局历史）
     */
    public List<OutcomeRecord> getOutcomesWithHistory(Long projectId) {
        List<OutcomeRecord> global = getGlobalOutcomes();
        List<OutcomeRecord> project = outcomeRecordRepository.findByProjectId(projectId);
        // 合并并去重，project记录覆盖global
        // ... 可以根据需求实现合并逻辑
        return global;
    }

    /**
     * 获取所有记录
     */
    public List<OutcomeRecord> findAll() {
        return outcomeRecordRepository.findAll();
    }
}