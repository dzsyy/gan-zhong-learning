import { create } from 'zustand';
import * as api from '../services/api';

export interface InboxTask {
  id: number;
  title: string;
  createdAt: string;
}

export interface ExecutionTask {
  id: number;
  title: string;
  source: string;
  projectId?: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface PossibilityTask {
  id: number;
  title: string;
  createdAt: string;
}

export interface RecycleTask {
  id: number;
  title: string;
  originalLocation: string;
  createdAt: string;
}

export interface ArchiveRecord {
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

export interface OutcomeRecord {
  id: number;
  projectId?: number;
  type: string; // "outcome" | "issue"
  content: string;
  count: number;
  createdAt: string;
}

export interface Node {
  id: number;
  projectId: number;
  parentId?: number;
  name: string;
  level: number;
  nodeType: string;
  sortOrder: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Project {
  id: number;
  name: string;
  stage: string;
  progress: number;
  totalPowders: number;
  completedPowders: number;
  planningTime: number; // 阶段1拆解时间（秒）
  executionTime: number; // 阶段2执行时间（秒）
  reviewTime: number; // 阶段3复盘时间（秒）
  totalDuration?: number; // 总时长（秒）
  isLocked: boolean; // 思维导图是否锁定
  createdAt: string;
  updatedAt: string;
  nodes?: Node[];
}

interface AppState {
  // UI状态
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;

  // 收集箱
  inboxTasks: InboxTask[];
  loadInboxTasks: () => Promise<void>;
  addInboxTask: (title: string) => Promise<void>;
  activateToInbox: (title: string) => Promise<void>;
  activateToInboxSimple: (title: string) => Promise<void>;
  deleteInboxTask: (id: number) => Promise<void>;

  // 项目
  projects: Project[];
  loadProjects: () => Promise<void>;
  loadProjectDetail: (id: number) => Promise<void>;
  createProject: (name: string) => Promise<Project>;
  updateProject: (id: number, data: any) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  advanceProjectStage: (id: number) => Promise<void>;
  archiveProject: (id: number) => Promise<void>;

  // 节点
  addNode: (projectId: number, data: any) => Promise<void>;
  addNodesBatch: (projectId: number, data: any[]) => Promise<void>;
  completeNode: (id: number) => Promise<void>;
  uncompleteNode: (id: number) => Promise<void>;
  deleteNode: (id: number) => Promise<void>;

  // 执行清单
  executionTasks: ExecutionTask[];
  loadExecutionTasks: () => Promise<void>;
  addExecutionTask: (title: string, source: string, projectId?: number) => Promise<void>;
  completeExecutionTask: (id: number) => Promise<void>;
  moveToRecycle: (id: number, title: string, originalLocation: string) => Promise<void>;
  deleteExecutionTask: (id: number) => Promise<void>;

  // 可能清单
  possibilityTasks: PossibilityTask[];
  loadPossibilityTasks: () => Promise<void>;
  addPossibilityTask: (title: string) => Promise<void>;
  deletePossibilityTask: (id: number) => Promise<void>;

  // 回收箱
  recycleTasks: RecycleTask[];
  loadRecycleTasks: () => Promise<void>;
  addRecycleTask: (title: string, originalLocation: string) => Promise<void>;
  deleteRecycleTask: (id: number) => Promise<void>;

  // 归档
  archiveRecords: ArchiveRecord[];
  loadArchiveRecords: () => Promise<void>;

  // 成果问题记录
  outcomeRecords: OutcomeRecord[];
  loadOutcomeRecords: () => Promise<void>;
  getOutcomeHistory: (type: string) => Promise<OutcomeRecord[]>;
  addOutcome: (type: string, content: string, projectId?: number) => Promise<void>;

  // 计时
  recordTimer: (projectId: number, phase: string, durationSeconds: number) => Promise<void>;

  // 决策流
  processInboxTask: (task: InboxTask, answer1: boolean, answer2: boolean) => Promise<void>;

  // Modal状态
  modalOpen: boolean;
  currentTask: InboxTask | null;
  decisionStep: number;
  openModal: (task: InboxTask) => void;
  closeModal: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // UI状态
  currentPage: 'inbox',
  setCurrentPage: (page) => set({ currentPage: page }),
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),

  // 收集箱
  inboxTasks: [],
  loadInboxTasks: async () => {
    const res = await api.inboxApi.getAll();
    set({ inboxTasks: res.data });
  },
  addInboxTask: async (title) => {
    const res = await api.inboxApi.create(title);
    set({ inboxTasks: [res.data, ...get().inboxTasks] });
  },
  // 激活任务到收集箱并自动进入决策流
  activateToInbox: async (title: string) => {
    const res = await api.inboxApi.create(title);
    const newTask = res.data;
    set({
      inboxTasks: [newTask, ...get().inboxTasks],
      modalOpen: true,
      currentTask: newTask,
      decisionStep: 1
    });
  },
  // 激活任务到收集箱（仅添加，不弹窗不跳转）
  activateToInboxSimple: async (title: string) => {
    const res = await api.inboxApi.create(title);
    set({ inboxTasks: [res.data, ...get().inboxTasks] });
  },
  deleteInboxTask: async (id) => {
    const { currentTask } = get();
    await api.inboxApi.delete(id);
    set(state => ({
      inboxTasks: state.inboxTasks.filter(t => t.id !== id),
      ...(currentTask && currentTask.id === id ? { modalOpen: false, currentTask: null, decisionStep: 0 } : {})
    }));
  },

  // 项目
  projects: [],
  loadProjects: async () => {
    const res = await api.projectApi.getAll();
    set({ projects: res.data });
  },
  loadProjectDetail: async (id) => {
    const res = await api.projectApi.getById(id);
    set({ currentProject: res.data });
  },
  createProject: async (name) => {
    const res = await api.projectApi.create(name);
    const newProject: Project = res.data;
    set({ projects: [...get().projects, newProject] });
    return newProject;
  },
  updateProject: async (id, data) => {
    await api.projectApi.update(id, data);
    await get().loadProjectDetail(id);
    await get().loadProjects();
  },
  deleteProject: async (id) => {
    await api.projectApi.delete(id);
    set({ projects: get().projects.filter(p => p.id !== id) });
  },
  advanceProjectStage: async (id) => {
    const res = await api.projectApi.advanceStage(id);
    set({ currentProject: res.data });
    await get().loadProjects();
  },
  archiveProject: async (id) => {
    await api.projectApi.archive(id);
    await get().loadProjects();
    await get().loadArchiveRecords();
    set({ currentProject: null });
  },

  // 节点
  addNode: async (projectId, data) => {
    await api.nodeApi.create(projectId, data);
    await get().loadProjectDetail(projectId);
  },
  addNodesBatch: async (projectId, data) => {
    await api.nodeApi.createBatch(projectId, data);
    await get().loadProjectDetail(projectId);
  },
  completeNode: async (id) => {
    await api.nodeApi.complete(id);
    const current = get().currentProject;
    if (current) {
      await get().loadProjectDetail(current.id);
    }
  },
  uncompleteNode: async (id) => {
    await api.nodeApi.uncomplete(id);
    const current = get().currentProject;
    if (current) {
      await get().loadProjectDetail(current.id);
    }
  },
  deleteNode: async (id) => {
    await api.nodeApi.delete(id);
  },

  // 执行清单
  executionTasks: [],
  loadExecutionTasks: async () => {
    const res = await api.executionApi.getAll();
    set({ executionTasks: res.data });
  },
  addExecutionTask: async (title, source, projectId) => {
    const res = await api.executionApi.create(title, source, projectId);
    set({ executionTasks: [...get().executionTasks, res.data] });
  },
  completeExecutionTask: async (id) => {
    // 1. 标记完成
    await api.executionApi.complete(id);
    // 2. 获取任务信息用于归档
    const task = get().executionTasks.find(t => t.id === id);
    // 3. 归档到归档记录
    await api.archiveApi.create({
      projectName: task?.title || '',
      status: 'done',
      reviewOutcome: '执行清单任务完成',
    });
    // 4. 重新加载执行清单确保数据同步
    await get().loadExecutionTasks();
    // 5. 重新加载归档记录
    await get().loadArchiveRecords();
  },
  moveToRecycle: async (id, title, originalLocation) => {
    await api.recycleApi.create(title, originalLocation);
    await api.executionApi.delete(id);
    // 重新加载确保数据同步
    await get().loadExecutionTasks();
    await get().loadRecycleTasks();
  },
  deleteExecutionTask: async (id) => {
    await api.executionApi.delete(id);
    set({ executionTasks: get().executionTasks.filter(t => t.id !== id) });
  },

  // 可能清单
  possibilityTasks: [],
  loadPossibilityTasks: async () => {
    const res = await api.possibilityApi.getAll();
    set({ possibilityTasks: res.data });
  },
  addPossibilityTask: async (title) => {
    const res = await api.possibilityApi.create(title);
    set({ possibilityTasks: [...get().possibilityTasks, res.data] });
  },
  deletePossibilityTask: async (id) => {
    await api.possibilityApi.delete(id);
    set({ possibilityTasks: get().possibilityTasks.filter(t => t.id !== id) });
  },

  // 回收箱
  recycleTasks: [],
  loadRecycleTasks: async () => {
    const res = await api.recycleApi.getAll();
    set({ recycleTasks: res.data });
  },
  addRecycleTask: async (title, originalLocation) => {
    const res = await api.recycleApi.create(title, originalLocation);
    set({ recycleTasks: [...get().recycleTasks, res.data] });
  },
  deleteRecycleTask: async (id) => {
    await api.recycleApi.delete(id);
    set({ recycleTasks: get().recycleTasks.filter(t => t.id !== id) });
  },

  // 归档
  archiveRecords: [],
  loadArchiveRecords: async () => {
    const res = await api.archiveApi.getAll();
    set({ archiveRecords: res.data });
  },

  // 成果问题记录
  outcomeRecords: [],
  loadOutcomeRecords: async () => {
    const res = await api.outcomeApi.getAll();
    set({ outcomeRecords: res.data });
  },
  getOutcomeHistory: async (type: string) => {
    const res = await api.outcomeApi.getHistory(type);
    return res.data;
  },
  addOutcome: async (type: string, content: string, projectId?: number) => {
    const res = await api.outcomeApi.create(type, content, projectId);
    await get().loadOutcomeRecords();
  },

  // 计时
  recordTimer: async (projectId, phase, durationSeconds) => {
    await api.timerApi.record(projectId, phase, durationSeconds);
  },

  // 决策流
  processInboxTask: async (task, answer1, answer2) => {
    const { addPossibilityTask, addExecutionTask, createProject, deleteInboxTask } = get();

    // 从收集箱删除
    await deleteInboxTask(task.id);

    if (!answer1) {
      // 不可行动 -> 可能清单
      await addPossibilityTask(task.title);
    } else if (!answer2) {
      // 可行动但非一步 -> 创建项目
      await createProject(task.title);
    } else {
      // 可行动且一步搞定 -> 执行清单
      await addExecutionTask(task.title, '收集箱');
    }
  },

  // Modal
  modalOpen: false,
  currentTask: null,
  decisionStep: 0,
  openModal: (task) => set({ modalOpen: true, currentTask: task, decisionStep: 1 }),
  closeModal: () => set({ modalOpen: false, currentTask: null, decisionStep: 0 }),
}));
