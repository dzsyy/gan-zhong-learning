import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';

export function Inbox() {
  const { inboxTasks, addInboxTask, deleteInboxTask, openModal, modalOpen, currentTask, decisionStep, closeModal } = useAppStore();
  const [newTask, setNewTask] = useState('');
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [batchText, setBatchText] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      addInboxTask(newTask);
      setNewTask('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleBatchImport = () => {
    const lines = batchText.split('\n').filter(line => line.trim());
    lines.forEach(line => addInboxTask(line.trim()));
    setBatchText('');
    setShowBatchImport(false);
  };

  const handleDecision = (answer: boolean) => {
    if (currentTask) {
      const { processInboxTask, closeModal } = useAppStore.getState();
      if (decisionStep === 1) {
        if (answer) {
          useAppStore.setState({ decisionStep: 2 });
        } else {
          processInboxTask(currentTask, false, false);
          closeModal();
        }
      } else if (decisionStep === 2) {
        processInboxTask(currentTask, true, answer);
        closeModal();
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">收集箱</h1>
        <button
          className="btn btn-ghost"
          onClick={() => setShowBatchImport(true)}
          style={{ marginLeft: 'auto' }}
        >
          批量导入
        </button>
      </div>
      <input
        type="text"
        className="input-box"
        placeholder="输入任务标题，回车添加..."
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="task-list">
        {inboxTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📥</div>
            <div className="empty-text">收集箱是空的，快添加任务吧</div>
          </div>
        ) : (
          inboxTasks.map(task => (
            <div key={task.id} className="task-item">
              <div>
                <div className="task-title">{task.title}</div>
                <div className="task-time">{formatTime(task.createdAt)}</div>
              </div>
              <div className="task-actions">
                <button className="btn btn-primary" onClick={() => openModal(task)}>处理</button>
                <button className="btn btn-danger" onClick={() => deleteInboxTask(task.id)}>删除</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Batch Import Modal */}
      {showBatchImport && (
        <div className="modal-overlay" onClick={() => setShowBatchImport(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>批量导入</h3>
            <p style={{ color: '#6b7280', fontSize: 14 }}>每行一条任务</p>
            <textarea
              value={batchText}
              onChange={e => setBatchText(e.target.value)}
              placeholder="任务1&#10;任务2&#10;任务3"
              style={{
                width: '100%', minHeight: 200, padding: '12px 16px', borderRadius: 8,
                border: '1px solid #e5e7eb', fontSize: 14, resize: 'vertical', boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                className="btn btn-ghost"
                onClick={() => setShowBatchImport(false)}
                style={{ flex: 1 }}
              >
                取消
              </button>
              <button
                className="btn btn-primary"
                onClick={handleBatchImport}
                style={{ flex: 1 }}
              >
                导入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {modalOpen && currentTask && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-task-title">{currentTask.title}</div>
            {decisionStep === 1 && (
              <>
                <div className="modal-question">可行动吗？</div>
                <div className="modal-buttons">
                  <button className="btn btn-primary" onClick={() => handleDecision(true)}>是</button>
                  <button className="btn btn-ghost" onClick={() => handleDecision(false)}>否</button>
                </div>
              </>
            )}
            {decisionStep === 2 && (
              <>
                <div className="modal-question">一步搞定吗？</div>
                <div className="modal-buttons">
                  <button className="btn btn-primary" onClick={() => handleDecision(true)}>是</button>
                  <button className="btn btn-ghost" onClick={() => handleDecision(false)}>否</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  return '昨天';
}