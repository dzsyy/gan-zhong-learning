import { useAppStore } from '../../stores/appStore';

export function Possibility() {
  const { possibilityTasks, activateToInboxSimple, deletePossibilityTask } = useAppStore();

  const handleActivate = (id: number, title: string) => {
    activateToInboxSimple(title);
    deletePossibilityTask(id);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">可能清单</h1>
      </div>
      <div className="possibility-list">
        {possibilityTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💭</div>
            <div className="empty-text">可能清单是空的</div>
          </div>
        ) : (
          possibilityTasks.map(task => (
            <div key={task.id} className="possibility-item">
              <div className="possibility-title">{task.title}</div>
              <div className="possibility-actions">
                <button className="btn btn-primary" onClick={() => handleActivate(task.id, task.title)}>激活</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}