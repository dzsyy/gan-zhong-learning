import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 收集箱
export const inboxApi = {
  getAll: () => api.get('/inbox'),
  create: (title: string) => api.post('/inbox', { title }),
  delete: (id: number) => api.delete(`/inbox/${id}`),
};

// 项目
export const projectApi = {
  getAll: () => api.get('/projects'),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (name: string) => api.post('/projects', { name }),
  update: (id: number, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  advanceStage: (id: number) => api.post(`/projects/${id}/advance-stage`),
  getActiveProject: () => api.get('/projects/active'),
  archive: (id: number) => api.post(`/projects/${id}/archive`),
};

// 节点
export const nodeApi = {
  getByProject: (projectId: number) => api.get(`/projects/${projectId}/nodes`),
  create: (projectId: number, data: any) => api.post(`/projects/${projectId}/nodes`, data),
  createBatch: (projectId: number, data: any[]) => api.post(`/projects/${projectId}/nodes/batch`, data),
  update: (id: number, data: any) => api.put(`/nodes/${id}`, data),
  delete: (id: number) => api.delete(`/nodes/${id}`),
  complete: (id: number) => api.post(`/nodes/${id}/complete`),
  uncomplete: (id: number) => api.post(`/nodes/${id}/uncomplete`),
};

// 执行清单
export const executionApi = {
  getAll: () => api.get('/execution'),
  create: (title: string, source: string, projectId?: number) =>
    api.post('/execution', { title, source, projectId }),
  complete: (id: number) => api.put(`/execution/${id}/complete`),
  archive: (id: number) => api.put(`/execution/${id}/archive`),
  delete: (id: number) => api.delete(`/execution/${id}`),
};

// 可能清单
export const possibilityApi = {
  getAll: () => api.get('/possibility'),
  create: (title: string) => api.post('/possibility', { title }),
  delete: (id: number) => api.delete(`/possibility/${id}`),
};

// 回收箱
export const recycleApi = {
  getAll: () => api.get('/recycle'),
  create: (title: string, originalLocation: string) =>
    api.post('/recycle', { title, originalLocation }),
  delete: (id: number) => api.delete(`/recycle/${id}`),
};

// 归档
export const archiveApi = {
  getAll: () => api.get('/archive'),
  create: (data: any) => api.post('/archive', data),
  update: (id: number, data: any) => api.put(`/archive/${id}`, data),
};

// 计时
export const timerApi = {
  record: (projectId: number, phase: string, durationSeconds: number) =>
    api.post('/timer/record', { projectId, phase, durationSeconds }),
  getByProject: (projectId: number) => api.get(`/timer/project/${projectId}`),
};

// 成果问题记录
export const outcomeApi = {
  getAll: () => api.get('/outcomes'),
  getHistory: (type: string) => api.get('/outcomes/history', { params: { type } }),
  create: (type: string, content: string, projectId?: number) =>
    api.post('/outcomes', { type, content, projectId }),
};

export default api;
