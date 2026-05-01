import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import type { Project } from '../../stores/appStore';

export function Projects() {
  const { projects, loadProjectDetail, currentProject, deleteProject, archiveProject } = useAppStore();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [archivingId, setArchivingId] = useState<number | null>(null);

  const handleProjectClick = async (project: Project) => {
    // Bug #7: 单项目限制 - 同时只允许一个进行中的项目
    if (currentProject && currentProject.stage !== 'review' && project.id !== currentProject.id) {
      const confirm = window.confirm(`已有进行中的项目 "${currentProject.name}"，确定要切换到 "${project.name}" 吗？`);
      if (!confirm) return;
    }
    await loadProjectDetail(project.id);
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个项目吗？此操作不可撤销。')) {
      setDeletingId(projectId);
      await deleteProject(projectId);
      setDeletingId(null);
    }
  };

  const handleArchiveProject = async (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    if (window.confirm('确定要归档这个项目吗？归档后项目将从项目列表移除。')) {
      setArchivingId(projectId);
      await archiveProject(projectId);
      setArchivingId(null);
    }
  };

  const isProjectCompleted = (project: Project) => {
    return project.stage === 'review';
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'planning': return '统筹谋划';
      case 'execution': return '执行阶段';
      case 'review': return '复盘阶段';
      default: return stage;
    }
  };

  const getStageClass = (stage: string) => {
    switch (stage) {
      case 'planning': return 'stage-planning';
      case 'execution': return 'stage-execution';
      case 'review': return 'stage-review';
      default: return '';
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return '';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分`;
    } else if (mins > 0) {
      return `${mins}分${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">项目清单</h1>
      </div>
      <div className="project-grid">
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-text">项目清单是空的</div>
          </div>
        ) : (
          projects.map(project => (
            <div
              key={project.id}
              className={`project-card ${currentProject?.id === project.id ? 'active' : ''}`}
              onClick={() => handleProjectClick(project)}
            >
              <button
                className="delete-btn"
                onClick={(e) => handleDeleteProject(e, project.id)}
                disabled={deletingId === project.id}
                title="删除项目"
              >
                {deletingId === project.id ? '...' : '×'}
              </button>
              {isProjectCompleted(project) && (
                <button
                  className="archive-btn"
                  onClick={(e) => handleArchiveProject(e, project.id)}
                  disabled={archivingId === project.id}
                  title="归档项目"
                >
                  {archivingId === project.id ? '...' : '📦'}
                </button>
              )}
              <div className="project-name">{project.name}</div>
              <span className={`project-stage ${getStageClass(project.stage)}`}>
                {getStageLabel(project.stage)}
              </span>
              <div className="project-progress">
                <div className="project-progress-bar" style={{ width: `${project.progress}%` }}></div>
              </div>
              <div className="progress-text">
                {project.completedPowders}/{project.totalPowders} 粉末任务
              </div>
              {project.totalDuration ? (
                <div className="duration-text">
                  总时长：{formatDuration(project.totalDuration)}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}