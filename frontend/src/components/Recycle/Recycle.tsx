import { useAppStore } from '../../stores/appStore';

export function Recycle() {
  const { recycleTasks, activateToInboxSimple, deleteRecycleTask } = useAppStore();

  const handleActivate = (id: number, title: string) => {
    activateToInboxSimple(title);
    deleteRecycleTask(id);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">回收箱</h1>
      </div>
      <div className="recycle-list">
        {recycleTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♻️</div>
            <div className="empty-text">回收箱是空的</div>
          </div>
        ) : (
          recycleTasks.map(task => (
            <div key={task.id} className="recycle-item">
              <div className="recycle-title">{task.title}</div>
              <div className="recycle-actions">
                <button className="btn btn-primary" onClick={() => handleActivate(task.id, task.title)}>激活</button>
                <button className="btn btn-danger" onClick={() => deleteRecycleTask(task.id)}>彻底删除</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}