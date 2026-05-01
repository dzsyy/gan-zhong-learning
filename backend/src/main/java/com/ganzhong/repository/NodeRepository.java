package com.ganzhong.repository;

import com.ganzhong.model.entity.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<Node, Long> {

    List<Node> findByProjectIdOrderByLevelAscSortOrderAsc(Long projectId);

    List<Node> findByProjectIdAndLevel(Long projectId, Integer level);

    List<Node> findByProjectIdAndParentId(Long projectId, Long parentId);

    @Modifying
    @Query("UPDATE Node n SET n.isCompleted = :completed, n.completedAt = CURRENT_TIMESTAMP WHERE n.id = :id")
    void updateCompletedStatus(@Param("id") Long id, @Param("completed") Boolean completed);

    @Query("SELECT COUNT(n) FROM Node n WHERE n.projectId = :projectId AND n.level = 4")
    Integer countPowdersByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(n) FROM Node n WHERE n.projectId = :projectId AND n.level = 4 AND n.isCompleted = true")
    Integer countCompletedPowdersByProjectId(@Param("projectId") Long projectId);

    void deleteByProjectId(Long projectId);
}
