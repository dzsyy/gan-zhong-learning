# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/app.spec.ts >> 可能清单 - 激活后进入收集箱（走决策树）
- Location: tests/app.spec.ts:91:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.modal-task-title')
Expected substring: "测试可能清单"
Received string:    "测试任务1"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.modal-task-title')
    9 × locator resolved to <div class="modal-task-title">测试任务1</div>
      - unexpected value "测试任务1"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]: 干中学
    - generic [ref=e6] [cursor=pointer]:
      - generic [ref=e7]: 📥
      - generic [ref=e8]: 收集箱
    - generic [ref=e9] [cursor=pointer]:
      - generic [ref=e10]: 📋
      - generic [ref=e11]: 项目清单
    - generic [ref=e12] [cursor=pointer]:
      - generic [ref=e13]: ⚡
      - generic [ref=e14]: 执行清单
    - generic [ref=e15] [cursor=pointer]:
      - generic [ref=e16]: 💭
      - generic [ref=e17]: 可能清单
    - generic [ref=e18] [cursor=pointer]:
      - generic [ref=e19]: ♻️
      - generic [ref=e20]: 回收箱
    - generic [ref=e21] [cursor=pointer]:
      - generic [ref=e22]: 📦
      - generic [ref=e23]: 归档
  - generic [ref=e25]:
    - heading "收集箱" [level=1] [ref=e27]
    - textbox "输入任务标题，回车添加..." [ref=e28]
    - generic [ref=e29]:
      - generic [ref=e30]:
        - generic [ref=e31]:
          - generic [ref=e32]: 测试任务1
          - generic [ref=e33]: 23:31
        - generic [ref=e34]:
          - button "处理" [ref=e35] [cursor=pointer]
          - button "删除" [ref=e36] [cursor=pointer]
      - generic [ref=e37]:
        - generic [ref=e38]:
          - generic [ref=e39]: 测试可能清单
          - generic [ref=e40]: 23:31
        - generic [ref=e41]:
          - button "处理" [ref=e42] [cursor=pointer]
          - button "删除" [ref=e43] [cursor=pointer]
    - generic [ref=e45]:
      - generic [ref=e46]: 测试任务1
      - generic [ref=e47]: 可行动吗？
      - generic [ref=e48]:
        - button "是" [ref=e49] [cursor=pointer]
        - button "否" [ref=e50] [cursor=pointer]
```

# Test source

```ts
  8   |   const input = page.locator('.input-box');
  9   |   await expect(input).toBeVisible();
  10  | 
  11  |   // 输入任务
  12  |   await input.fill('测试任务1');
  13  |   await input.press('Enter');
  14  | 
  15  |   // 验证任务出现
  16  |   await expect(page.locator('.task-title')).toContainText('测试任务1');
  17  | });
  18  | 
  19  | // 测试收集箱 - 处理任务决策树
  20  | test('收集箱 - 决策树：不可行动 → 可能清单', async ({ page }) => {
  21  |   // 先添加任务
  22  |   await page.goto('http://localhost:5173');
  23  |   const input = page.locator('.input-box');
  24  |   await input.fill('需要等待的任务');
  25  |   await input.press('Enter');
  26  | 
  27  |   // 点击处理
  28  |   await page.locator('.btn-primary:has-text("处理")').first().click();
  29  | 
  30  |   // 第一步：问"可行动吗？" → 点"否"
  31  |   await expect(page.locator('.modal-question')).toContainText('可行动吗');
  32  |   await page.locator('.btn-ghost:has-text("否")').click();
  33  | 
  34  |   // 验证：任务应该从收集箱消失，并且进入可能清单
  35  |   await expect(page.locator('.task-item').first()).not.toBeVisible();
  36  | 
  37  |   // 切换到可能清单验证
  38  |   await page.locator('.nav-item:has-text("可能清单")').click();
  39  |   await expect(page.locator('.possibility-title')).toContainText('需要等待的任务');
  40  | });
  41  | 
  42  | // 测试收集箱 - 处理任务：可行动+一步搞定 → 执行清单
  43  | test('收集箱 - 决策树：可行动+一步搞定 → 执行清单', async ({ page }) => {
  44  |   await page.goto('http://localhost:5173');
  45  | 
  46  |   // 添加任务
  47  |   const input = page.locator('.input-box');
  48  |   await input.fill('快速任务');
  49  |   await input.press('Enter');
  50  | 
  51  |   // 点击处理
  52  |   await page.locator('.btn-primary:has-text("处理")').first().click();
  53  | 
  54  |   // 第一步：可行动吗？ → 点"是"
  55  |   await expect(page.locator('.modal-question')).toContainText('可行动吗');
  56  |   await page.locator('.btn-primary:has-text("是")').first().click();
  57  | 
  58  |   // 第二步：一步搞定吗？ → 点"是"
  59  |   await expect(page.locator('.modal-question')).toContainText('一步搞定');
  60  |   await page.locator('.btn-primary:has-text("是")').first().click();
  61  | 
  62  |   // 验证：任务进入执行清单
  63  |   await page.locator('.nav-item:has-text("执行清单")').click();
  64  |   await expect(page.locator('.execution-title').first()).toContainText('快速任务');
  65  | });
  66  | 
  67  | // 测试收集箱 - 处理任务：可行动+非一步 → 创建项目
  68  | test('收集箱 - 决策树：可行动+非一步 → 创建项目', async ({ page }) => {
  69  |   await page.goto('http://localhost:5173');
  70  | 
  71  |   // 添加任务
  72  |   const input = page.locator('.input-box');
  73  |   await input.fill('复杂项目');
  74  |   await input.press('Enter');
  75  | 
  76  |   // 点击处理
  77  |   await page.locator('.btn-primary:has-text("处理")').first().click();
  78  | 
  79  |   // 第一步：可行动吗？ → 点"是"
  80  |   await page.locator('.btn-primary:has-text("是")').first().click();
  81  | 
  82  |   // 第二步：一步搞定吗？ → 点"否"
  83  |   await page.locator('.btn-ghost:has-text("否")').click();
  84  | 
  85  |   // 验证：项目被创建，切换到项目清单能看到
  86  |   await page.locator('.nav-item:has-text("项目清单")').click();
  87  |   await expect(page.locator('.project-name').first()).toContainText('复杂项目');
  88  | });
  89  | 
  90  | // 测试可能清单 - 激活 → 收集箱
  91  | test('可能清单 - 激活后进入收集箱（走决策树）', async ({ page }) => {
  92  |   // 先在收集箱添加一个任务并流向可能清单
  93  |   await page.goto('http://localhost:5173');
  94  |   const input = page.locator('.input-box');
  95  |   await input.fill('测试可能清单');
  96  |   await input.press('Enter');
  97  |   await page.locator('.btn-primary:has-text("处理")').first().click();
  98  |   await page.locator('.btn-ghost:has-text("否")').click(); // 不可行动
  99  | 
  100 |   // 切换到可能清单
  101 |   await page.locator('.nav-item:has-text("可能清单")').click();
  102 | 
  103 |   // 点击激活 - 弹窗会自动打开，挡住导航
  104 |   await page.locator('.btn-primary:has-text("激活")').first().click();
  105 | 
  106 |   // 验证：弹窗出现且显示正确任务（弹窗打开时无法点击nav）
  107 |   await expect(page.locator('.modal')).toBeVisible();
> 108 |   await expect(page.locator('.modal-task-title')).toContainText('测试可能清单');
      |                                                   ^ Error: expect(locator).toContainText(expected) failed
  109 |   await expect(page.locator('.modal-question')).toContainText('可行动吗');
  110 | 
  111 |   // 关闭弹窗
  112 |   await page.locator('.modal-overlay').click({ position: { x: 10, y: 10 } });
  113 |   await page.waitForTimeout(300);
  114 | 
  115 |   // 验证：任务已回到收集箱
  116 |   await page.locator('.nav-item:has-text("收集箱")').click();
  117 |   await expect(page.locator('.task-title').first()).toContainText('测试可能清单');
  118 | });
  119 | 
  120 | // 测试回收箱 - 激活 → 收集箱
  121 | test('回收箱 - 激活后进入收集箱（走决策树）', async ({ page }) => {
  122 |   // 先创建一个执行任务，然后移入回收箱（暂不实现这一步，手动测试）
  123 |   // 这里验证回收箱的存在性
  124 |   await page.goto('http://localhost:5173');
  125 |   await page.locator('.nav-item:has-text("回收箱")').click();
  126 |   await expect(page.locator('.page-title')).toContainText('回收箱');
  127 | });
  128 | 
  129 | // 测试执行清单 - 完成任务
  130 | test('执行清单 - 完成任务后进入归档', async ({ page }) => {
  131 |   // 先添加一个直接到执行清单的任务
  132 |   await page.goto('http://localhost:5173');
  133 |   const input = page.locator('.input-box');
  134 |   await input.fill('可执行的任务');
  135 |   await input.press('Enter');
  136 |   await page.locator('.btn-primary:has-text("处理")').first().click();
  137 |   await page.locator('.btn-primary:has-text("是")').first().click(); // 可行动
  138 |   await page.locator('.btn-primary:has-text("是")').first().click(); // 一步搞定
  139 | 
  140 |   // 在执行清单中点击完成
  141 |   await page.locator('.btn-ghost:has-text("完成")').first().click();
  142 | 
  143 |   // 验证：进入归档
  144 |   await page.locator('.nav-item:has-text("归档")').click();
  145 |   await expect(page.locator('.archive-name')).toContainText('可执行的任务');
  146 | });
  147 | 
  148 | // 测试项目详情 - 思维导图显示
  149 | test('项目详情 - 显示思维导图和粉末列表', async ({ page }) => {
  150 |   // 先创建一个项目
  151 |   await page.goto('http://localhost:5173');
  152 |   const input = page.locator('.input-box');
  153 |   await input.fill('测试项目');
  154 |   await input.press('Enter');
  155 |   await page.locator('.btn-primary:has-text("处理")').first().click();
  156 |   await page.locator('.btn-primary:has-text("是")').first().click();
  157 |   await page.locator('.btn-ghost:has-text("否")').click();
  158 | 
  159 |   // 切换到项目清单
  160 |   await page.locator('.nav-item:has-text("项目清单")').click();
  161 | 
  162 |   // 点击项目
  163 |   await page.locator('.project-card').first().click();
  164 | 
  165 |   // 验证思维导图存在
  166 |   await expect(page.locator('.mindmap-panel')).toBeVisible();
  167 |   await expect(page.locator('.powder-panel')).toBeVisible();
  168 |   await expect(page.locator('.stage-panel')).toBeVisible();
  169 | 
  170 |   // 验证根节点显示
  171 |   await expect(page.locator('.node-root')).toBeVisible();
  172 | });
  173 | 
  174 | // 测试计时器
  175 | test('项目详情 - 计时器开始/暂停', async ({ page }) => {
  176 |   // 先创建一个项目并进入详情
  177 |   await page.goto('http://localhost:5173');
  178 |   const input = page.locator('.input-box');
  179 |   await input.fill('计时测试项目');
  180 |   await input.press('Enter');
  181 |   await page.locator('.btn-primary:has-text("处理")').first().click();
  182 |   await page.locator('.btn-primary:has-text("是")').first().click();
  183 |   await page.locator('.btn-ghost:has-text("否")').click();
  184 |   await page.locator('.nav-item:has-text("项目清单")').click();
  185 |   await page.locator('.project-card').first().click();
  186 | 
  187 |   // 点击开始计时
  188 |   await page.locator('.btn-primary:has-text("开始计时")').click();
  189 | 
  190 |   // 验证按钮变为"暂停计时"
  191 |   await expect(page.locator('.btn-primary:has-text("暂停计时")')).toBeVisible();
  192 | 
  193 |   // 点击暂停
  194 |   await page.locator('.btn-primary:has-text("暂停计时")').click();
  195 |   await expect(page.locator('.btn-primary:has-text("开始计时")')).toBeVisible();
  196 | });
```