package com.ganzhong.repository;

import com.ganzhong.model.entity.TimerRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TimerRecordRepository extends JpaRepository<TimerRecord, Long> {

    List<TimerRecord> findByProjectIdOrderByRecordedAtDesc(Long projectId);

    List<TimerRecord> findByProjectIdAndPhase(Long projectId, String phase);
}
