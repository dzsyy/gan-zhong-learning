package com.ganzhong.service;

import com.ganzhong.model.entity.TimerRecord;
import com.ganzhong.repository.TimerRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimerRecordService {

    private final TimerRecordRepository timerRecordRepository;

    public List<TimerRecord> findByProjectId(Long projectId) {
        return timerRecordRepository.findByProjectIdOrderByRecordedAtDesc(projectId);
    }

    @Transactional
    public TimerRecord record(Long projectId, String phase, Integer durationSeconds) {
        TimerRecord record = new TimerRecord();
        record.setProjectId(projectId);
        record.setPhase(phase);
        record.setDurationSeconds(durationSeconds);
        return timerRecordRepository.save(record);
    }
}
