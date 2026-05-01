package com.ganzhong.service;

import com.ganzhong.model.entity.ArchiveRecord;
import com.ganzhong.repository.ArchiveRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArchiveRecordService {

    private final ArchiveRecordRepository archiveRecordRepository;

    public List<ArchiveRecord> findAll() {
        return archiveRecordRepository.findAll();
    }

    public ArchiveRecord create(String projectName, Integer totalPowders, Integer completedPowders, String status) {
        ArchiveRecord record = new ArchiveRecord();
        record.setProjectName(projectName);
        record.setTotalPowders(totalPowders);
        record.setCompletedPowders(completedPowders);
        record.setStatus(status);
        return archiveRecordRepository.save(record);
    }

    public ArchiveRecord update(Long id, ArchiveRecord record) {
        return archiveRecordRepository.findById(id).map(existing -> {
            existing.setReviewOutcome(record.getReviewOutcome());
            existing.setReviewIssue(record.getReviewIssue());
            existing.setTotalTimePlanning(record.getTotalTimePlanning());
            existing.setTotalTimeExecution(record.getTotalTimeExecution());
            existing.setTotalTimeReview(record.getTotalTimeReview());
            return archiveRecordRepository.save(existing);
        }).orElse(null);
    }
}
