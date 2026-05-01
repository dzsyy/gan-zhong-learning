package com.ganzhong.repository;

import com.ganzhong.model.entity.PossibilityTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PossibilityTaskRepository extends JpaRepository<PossibilityTask, Long> {
}
