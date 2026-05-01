import { useState, useEffect, useCallback } from 'react';
import { SimpleMindMap } from './SimpleMindMap';
import { useAppStore } from '../../stores/appStore';

export function ProjectDetail() {
  const {
    currentProject,
    setCurrentProject,
    completeNode,
    uncompleteNode,
    recordTimer,
    loadProjectDetail,
    addNodesBatch,
    advanceProjectStage,
    updateProject,
    addOutcome,
    getOutcomeHistory,
  } = useAppStore();

  // 阶段状态
  const [phaseStatus, setPhaseStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  // 正向计时（阶段1）
  const [countUpSeconds, setCountUpSeconds] = useState(0);
  // 倒计时（阶段2）
  const [countDownSeconds, setCountDownSeconds] = useState(0);
  // 正向计时（阶段3复盘）
  const [reviewCountUpSeconds, setReviewCountUpSeconds] = useState(0);
  // 原始倒计时时间（用于计算已用时间）
  const [originalCountdown, setOriginalCountdown] = useState(0);
  // 是否开始执行（阶段2需要手动点击开始）
  const [executionStarted, setExecutionStarted] = useState(false);
  // 是否开始复盘（阶段3需要手动点击开始）
  const [reviewStarted, setReviewStarted] = useState(false);

  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeNames, setNewNodeNames] = useState(['', '', '']);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'mindmap' | 'powder'>('mindmap');

  // 复盘表单状态
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [outcomeText, setOutcomeText] = useState('');
  const [issueText, setIssueText] = useState('');
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [outcomeHistory, setOutcomeHistory] = useState<Array<{id: number; content: string; count: number}>>([]);
  const [issueHistory, setIssueHistory] = useState<Array<{id: number; content: string; count: number}>>([]);

  // 阶段1计时器
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phaseStatus === 'running' && currentProject?.stage === 'planning') {
      interval = setInterval(() => {
        setCountUpSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phaseStatus, currentProject?.stage]);

  // 阶段2倒计时
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timerActive = phaseStatus === 'running' && executionStarted && countDownSeconds > 0;
    if (timerActive) {
      interval = setInterval(() => {
        setCountDownSeconds(s => s - 1);
      }, 1000);
    } else if (countDownSeconds === 0 && executionStarted) {
      // 倒计时结束，自动进入下一阶段
      handleTimerEnd();
    }
    return () => clearInterval(interval);
  }, [phaseStatus, executionStarted, countDownSeconds]);

  // 阶段3复盘正向计时
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (currentProject?.stage === 'review' && reviewStarted) {
      interval = setInterval(() => {
        setReviewCountUpSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentProject?.stage, reviewStarted]);

  const handleTimerEnd = async () => {
    if (currentProject?.stage === 'execution') {
      // 阶段2结束，计算实际执行时间 = 原始倒计时 - 剩余时间
      const actualExecutionTime = originalCountdown - countDownSeconds;
      await recordTimer(currentProject.id, 'execution', actualExecutionTime);
      // 自动进入阶段3（复盘不需要计时）
      await advanceProjectStage(currentProject.id);
      await loadProjectDetail(currentProject.id);
      setExecutionStarted(false);
      setCountDownSeconds(0);
      setOriginalCountdown(0);
      setReviewStarted(false);
      setPhaseStatus('idle'); // 等待用户开始复盘
    }
    // 阶段3（review）没有计时器，用户提交复盘即结束
  };

  const handleStartPhase1 = () => {
    setPhaseStatus('running');
  };

  const handlePausePhase1 = () => {
    setPhaseStatus('paused');
  };

  const handleFinishSplitting = async () => {
    if (!currentProject) return;

    // 停止阶段1计时
    setPhaseStatus('idle');
    await recordTimer(currentProject.id, 'planning', countUpSeconds);

    // 提取叶子节点（没有子节点的节点）
    const leafNodes = (currentProject.nodes || []).filter(node => {
      return !(currentProject.nodes || []).some(n => n.parentId === node.id);
    });

    // 将叶子节点转换为粉末节点（level 4）
    const powderNodesToAdd = leafNodes.map((node, idx) => ({
      projectId: currentProject.id,
      parentId: node.parentId,
      name: node.name,
      level: 4,
      nodeType: 'powder',
      sortOrder: idx
    }));

    // 批量添加粉末节点
    if (powderNodesToAdd.length > 0) {
      await addNodesBatch(currentProject.id, powderNodesToAdd);
    }

    // 更新项目阶段为执行，并锁定思维导图
    await advanceProjectStage(currentProject.id);
    await updateProject(currentProject.id, {
      isLocked: true,
      planningTime: countUpSeconds
    });
    await loadProjectDetail(currentProject.id);

    // 重置状态，准备阶段2
    setCountUpSeconds(0);
    setExecutionStarted(false);
  };

  const handleStartExecution = async () => {
    if (!currentProject) return;
    // 设置倒计时 = 阶段1时间 × 3
    const countdownTime = (currentProject.planningTime || 0) * 3;
    setCountDownSeconds(countdownTime);
    setOriginalCountdown(countdownTime);
    setExecutionStarted(true);
    setPhaseStatus('running');
    setViewMode('powder');
    // 更新executionTime
    await updateProject(currentProject.id, { executionTime: countdownTime });
  };

  const handleFinishExecutionEarly = async () => {
    if (!currentProject) return;
    // 提前结束执行阶段，直接进入复盘
    setPhaseStatus('idle');
    const actualExecutionTime = originalCountdown - countDownSeconds;
    await recordTimer(currentProject.id, 'execution', actualExecutionTime);
    await advanceProjectStage(currentProject.id);
    const reviewTime = Math.floor((currentProject.planningTime || 0) / 2);
    await updateProject(currentProject.id, { reviewTime });
    await loadProjectDetail(currentProject.id);
    setExecutionStarted(false);
    setCountDownSeconds(0);
    setOriginalCountdown(0);
  };

  const handleStartReview = async () => {
    if (!currentProject) return;
    // 加载历史成果和问题记录
    const outcomes = await getOutcomeHistory('outcome');
    const issues = await getOutcomeHistory('issue');
    setOutcomeHistory(outcomes.map((o: any) => ({ id: o.id, content: o.content, count: o.count })));
    setIssueHistory(issues.map((o: any) => ({ id: o.id, content: o.content, count: o.count })));
    // 复盘正向计时开始
    setReviewStarted(true);
    // 显示复盘表单
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (!currentProject) return;
    // 提交成果
    if (outcomeText.trim()) {
      await addOutcome('outcome', outcomeText.trim(), currentProject.id);
    }
    // 提交问题
    if (issueText.trim()) {
      await addOutcome('issue', issueText.trim(), currentProject.id);
    }
    // 记录复盘时间并退出
    await recordTimer(currentProject.id, 'review', reviewCountUpSeconds);
    setReviewCompleted(true);
    setShowReviewForm(false);
    setPhaseStatus('idle');
    setReviewCountUpSeconds(0);
    handleBack();
  };

  const handleToggleComplete = (nodeId: number, isCompleted: boolean) => {
    if (isCompleted) {
      uncompleteNode(nodeId);
    } else {
      completeNode(nodeId);
    }
  };

  if (!currentProject) return null;

  const nodes = currentProject.nodes || [];
  const rootNodes = nodes.filter(n => n.level === 1).sort((a, b) => a.sortOrder - b.sortOrder);
  const level2Nodes = nodes.filter(n => n.level === 2).sort((a, b) => a.sortOrder - b.sortOrder);
  const level3Nodes = nodes.filter(n => n.level === 3).sort((a, b) => a.sortOrder - b.sortOrder);
  const powderNodes = nodes.filter(n => n.level === 4).sort((a, b) => a.sortOrder - b.sortOrder);

  // 获取叶子节点（没有子节点的节点）
  const getLeafNodes = () => {
    return nodes.filter(node => {
      return !nodes.some(n => n.parentId === node.id);
    });
  };

  const handleBack = () => {
    setPhaseStatus('idle');
    setCountUpSeconds(0);
    setCountDownSeconds(0);
    setOriginalCountdown(0);
    setExecutionStarted(false);
    setReviewStarted(false);
    setReviewCountUpSeconds(0);
    setCurrentProject(null);
  };

  const handleAddNodes = async () => {
    const validNames = newNodeNames.filter(n => n.trim() !== '');
    if (validNames.length === 0) return;

    let nextLevel = 1;
    let parentId: number | null = null;

    if (selectedNodeId) {
      const selectedNode = currentProject.nodes?.find(n => n.id === selectedNodeId);
      if (selectedNode && selectedNode.level < 4) {
        parentId = selectedNodeId;
        nextLevel = selectedNode.level + 1;
      }
    }

    if (parentId === null) {
      if (rootNodes.length === 0) {
        nextLevel = 1;
        parentId = null;
      } else if (level2Nodes.length === 0) {
        nextLevel = 2;
        parentId = rootNodes[0].id;
      } else if (level3Nodes.length === 0) {
        nextLevel = 3;
        parentId = level2Nodes[0].id;
      } else {
        nextLevel = 4;
        parentId = level3Nodes[0].id;
      }
    }

    if (nextLevel > 4) return;

    const nodesToAdd = validNames.map((name, idx) => ({
      projectId: currentProject.id,
      parentId: parentId,
      name: name.trim(),
      level: nextLevel,
      nodeType: nextLevel === 4 ? 'powder' : 'normal',
      sortOrder: idx
    }));

    await addNodesBatch(currentProject.id, nodesToAdd);
    setNewNodeNames(['', '', '']);
    setShowAddNodeModal(false);
  };

  const completedPowders = powderNodes.filter(p => p.isCompleted).length;
  const totalPowders = powderNodes.length;

  // 是否可以操作思维导图（阶段1且计时中）
  const canOperateMindMap = currentProject.stage === 'planning' && phaseStatus === 'running';

  // 阶段1计时器显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onNodeClick = (nodeId: number) => {
    if (!canOperateMindMap) return;
    setSelectedNodeId(nodeId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', color: '#f1f5f9' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px', display: 'flex', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)'
      }}>
        <button
          onClick={handleBack}
          style={{
            padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#f1f5f9', marginRight: 16
          }}
        >
          ← 返回
        </button>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{currentProject.name}</div>
        <span style={{
          marginLeft: 12, padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500,
          background: currentProject.stage === 'planning' ? 'rgba(6,182,212,0.2)' :
                      currentProject.stage === 'execution' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)',
          color: currentProject.stage === 'planning' ? '#06b6d4' :
                 currentProject.stage === 'execution' ? '#f59e0b' : '#22c55e'
        }}>
          {currentProject.stage === 'planning' ? '统筹谋划' :
           currentProject.stage === 'execution' ? '执行阶段' : '复盘阶段'}
        </span>
      </div>

      {/* View Toggle Bar */}
      {currentProject.stage !== 'planning' && (
        <div style={{
          padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)'
        }}>
          <button
            onClick={() => setViewMode('mindmap')}
            style={{
              height: 32, padding: '0 16px', borderRadius: 6, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit', border: 'none',
              background: viewMode === 'mindmap' ? '#06b6d4' : 'rgba(255,255,255,0.1)',
              color: viewMode === 'mindmap' ? '#fff' : '#94a3b8'
            }}
          >
            思维导图
          </button>
          <button
            onClick={() => setViewMode('powder')}
            style={{
              height: 32, padding: '0 16px', borderRadius: 6, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit', border: 'none',
              background: viewMode === 'powder' ? '#06b6d4' : 'rgba(255,255,255,0.1)',
              color: viewMode === 'powder' ? '#fff' : '#94a3b8'
            }}
          >
            粉末列表
          </button>
        </div>
      )}

      {/* Content Area */}
      {currentProject.stage === 'planning' ? (
        // 阶段1：思维导图
        rootNodes.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#06b6d4' }}>{currentProject.name}</div>
            <div style={{ fontSize: 14, color: '#64748b' }}>点击下方"开始"按钮开始拆解</div>
            {phaseStatus === 'idle' && (
              <button
                onClick={handleStartPhase1}
                style={{
                  marginTop: 16, padding: '12px 32px', background: '#06b6d4', color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer'
                }}
              >
                开始计时
              </button>
            )}
            {phaseStatus === 'running' && (
              <span style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>
                点击节点选中，然后添加子节点拆分
              </span>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, background: '#fafafa', minHeight: 0, overflow: 'auto' }}>
            {!canOperateMindMap && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                background: 'rgba(0,0,0,0.7)', padding: '12px 24px', textAlign: 'center',
                color: '#f59e0b', fontSize: 14
              }}>
                点击"开始计时"后才能操作思维导图
              </div>
            )}
            <SimpleMindMap
              nodes={nodes}
              projectName={currentProject.name}
              selectedNodeId={canOperateMindMap ? selectedNodeId : null}
              onNodeClick={onNodeClick}
            />
          </div>
        )
      ) : viewMode === 'mindmap' ? (
        // 阶段2/3：思维导图（只读）
        <div style={{ flex: 1, background: '#fafafa', minHeight: 0, overflow: 'auto' }}>
          <SimpleMindMap
            nodes={nodes}
            projectName={currentProject.name}
            selectedNodeId={null}
            onNodeClick={() => {}}
          />
        </div>
      ) : (
        // 阶段2/3：粉末列表
        <div style={{ background: '#fff', padding: '0 0 100px', flex: 1, overflow: 'auto' }}>
          <div style={{
            padding: '16px 24px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', borderBottom: '1px solid #f3f4f6', background: '#fafafa'
          }}>
            <span style={{ fontSize: 14, color: '#374151' }}>粉末任务 {completedPowders}/{totalPowders}</span>
            {totalPowders > 0 && (
              <div style={{
                width: 100, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(completedPowders / totalPowders) * 100}%`,
                  height: '100%', background: '#06b6d4', transition: 'width 0.3s'
                }} />
              </div>
            )}
          </div>
          {powderNodes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
              暂无粉末任务
            </div>
          ) : (
            powderNodes.map(node => (
              <div
                key={node.id}
                onClick={() => currentProject.stage === 'execution' && executionStarted && handleToggleComplete(node.id, node.isCompleted)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '14px 24px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: currentProject.stage === 'execution' && executionStarted ? 'pointer' : 'default'
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 4, border: '2px solid #d1d5db',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginRight: 12,
                  background: node.isCompleted ? '#10b981' : 'transparent',
                  borderColor: node.isCompleted ? '#10b981' : '#d1d5db'
                }}>
                  {node.isCompleted && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{
                  flex: 1, fontSize: 14, color: node.isCompleted ? '#d1d5db' : '#111827',
                  textDecoration: node.isCompleted ? 'line-through' : 'none'
                }}>
                  {node.name}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px', display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', zIndex: 100
      }}>
        {/* 阶段1：计时器 + 控制 */}
        {currentProject.stage === 'planning' && (
          <>
            <span style={{
              fontSize: 32, fontWeight: 700, color: phaseStatus === 'running' ? '#06b6d4' : '#64748b',
              fontFamily: 'monospace', minWidth: 100
            }}>
              {formatTime(countUpSeconds)}
            </span>
            {phaseStatus === 'idle' && (
              <button
                onClick={handleStartPhase1}
                style={{
                  height: 44, padding: '0 28px', borderRadius: 8, fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: '#06b6d4', color: '#fff'
                }}
              >
                开始计时
              </button>
            )}
            {phaseStatus === 'running' && (
              <>
                <button
                  onClick={() => setShowAddNodeModal(true)}
                  style={{
                    height: 44, padding: '0 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: '#22c55e', color: '#fff'
                  }}
                >
                  添加节点
                </button>
                <button
                  onClick={handlePausePhase1}
                  style={{
                    height: 44, padding: '0 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: '#f59e0b', color: '#fff'
                  }}
                >
                  暂停
                </button>
                <button
                  onClick={handleFinishSplitting}
                  style={{
                    height: 44, padding: '0 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: '#ef4444', color: '#fff'
                  }}
                >
                  完成拆解
                </button>
              </>
            )}
          </>
        )}

        {/* 阶段2：执行阶段 */}
        {currentProject.stage === 'execution' && !executionStarted && (
          <>
            <span style={{ fontSize: 14, color: '#94a3b8' }}>
              粉末已准备就绪，点击开始执行
            </span>
            <button
              onClick={handleStartExecution}
              style={{
                height: 44, padding: '0 28px', borderRadius: 8, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: '#06b6d4', color: '#fff'
              }}
            >
              开始执行
            </button>
          </>
        )}

        {currentProject.stage === 'execution' && executionStarted && (
          <>
            <span style={{
              fontSize: 32, fontWeight: 700, color: countDownSeconds < 60 ? '#ef4444' : '#06b6d4',
              fontFamily: 'monospace', minWidth: 100
            }}>
              {formatTime(countDownSeconds)}
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              ({Math.floor(currentProject.planningTime * 3 / 60)}:{((currentProject.planningTime * 3) % 60).toString().padStart(2, '0')} 总时)
            </span>
            <button
              onClick={handleFinishExecutionEarly}
              style={{
                height: 36, padding: '0 16px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: '#8b5cf6', color: '#fff'
              }}
            >
              提前完成
            </button>
          </>
        )}

        {/* 阶段3：复盘阶段（正向计时） */}
        {currentProject.stage === 'review' && !reviewStarted && (
          <>
            <span style={{ fontSize: 14, color: '#94a3b8' }}>
              点击开始填写复盘内容
            </span>
            <button
              onClick={handleStartReview}
              style={{
                height: 44, padding: '0 28px', borderRadius: 8, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: '#22c55e', color: '#fff'
              }}
            >
              开始复盘
            </button>
          </>
        )}

        {currentProject.stage === 'review' && reviewStarted && (
          <>
            <span style={{
              fontSize: 32, fontWeight: 700, color: '#22c55e',
              fontFamily: 'monospace', minWidth: 100
            }}>
              {formatTime(reviewCountUpSeconds)}
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              复盘进行中
            </span>
          </>
        )}
      </div>

      {/* Add Node Modal (三分法) */}
      {showAddNodeModal && (
        <div
          onClick={() => setShowAddNodeModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 200
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1e293b', borderRadius: 16, padding: 32, width: 420,
              border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 18, fontWeight: 600, color: '#f1f5f9' }}>添加子节点（三分法）</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>
              每次添加1-3个节点，帮助细化拆解
            </p>
            {[0, 1, 2].map(i => (
              <input
                key={i}
                type="text"
                placeholder={`节点 ${i + 1}`}
                value={newNodeNames[i]}
                onChange={e => {
                  const newNames = [...newNodeNames];
                  newNames[i] = e.target.value;
                  setNewNodeNames(newNames);
                }}
                style={{
                  width: '100%', padding: '14px 16px', marginBottom: 12, borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)', fontSize: 14, boxSizing: 'border-box',
                  outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9'
                }}
              />
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowAddNodeModal(false)}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 8, fontSize: 14, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#94a3b8'
                }}
              >
                取消
              </button>
              <button
                onClick={handleAddNodes}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 8, fontSize: 14, cursor: 'pointer',
                  border: 'none', background: '#06b6d4', color: '#fff', fontWeight: 600
                }}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 复盘表单 */}
      {showReviewForm && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 300
          }}
        >
          <div style={{
            background: '#1e293b', borderRadius: 16, padding: 32, width: 500,
            border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ marginTop: 0, fontSize: 20, fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>
              复盘
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>
              填写本次项目拆解的产出成果和抛出问题（可从历史记录中选择）
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: '#22c55e', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                产出成果（正面）
              </label>
              <textarea
                value={outcomeText}
                onChange={e => setOutcomeText(e.target.value)}
                placeholder="例如：完成了需求拆解，掌握了三分法"
                style={{
                  width: '100%', minHeight: 100, padding: '12px 16px', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)', fontSize: 14, boxSizing: 'border-box',
                  outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9',
                  fontFamily: 'inherit', resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#f59e0b', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                抛出问题（反思）
              </label>
              <textarea
                value={issueText}
                onChange={e => setIssueText(e.target.value)}
                placeholder="例如：时间预估不够准确，需要改进"
                style={{
                  width: '100%', minHeight: 100, padding: '12px 16px', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)', fontSize: 14, boxSizing: 'border-box',
                  outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9',
                  fontFamily: 'inherit', resize: 'vertical'
                }}
              />
            </div>

            <button
              onClick={handleSubmitReview}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 8, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', border: 'none', background: '#22c55e', color: '#fff'
              }}
            >
              提交复盘
            </button>
          </div>
        </div>
      )}
    </div>
  );
}