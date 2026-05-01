package com.ganzhong.repository;

import com.ganzhong.model.entity.InboxTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InboxTaskRepository extends JpaRepository<InboxTask, Long> {
}
