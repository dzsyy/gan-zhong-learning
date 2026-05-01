import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';

interface ArchiveRecord {
  id: number;
  projectName: string;
  completedAt: string;
  totalPowders: number;
  completedPowders: number;
  status: string;
  reviewOutcome?: string;
  reviewIssue?: string;
  totalTimePlanning?: number;
  totalTimeExecution?: number;
  totalTimeReview?: number;
}

function formatDateLabel(dateStr: string): { label: string; isToday: boolean; isYesterday: boolean } {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  let label = date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  if (isToday) label = '今天';
  else if (isYesterday) label = '昨天';

  return { label, isToday, isYesterday };
}

function groupByDate(records: ArchiveRecord[]): Map<string, ArchiveRecord[]> {
  const groups = new Map<string, ArchiveRecord[]>();
  records.forEach(record => {
    const dateKey = record.completedAt.split('T')[0];
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(record);
  });
  // 按日期倒序排列（今天在前，昨天在后）
  return new Map([...groups.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}

export function Archive() {
  const { archiveRecords } = useAppStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const groupedRecords = groupByDate(archiveRecords);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">归档</h1>
      </div>
      <div className="archive-timeline">
        {archiveRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-text">归档是空的</div>
          </div>
        ) : (
          Array.from(groupedRecords.entries()).map(([dateKey, records]) => {
            const { label, isToday, isYesterday } = formatDateLabel(records[0].completedAt);
            return (
              <div key={dateKey} className="archive-day" style={{ marginBottom: 28 }}>
                {/* 日期标题 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 14,
                  paddingLeft: 4
                }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isToday ? '#06b6d4' : isYesterday ? '#a78bfa' : '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {label}
                  </span>
                  <div style={{
                    flex: 1,
                    height: 1,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
                  }} />
                </div>

                {/* 记录列表 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {records.map(record => (
                    <div
                      key={record.id}
                      onClick={() => handleToggleExpand(record.id)}
                      style={{
                        cursor: 'pointer',
                        padding: '16px 20px',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.06)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* 主行 */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: record.status === 'done'
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 600
                          }}>
                            {record.status === 'done' ? '✓' : '○'}
                          </div>
                          <span style={{
                            fontWeight: 600,
                            fontSize: 15,
                            color: '#f1f5f9'
                          }}>
                            {record.projectName}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16
                        }}>
                          <span style={{
                            fontSize: 12,
                            color: '#64748b'
                          }}>
                            {record.completedPowders}/{record.totalPowders} 粉末
                          </span>
                          <span style={{
                            fontSize: 12,
                            color: '#475569',
                            transition: 'transform 0.2s',
                            transform: expandedId === record.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            display: 'inline-block'
                          }}>
                            ▼
                          </span>
                        </div>
                      </div>

                      {/* 展开详情 */}
                      {expandedId === record.id && (
                        <div style={{
                          marginTop: 16,
                          paddingTop: 16,
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12
                        }}>
                          {record.reviewOutcome && (
                            <div>
                              <div style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#06b6d4',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: 6
                              }}>
                                产出成果
                              </div>
                              <div style={{
                                fontSize: 14,
                                color: '#cbd5e1',
                                lineHeight: 1.6
                              }}>
                                {record.reviewOutcome}
                              </div>
                            </div>
                          )}
                          {record.reviewIssue && (
                            <div>
                              <div style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#f59e0b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: 6
                              }}>
                                抛出问题
                              </div>
                              <div style={{
                                fontSize: 14,
                                color: '#cbd5e1',
                                lineHeight: 1.6
                              }}>
                                {record.reviewIssue}
                              </div>
                            </div>
                          )}
                          <div style={{
                            display: 'flex',
                            gap: 20,
                            paddingTop: 8
                          }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase' }}>统筹</span>
                              <span style={{ fontSize: 13, color: '#94a3b8' }}>{record.totalTimePlanning || 0}s</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase' }}>执行</span>
                              <span style={{ fontSize: 13, color: '#94a3b8' }}>{record.totalTimeExecution || 0}s</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase' }}>复盘</span>
                              <span style={{ fontSize: 13, color: '#94a3b8' }}>{record.totalTimeReview || 0}s</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
