-- 干中学任务管理系统数据库初始化脚本

CREATE DATABASE IF NOT EXISTS ganzhong CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ganzhong;

-- 项目表
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    stage VARCHAR(20) DEFAULT 'planning',
    progress INT DEFAULT 0,
    total_powders INT DEFAULT 0,
    completed_powders INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 思维导图节点表
CREATE TABLE IF NOT EXISTS nodes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    parent_id BIGINT,
    name VARCHAR(255) NOT NULL,
    level INT NOT NULL,
    node_type VARCHAR(20),
    sort_order INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES nodes(id) ON DELETE CASCADE
);

-- 收集箱任务表
CREATE TABLE IF NOT EXISTS inbox_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 执行清单任务表
CREATE TABLE IF NOT EXISTS execution_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    source VARCHAR(100),
    project_id BIGINT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- 可能清单任务表
CREATE TABLE IF NOT EXISTS possibility_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 回收箱任务表
CREATE TABLE IF NOT EXISTS recycle_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    original_location VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 归档记录表
CREATE TABLE IF NOT EXISTS archive_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_powders INT DEFAULT 0,
    completed_powders INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'done'
);

-- 计时记录表
CREATE TABLE IF NOT EXISTS timer_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    phase VARCHAR(20) NOT NULL,
    duration_seconds INT DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
