-- 干中学任务管理系统 - 项目表新增字段
-- 为 projects 表添加阶段时间和锁定状态字段

USE ganzhong;

-- 添加阶段时间字段
ALTER TABLE projects ADD COLUMN IF NOT EXISTS planning_time INT DEFAULT 0 COMMENT '阶段1拆解时间（秒）';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS execution_time INT DEFAULT 0 COMMENT '阶段2执行时间（秒）';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS review_time INT DEFAULT 0 COMMENT '阶段3复盘时间（秒）';

-- 添加思维导图锁定状态
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE COMMENT '思维导图是否锁定';

-- 为归档记录表添加时间和成果问题字段
ALTER TABLE archive_records ADD COLUMN IF NOT EXISTS total_time_planning INT DEFAULT 0 COMMENT '统筹阶段总时长（秒）';
ALTER TABLE archive_records ADD COLUMN IF NOT EXISTS total_time_execution INT DEFAULT 0 COMMENT '执行阶段总时长（秒）';
ALTER TABLE archive_records ADD COLUMN IF NOT EXISTS total_time_review INT DEFAULT 0 COMMENT '复盘阶段总时长（秒）';
ALTER TABLE archive_records ADD COLUMN IF NOT EXISTS review_outcome TEXT COMMENT '复盘产出成果';
ALTER TABLE archive_records ADD COLUMN IF NOT EXISTS review_issue TEXT COMMENT '复盘抛出问题';