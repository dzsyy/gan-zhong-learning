# 干中学任务管理系统 - UI 设计提示词

## 1. 整体风格方向

```
风格定位：现代简约 + 清新专业
关键词：粉末化、专注、执行力、轻量感
特点：层级分明、呼吸感、聚焦任务本身
```

---

## 2. 思维导图设计规范

### 节点颜色（4 级层级）

| 层级 | 颜色 | 色值 | 样式 |
|------|------|------|------|
| 根节点 | 青色 | `#06b6d4` | 实心，圆角 |
| Level 2 | 天蓝色 | `#0ea5e9` | 实心，圆角 |
| Level 3 | 绿色 | `#22c55e` | 实心，圆角 |
| Level 4（未完成） | 琥珀色 | `#f59e0b` | 实心，圆角 |
| Level 4（已完成） | 灰色 | `#9ca3af` | 删除线，半透明 |

### 布局参数

```
布局算法：dagre
方向：从左到右 (LR)
节点间距：ranksep 100px，nodesep 50px
节点尺寸：宽度 150px，高度自适应
连接线：曲线，颜色 #e5e7eb，宽度 2px
```

### 思维导图交互

```
画布：可缩放（zoom）+ 可拖拽（pan）
缩放范围：25% - 200%
缩放步进：25%
```

---

## 3. 页面布局

### 主布局结构

```
┌─────────────────────────────────────────────┐
│  Header（顶部栏，可选）                       │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │         内容区                   │
│ (导航)   │     （模块内容展示）              │
│          │                                  │
│  200-    │         自适应宽度               │
│  240px   │                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### Sidebar 导航项（6 个模块）

| 图标 | 模块名 | 路径 |
|------|--------|------|
| 📥 | 收集箱 | /inbox |
| 📋 | 项目清单 | /projects |
| ⚡ | 执行清单 | /execution |
| 💭 | 可能清单 | /possibility |
| ♻️ | 回收箱 | /recycle |
| 📦 | 归档 | /archive |

---

## 4. 关键组件设计规范

### 4.1 收集箱

**快速添加输入框：**
- 位置：页面顶部
- 样式：大输入框（height: 48px），placeholder "输入任务标题，回车添加"
- 交互：回车提交，清空输入框

**任务列表项：**
- 显示：标题 + 创建时间
- 操作：处理按钮（主色）、删除按钮（红色）
- Hover：背景变浅灰色

**决策树处理对话框：**
- 宽度：480px，居中显示
- 内容：
  - 顶部：当前任务标题
  - 中部：问题文字（大号字体）
  - 底部：二选一按钮 [是] [否]
- 问题流程：
  ```
  Step 1: "可行动吗？"
    ├─ 否 → 进入可能清单
    └─ 是 → Step 2: "一步搞定吗？"
              ├─ 否 → 创建项目 → 项目清单
              └─ 是 → 执行清单
  ```

### 4.2 项目清单

**项目卡片：**
- 显示：项目标题 + 当前阶段 + 完成度百分比
- 阶段指示器：PLANNING / EXECUTION / REVIEW
- 操作：点击进入详情

**项目详情页：**
```
┌─────────────────────────────────────────────────────┐
│  返回按钮    项目标题                    完成度 60%   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────┐  ┌──────────────┐   │
│  │                         │  │  粉末列表     │   │
│  │     思维导图画布          │  │              │   │
│  │     （只读展示）          │  │  ☐ 粉末1     │   │
│  │                         │  │  ☐ 粉末2     │   │
│  │   可缩放 + 可拖拽         │  │  ☐ 粉末3     │   │
│  │                         │  │  ...         │   │
│  └─────────────────────────┘  └──────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [统筹谋划]  →  [执行阶段]  →  [复盘阶段]           │
│   05:30         00:00 / 16:30         --:--         │
│  [开始计时]                                    [完成拆分] │
└─────────────────────────────────────────────────────┘
```

**三阶段进度条：**
- 三个阶段横向排列，当前阶段高亮
- 计时显示：当前已用时 / 目标时长（执行阶段为统筹时间 × 3）
- 按钮：
  - 统筹谋划：开始计时 / 完成拆分
  - 执行阶段：（自动）开始执行 / （超时自动进入复盘）
  - 复盘阶段：开始计时 / 完成复盘 → 归档

### 4.3 执行清单

**列表项：**
- 勾选框 + 任务标题
- 来源项目名称（灰色小字）
- 操作：完成（勾选）/ 移入回收箱

### 4.4 复盘阶段

**成果输入：**
- 多行文本框
- 下方按钮：[记录成果] [记录问题]
- 历史记录下拉选择（按使用次数排序）

**历史记录：**
- 标题：历史成果 / 历史问题
- 显示：内容摘要 + 使用次数

### 4.5 归档

**按天分组卡片：**
```
┌─────────────────────────────────┐
│ 📅 2026-04-28                    │
├─────────────────────────────────┤
│ ✓ 项目A          完成度 80%        │
│ ✓ 项目B          完成度 100%       │
│   粉末任务X                      │
├─────────────────────────────────┤
│ 📅 2026-04-27                    │
├─────────────────────────────────┤
│ ✓ 项目C          完成度 100%      │
└─────────────────────────────────┘
```

**展开详情：**
- 点击项目卡片展开
- 显示该项目的所有粉末任务列表

---

## 5. 字体与色彩系统

### 字体

```
主字体：Inter / -apple-system / BlinkMacSystemFont / "Segoe UI" / sans-serif
标题（h1）：font-size: 24px，font-weight: 700
标题（h2）：font-size: 20px，font-weight: 600
标题（h3）：font-size: 16px，font-weight: 600
正文：font-size: 14px，font-weight: 400
辅助文字：font-size: 12px，font-weight: 400，color: #6b7280
```

### 色彩系统

```
Primary:      #06b6d4  (cyan-500)
Primary Hover:#0891b2  (cyan-600)
Success:      #22c55e  (green-500)
Warning:      #f59e0b  (amber-500)
Danger:       #ef4444  (red-500)

Background:   #f9fafb
Surface:      #ffffff
Border:       #e5e7eb

Text Primary: #111827
Text Secondary:#6b7280
Text Disabled: #9ca3af
```

### 节点色彩（与设计稿一致）

```
根节点：  #06b6d4
Level 2： #0ea5e9
Level 3： #22c55e
Level 4： #f59e0b（未完成）
已完成：  #9ca3af + text-decoration: line-through
```

---

## 6. 动画与交互规范

### 过渡动画

```
快速过渡：150ms ease-out（按钮状态变化）
标准过渡：300ms ease-out（Modal、Panel）
慢速过渡：500ms ease-in-out（页面切换）
```

### Hover 效果

```
卡片 Hover：
  transform: translateY(-2px)
  box-shadow: 0 4px 12px rgba(0,0,0,0.1)

按钮 Hover：
  背景色加深 10%
  cursor: pointer

节点 Hover：
  filter: brightness(1.05)
  cursor: pointer
```

### Modal 出现

```
动画：fade + scale
  opacity: 0 → 1
  scale: 0.95 → 1
  duration: 300ms
  easing: ease-out
```

### 计时器

```
数字变化：平滑滚动效果
阶段切换：渐变过渡 500ms
```

---

## 7. 响应式断点

| 设备 | 宽度 | 布局变化 |
|------|------|----------|
| Mobile | 320px - 767px | Sidebar 变为底部 Tab 导航，单栏布局 |
| Tablet | 768px - 1023px | Sidebar 可折叠，双栏布局 |
| Desktop | 1024px - 1439px | 标准双栏布局 |
| Large Desktop | 1440px+ | 宽松布局，最大宽度 1440px |

---

## 8. 设计忌讳（Anti-Patterns）

以下情况需要避免：

- ❌ 默认卡片网格，均匀间距，无层级
- ❌ 通用模板样式（看起来像 Tailwind/shadcn 默认）
- ❌ 平板布局，无深度无层次
- ❌ 安全灰色背景配单一装饰色
- ❌ 未设计的 hover/focus/active 状态
- ❌ 字体未做配对选择

---

## 9. AI 生图提示词（Midjourney / Figma）

### 主提示词

```
a modern minimalist task management app interface with a read-only mind map
display on the left showing a 4-level tree structure, cyan root node connecting
to sky-blue level-2 nodes, then green level-3 nodes, with amber-colored leaf nodes,
white background with light gray accents, spacious layout with clear hierarchy

UI design, system interface, app interface, high-fidelity design, mobile design,
web design, modern minimalist style, product design
```

### 变体提示词（深色主题）

```
a dark mode task management app with a mind map visualization, neon cyan and
amber accent colors on dark charcoal background, futuristic yet professional
feel, glassmorphism panels, subtle gradients

dark UI, dark theme, neon accents, glassmorphism, futuristic UI design
```

### 变体提示词（手绘风格）

```
a hand-drawn style task management app with organic mind map visualization,
soft watercolor-like color palette, playful yet organized feel, pencil sketch
aesthetic with gentle shadows

hand-drawn, sketchy, watercolor, organic shapes, playful UI
```

---

## 10. 参考资料

- 设计风格参考：Linear、Notion、Things 3
- 色彩参考：Tailwind CSS 默认色板
- 图标：Lucide Icons（线性风格）
- 字体：Inter（Google Fonts）
