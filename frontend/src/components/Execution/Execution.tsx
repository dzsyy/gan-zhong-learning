import { useAppStore } from '../../stores/appStore';

export function Execution() {
  const { executionTasks, completeExecutionTask, moveToRecycle } = useAppStore();

  // 点击完成：标记完成并归档，然后从执行清单移除
  const handleComplete = async (id: number) => {
    try {
      await completeExecutionTask(id);
    } catch (e) {
      console.error('完成失败:', e);
    }
  };

  // 移入回收箱：仅移动不归档
  const handleMoveToRecycle = async (id: number, title: string) => {
    await moveToRecycle(id, title, '执行清单');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">执行清单</h1>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280' }}>
          按添加时间排序
        </span>
      </div>
      <div className="execution-list">
        {executionTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚡</div>
            <div className="empty-text">执行清单是空的</div>
          </div>
        ) : (
          executionTasks
            .filter(task => !task.isCompleted)
            .map(task => (
              <div key={task.id} className="execution-item">
              <div>
                <div className="execution-title">{task.title}</div>
                <div className="execution-source">{task.source}</div>
              </div>
              <div className="execution-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleComplete(task.id)}
                >
                  完成
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleMoveToRecycle(task.id, task.title)}
                >
                  移入回收箱
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}