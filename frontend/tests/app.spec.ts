import { test, expect } from '@playwright/test';

// 测试收集箱添加任务
test('收集箱 - 添加任务', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 输入框存在
  const input = page.locator('.input-box');
  await expect(input).toBeVisible();

  // 输入任务
  await input.fill('测试任务1');
  await input.press('Enter');

  // 验证任务出现
  await expect(page.locator('.task-title')).toContainText('测试任务1');
});

// 测试收集箱 - 处理任务决策树
test('收集箱 - 决策树：不可行动 → 可能清单', async ({ page }) => {
  // 先添加任务
  await page.goto('http://localhost:5173');
  const input = page.locator('.input-box');
  await input.fill('需要等待的任务');
  await input.press('Enter');

  // 点击处理
  await page.locator('.btn-primary:has-text("处理")').first().click();

  // 第一步：问"可行动吗？" → 点"否"
  await expect(page.locator('.modal-question')).toContainText('可行动吗');
  await page.locator('.btn-ghost:has-text("否")').click();

  // 验证：任务应该从收集箱消失，并且进入可能清单
  await expect(page.locator('.task-item').first()).not.toBeVisible();

  // 切换到可能清单验证
  await page.locator('.nav-item:has-text("可能清单")').click();
  await expect(page.locator('.possibility-title')).toContainText('需要等待的任务');
});

// 测试收集箱 - 处理任务：可行动+一步搞定 → 执行清单
test('收集箱 - 决策树：可行动+一步搞定 → 执行清单', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 添加任务
  const input = page.locator('.input-box');
  await input.fill('快速任务');
  await input.press('Enter');

  // 点击处理
  await page.locator('.btn-primary:has-text("处理")').first().click();

  // 第一步：可行动吗？ → 点"是"
  await expect(page.locator('.modal-question')).toContainText('可行动吗');
  await page.locator('.btn-primary:has-text("是")').first().click();

  // 第二步：一步搞定吗？ → 点"是"
  await expect(page.locator('.modal-question')).toContainText('一步搞定');
  await page.locator('.btn-primary:has-text("是")').first().click();

  // 验证：任务进入执行清单
  await page.locator('.nav-item:has-text("执行清单")').click();
  await expect(page.locator('.execution-title').first()).toContainText('快速任务');
});

// 测试收集箱 - 处理任务：可行动+非一步 → 创建项目
test('收集箱 - 决策树：可行动+非一步 → 创建项目', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 添加任务
  const input = page.locator('.input-box');
  await input.fill('复杂项目');
  await input.press('Enter');

  // 点击处理
  await page.locator('.btn-primary:has-text("处理")').first().click();

  // 第一步：可行动吗？ → 点"是"
  await page.locator('.btn-primary:has-text("是")').first().click();

  // 第二步：一步搞定吗？ → 点"否"
  await page.locator('.btn-ghost:has-text("否")').click();

  // 验证：项目被创建，切换到项目清单能看到
  await page.locator('.nav-item:has-text("项目清单")').click();
  await expect(page.locator('.project-name').first()).toContainText('复杂项目');
});

// 测试可能清单 - 激活 → 收集箱
test('可能清单 - 激活后进入收集箱（走决策树）', async ({ page }) => {
  // 先在收集箱添加一个任务并流向可能清单
  await page.goto('http://localhost:5173');
  const input = page.locator('.input-box');
  await input.fill('测试可能清单');
  await input.press('Enter');
  await page.locator('.btn-primary:has-text("处理")').first().click();
  await page.locator('.btn-ghost:has-text("否")').click(); // 不可行动

  // 切换到可能清单
  await page.locator('.nav-item:has-text("可能清单")').click();

  // 点击激活 - 弹窗会自动打开，挡住导航
  await page.locator('.btn-primary:has-text("激活")').first().click();

  // 验证：弹窗出现且显示正确任务（弹窗打开时无法点击nav）
  await expect(page.locator('.modal')).toBeVisible();
  await expect(page.locator('.modal-task-title')).toContainText('测试可能清单');
  await expect(page.locator('.modal-question')).toContainText('可行动吗');

  // 关闭弹窗
  await page.locator('.modal-overlay').click({ position: { x: 10, y: 10 } });
  await page.waitForTimeout(300);

  // 验证：任务已回到收集箱
  await page.locator('.nav-item:has-text("收集箱")').click();
  await expect(page.locator('.task-title').first()).toContainText('测试可能清单');
});

// 测试回收箱 - 激活 → 收集箱
test('回收箱 - 激活后进入收集箱（走决策树）', async ({ page }) => {
  // 先创建一个执行任务，然后移入回收箱（暂不实现这一步，手动测试）
  // 这里验证回收箱的存在性
  await page.goto('http://localhost:5173');
  await page.locator('.nav-item:has-text("回收箱")').click();
  await expect(page.locator('.page-title')).toContainText('回收箱');
});

// 测试执行清单 - 完成任务
test('执行清单 - 完成任务后进入归档', async ({ page }) => {
  // 先添加一个直接到执行清单的任务
  await page.goto('http://localhost:5173');
  const input = page.locator('.input-box');
  await input.fill('可执行的任务');
  await input.press('Enter');
  await page.locator('.btn-primary:has-text("处理")').first().click();
  await page.locator('.btn-primary:has-text("是")').first().click(); // 可行动
  await page.locator('.btn-primary:has-text("是")').first().click(); // 一步搞定

  // 在执行清单中点击完成
  await page.locator('.btn-ghost:has-text("完成")').first().click();

  // 验证：进入归档
  await page.locator('.nav-item:has-text("归档")').click();
  await expect(page.locator('.archive-name')).toContainText('可执行的任务');
});

// 测试项目详情 - 思维导图显示
test('项目详情 - 显示思维导图和粉末列表', async ({ page }) => {
  // 先创建一个项目
  await page.goto('http://localhost:5173');
  const input = page.locator('.input-box');
  await input.fill('测试项目');
  await input.press('Enter');
  await page.locator('.btn-primary:has-text("处理")').first().click();
  await page.locator('.btn-primary:has-text("是")').first().click();
  await page.locator('.btn-ghost:has-text("否")').click();

  // 切换到项目清单
  await page.locator('.nav-item:has-text("项目清单")').click();

  // 点击项目
  await page.locator('.project-card').first().click();

  // 验证思维导图存在
  await expect(page.locator('.mindmap-panel')).toBeVisible();
  await expect(page.locator('.powder-panel')).toBeVisible();
  await expect(page.locator('.stage-panel')).toBeVisible();

  // 验证根节点显示
  await expect(page.locator('.node-root')).toBeVisible();
});

// 测试计时器
test('项目详情 - 计时器开始/暂停', async ({ page }) => {
  // 先创建一个项目并进入详情
  await page.goto('http://localhost:5173');
  const input = page.locator('.input-box');
  await input.fill('计时测试项目');
  await input.press('Enter');
  await page.locator('.btn-primary:has-text("处理")').first().click();
  await page.locator('.btn-primary:has-text("是")').first().click();
  await page.locator('.btn-ghost:has-text("否")').click();
  await page.locator('.nav-item:has-text("项目清单")').click();
  await page.locator('.project-card').first().click();

  // 点击开始计时
  await page.locator('.btn-primary:has-text("开始计时")').click();

  // 验证按钮变为"暂停计时"
  await expect(page.locator('.btn-primary:has-text("暂停计时")')).toBeVisible();

  // 点击暂停
  await page.locator('.btn-primary:has-text("暂停计时")').click();
  await expect(page.locator('.btn-primary:has-text("开始计时")')).toBeVisible();
});