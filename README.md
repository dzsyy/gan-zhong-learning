# 干中学任务管理系统

三阶段工作流任务管理系统：统筹谋划 → 执行阶段 → 复盘阶段

## 技术栈

- **前端**：React 19 + TypeScript + Vite + Zustand
- **后端**：Spring Boot 3.x + JPA

## 快速开始

### 后端

```bash
cd backend
# 初始化数据库
mysql -u root -p < init.sql
# 或执行 schema-update.sql 升级现有数据库
# 运行
mvn spring-boot:run
```

### 前端

```bash
cd frontend
pnpm install
pnpm dev
```

## 功能特性

- 阶段1（统筹谋划）：正向计时，三分法添加节点
- 阶段2（执行阶段）：倒计时 + 粉末任务勾选
- 阶段3（复盘阶段）：正向计时，填写成果和问题
- 项目归档：记录完整时间分配和产出
