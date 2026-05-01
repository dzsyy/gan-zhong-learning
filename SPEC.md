# 干中学任务管理系统 - 技术规范

## 1. 项目概述

- **项目名称**: 干中学任务管理系统
- **项目类型**: 全栈 Web 应用（单页应用）
- **核心功能**: 粉末化任务管理 - 四层级思维导图（项目→阶段→节点→粉末）、任务决策流、计时执行
- **目标用户**: 个人用户

## 2. 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **样式**: CSS Modules（保持玻璃态风格）

### 后端
- **框架**: Spring Boot 3.x
- **ORM**: Spring Data JPA
- **数据库**: MySQL 8.x
- **API 风格**: RESTful JSON

## 3. 数据库设计

### 表结构

```sql
-- 项目表
CREATE TABLE projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    stage VARCHAR(20) DEFAULT 'planning', -- planning/execution/review
    progress INT DEFAULT 0,
    total_powders INT DEFAULT 0,
    completed_powders INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 思维导图节点表（四层级）
CREATE TABLE nodes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    parent_id BIGINT, -- 父节点ID，NULL表示根节点
    name VARCHAR(255) NOT NULL,
    level INT NOT NULL, -- 1=根节点, 2=阶段, 3=节点, 4=粉末
    node_type VARCHAR(20), -- root/phase/node/powder
    sort_order INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES nodes(id) ON DELETE CASCADE
);

-- 收集箱任务表
CREATE TABLE inbox_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 执行清单任务表
CREATE TABLE execution_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    source VARCHAR(100), -- 来源：收集箱/项目名
    project_id BIGINT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- 可能清单任务表
CREATE TABLE possibility_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 回收箱任务表
CREATE TABLE recycle_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    original_location VARCHAR(50), -- 来源位置
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 归档记录表
CREATE TABLE archive_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_powders INT DEFAULT 0,
    completed_powders INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'done' -- done/partial
);

-- 计时记录表
CREATE TABLE timer_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    phase VARCHAR(20) NOT NULL, -- planning/execution/review
    duration_seconds INT DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

## 4. API 接口设计

### 收集箱
- `GET /api/inbox` - 获取所有收集箱任务
- `POST /api/inbox` - 添加新任务
- `DELETE /api/inbox/{id}` - 删除任务
- `POST /api/inbox/{id}/process` - 处理任务（二步决策）

### 项目
- `GET /api/projects` - 获取所有项目
- `POST /api/projects` - 创建项目
- `GET /api/projects/{id}` - 获取项目详情（含思维导图）
- `PUT /api/projects/{id}` - 更新项目
- `DELETE /api/projects/{id}` - 删除项目

### 节点
- `POST /api/projects/{projectId}/nodes` - 添加节点
- `PUT /api/nodes/{id}` - 更新节点
- `DELETE /api/nodes/{id}` - 删除节点
- `POST /api/nodes/{id}/complete` - 完成粉末任务
- `POST /api/nodes/{id}/uncomplete` - 取消完成

### 执行清单
- `GET /api/execution` - 获取执行清单
- `POST /api/execution` - 添加任务
- `PUT /api/execution/{id}/complete` - 完成任务
- `PUT /api/execution/{id}/recycle` - 移入回收箱

### 可能清单
- `GET /api/possibility` - 获取可能清单
- `POST /api/possibility` - 添加任务
- `PUT /api/possibility/{id}/activate` - 激活到执行清单
- `DELETE /api/possibility/{id}` - 删除任务

### 回收箱
- `GET /api/recycle` - 获取回收箱
- `PUT /api/recycle/{id}/activate` - 激活任务
- `DELETE /api/recycle/{id}` - 彻底删除

### 归档
- `GET /api/archive` - 获取归档记录

### 计时
- `POST /api/timer/record` - 记录计时

## 5. 决策流逻辑

```
收集箱任务 → [可行动吗？]
    ├─ 否 → [放入可能清单]
    └─ 是 → [一步搞定吗？]
            ├─ 否 → [创建项目，生成根节点]
            └─ 是 → [放入执行清单]
```

## 6. 项目结构

### 前端
```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   ├── Inbox/
│   │   ├── Projects/
│   │   ├── ProjectDetail/
│   │   ├── Execution/
│   │   ├── Possibility/
│   │   ├── Recycle/
│   │   ├── Archive/
│   │   └── common/
│   ├── stores/          # Zustand stores
│   ├── services/        # API calls
│   ├── styles/          # CSS modules
│   └── App.tsx
├── package.json
└── vite.config.ts
```

### 后端
```
backend/
├── src/main/java/com/ganzhong/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/entity/
│   ├── model/dto/
│   └── GanzhongApplication.java
├── src/main/resources/
│   └── application.yml
├── pom.xml
└── docker-compose.yml   # MySQL
```

## 7. 开发顺序

1. 创建 SPEC.md（本文件）
2. 搭建后端项目，配置 MySQL
3. 实现后端 API（先跑通 CRUD）
4. 搭建前端项目
5. 实现前端页面和状态管理
6. 前后端联调
7. 功能完善和 bug 修复

## 8. 设计保持

保持玻璃态 HTML 原型的 UI 设计：
- 深色渐变背景 (#0f172a → #1e1b4b → #0f172a)
- 玻璃态卡片（rgba(255,255,255,0.08) + backdrop-filter: blur）
- 主色调 cyan (#06b6d4)
- 四层级节点颜色：根(#06b6d4) → L2(#0ea5e9) → L3(#22c55e) → 粉末(#f59e0b)
- 动画：浮动粒子、hover 效果、modal 渐入
