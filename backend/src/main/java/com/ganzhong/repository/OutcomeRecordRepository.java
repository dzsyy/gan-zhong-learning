package com.ganzhong.repository;

import com.ganzhong.model.entity.OutcomeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OutcomeRecordRepository extends JpaRepository<OutcomeRecord, Long> {

    // 根据类型查找所有记录，按次数降序排列
    List<OutcomeRecord> findByTypeOrderByCountDesc(String type);

    // 查找是否存在相同内容和类型的记录
    Optional<OutcomeRecord> findByTypeAndContent(String type, String content);

    // 查找项目的产出记录
    List<OutcomeRecord> findByProjectId(Long projectId);

    // 全局历史记录（project_id为null）
    List<OutcomeRecord> findByProjectIdIsNullOrderByCountDesc();

    // 按类型和次数排序的全局历史
    @Query("SELECT o FROM OutcomeRecord o WHERE o.projectId IS NULL AND o.type = :type ORDER BY o.count DESC")
    List<OutcomeRecord> findGlobalByTypeOrderByCountDesc(@Param("type") String type);
}