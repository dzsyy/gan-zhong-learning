package com.ganzhong.repository;

import com.ganzhong.model.entity.RecycleTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecycleTaskRepository extends JpaRepository<RecycleTask, Long> {
}
