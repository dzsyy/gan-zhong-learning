package com.ganzhong.repository;

import com.ganzhong.model.entity.ArchiveRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchiveRecordRepository extends JpaRepository<ArchiveRecord, Long> {
}
