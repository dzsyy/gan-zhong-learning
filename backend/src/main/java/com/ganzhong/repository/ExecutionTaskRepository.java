package com.ganzhong.repository;

import com.ganzhong.model.entity.ExecutionTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExecutionTaskRepository extends JpaRepository<ExecutionTask, Long> {
}
