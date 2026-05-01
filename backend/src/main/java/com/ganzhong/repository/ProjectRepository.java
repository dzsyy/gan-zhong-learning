package com.ganzhong.repository;

import com.ganzhong.model.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project findByStageIn(java.util.List<String> stages);
}
