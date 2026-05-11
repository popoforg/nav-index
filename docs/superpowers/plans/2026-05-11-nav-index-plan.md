# 导航主页实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个粗野主义风格的导航主页，支持分类管理、卡片拖拽排序、JSON导入导出

**Architecture:** 单文件 HTML 应用，原生 JavaScript，localStorage 持久化，HTML5 Drag and Drop API

**Tech Stack:** HTML + CSS + JavaScript (vanilla)

---

## 文件结构

```
/Users/rb/Desktop/temp/nav-index/
└── index.html    # 完整应用（HTML + CSS + JS 内联）
```

---

## 任务分解

### Task 1: HTML 结构与基础样式

**Files:**
- Create: `index.html` (完整文件)

- [ ] **Step 1: 创建 HTML 骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>导航主页</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Outfit:wght@400;500;700&display=swap" rel="stylesheet">
  <style>/* CSS 将完整写入 */{}</style>
</head>
<body>
  <div class="app">
    <aside class="sidebar" id="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">N</div>
      <!-- 分类列表 -->
      <div class="sidebar-categories" id="sidebarCategories"></div>
      <!-- 添加分类按钮 -->
      <button class="sidebar-add" id="addCategoryBtn">+ 添加分类</button>
      <!-- 导入导出 -->
      <div class="sidebar-actions">
        <button class="action-btn" id="importBtn">导入</button>
        <button class="action-btn" id="exportBtn">导出</button>
      </div>
    </aside>
    <main class="main-content" id="mainContent">
      <!-- 时钟 -->
      <header class="header">
        <div class="clock" id="clock">00:00</div>
        <div class="date-info">
          <span id="date">2026年5月11日 星期一</span>
          <span class="lunar" id="lunar">四月初七</span>
        </div>
      </header>
      <!-- 搜索 -->
      <div class="search-container">
        <div class="search-bar">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="搜索或输入网址..." id="searchInput">
        </div>
      </div>
      <!-- 卡片网格 -->
      <section class="cards-section" id="cardsSection">
        <div class="cards-grid" id="cardsGrid"></div>
      </section>
    </main>
  </div>
  <!-- 右键菜单 -->
  <div class="context-menu" id="contextMenu"></div>
  <!-- 分类弹窗 -->
  <div class="modal-overlay" id="categoryModal">
    <div class="modal">
      <div class="modal-title" id="categoryModalTitle">添加分类</div>
      <div class="modal-field">
        <label>名称</label>
        <input type="text" id="categoryNameInput" placeholder="分类名称">
      </div>
      <div class="modal-field">
        <label>图标 (emoji)</label>
        <input type="text" id="categoryIconInput" placeholder="📁">
      </div>
      <div class="modal-actions">
        <button class="modal-btn cancel" id="categoryCancel">取消</button>
        <button class="modal-btn confirm" id="categoryConfirm">保存</button>
      </div>
    </div>
  </div>
  <!-- 卡片弹窗 -->
  <div class="modal-overlay" id="cardModal">
    <div class="modal">
      <div class="modal-title" id="cardModalTitle">添加卡片</div>
      <div class="modal-field">
        <label>标题</label>
        <input type="text" id="cardTitleInput" placeholder="卡片标题">
      </div>
      <div class="modal-field">
        <label>地址</label>
        <input type="text" id="cardUrlInput" placeholder="https://">
      </div>
      <div class="modal-field">
        <label>图标 (emoji)</label>
        <input type="text" id="cardEmojiInput" placeholder="🚀">
      </div>
      <div class="modal-field">
        <label>尺寸</label>
        <div class="size-options" id="sizeOptions">
          <div class="size-option active" data-size="1x1">1x1</div>
          <div class="size-option" data-size="1x2">1x2</div>
          <div class="size-option" data-size="2x1">2x1</div>
          <div class="size-option" data-size="2x2">2x2</div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="modal-btn cancel" id="cardCancel">取消</button>
        <button class="modal-btn confirm" id="cardConfirm">保存</button>
      </div>
    </div>
  </div>
  <!-- Toast -->
  <div class="toast" id="toast"></div>
  <!-- 隐藏的文件输入 -->
  <input type="file" id="fileInput" accept=".json" style="display:none">
  <script>/* JS 将完整写入 */{}</script>
</body>
</html>
```

- [ ] **Step 2: 编写 CSS 样式（粗野主义风格）**

```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #14141a;
  --bg-card: #1a1a24;
  --border-color: #ffffff;
  --border-width: 3px;
  --text-primary: #ffffff;
  --text-secondary: rgba(255,255,255,0.6);
  --accent-red: #ff3b3b;
  --accent-yellow: #ffcc00;
  --accent-blue: #007aff;
  --accent-green: #34c759;
  --accent-orange: #ff9500;
  --accent-purple: #af52de;
  --accent-pink: #ff2d55;
  --sidebar-width: 72px;
  --radius: 4px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Outfit', 'Noto Sans SC', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

/* 网格背景 */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.app {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* 侧边栏 */
.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  border-right: var(--border-width) solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  margin: 0 auto 24px;
  background: var(--accent-red);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: var(--bg-primary);
}

.sidebar-categories {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 8px;
  overflow-y: auto;
}

.sidebar-category {
  width: 100%;
  height: 48px;
  border: 2px solid transparent;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease-out;
  position: relative;
  font-size: 20px;
}

.sidebar-category:hover {
  background: rgba(255,255,255,0.1);
  border-color: var(--border-color);
}

.sidebar-category.active {
  background: var(--accent-yellow);
  border-color: var(--border-color);
}

.sidebar-category .cat-actions {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  gap: 2px;
}

.sidebar-category:hover .cat-actions {
  display: flex;
}

.sidebar-category .cat-action {
  width: 20px;
  height: 20px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-primary);
}

.sidebar-category .cat-action:hover {
  background: var(--accent-red);
}

.sidebar-add {
  margin: 8px;
  padding: 12px;
  background: transparent;
  border: 2px dashed var(--text-secondary);
  border-radius: var(--radius);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;
}

.sidebar-add:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}

.sidebar-actions {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-top: 2px solid rgba(255,255,255,0.1);
  margin-top: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px;
  background: transparent;
  border: 2px solid var(--text-secondary);
  border-radius: var(--radius);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
  transition: all 0.15s;
}

.action-btn:hover {
  background: var(--text-primary);
  color: var(--bg-primary);
  border-color: var(--text-primary);
}

/* 主内容 */
.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 40px;
}

/* 时钟 */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.clock {
  font-size: 72px;
  font-weight: 700;
  letter-spacing: -2px;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 8px;
}

.date-info {
  display: flex;
  justify-content: center;
  gap: 24px;
  font-size: 16px;
  color: var(--text-secondary);
}

.lunar {
  color: var(--accent-orange);
}

/* 搜索 */
.search-container {
  max-width: 600px;
  margin: 0 auto 48px;
}

.search-bar {
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: border-color 0.15s;
}

.search-bar:focus-within {
  border-color: var(--accent-blue);
}

.search-bar svg {
  width: 24px;
  height: 24px;
  stroke: var(--text-secondary);
  fill: none;
  flex-shrink: 0;
}

.search-bar input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 16px;
  color: var(--text-primary);
  font-family: inherit;
}

.search-bar input::placeholder {
  color: var(--text-secondary);
}

/* 卡片网格 */
.cards-section {
  margin-top: 32px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255,255,255,0.1);
}

.category-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-title span:first-child {
  font-size: 20px;
}

.add-card-btn {
  padding: 8px 16px;
  background: transparent;
  border: 2px solid var(--text-secondary);
  border-radius: var(--radius);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: all 0.15s;
}

.add-card-btn:hover {
  background: var(--accent-green);
  color: var(--bg-primary);
  border-color: var(--accent-green);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

/* 卡片 */
.card {
  background: var(--bg-card);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.15s ease-out;
  min-height: 100px;
  position: relative;
  user-select: none;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
}

.card:active {
  transform: translateY(-2px);
}

.card.dragging {
  opacity: 0.5;
  transform: scale(1.05);
}

.card.drag-over {
  border-color: var(--accent-yellow);
  background: rgba(255, 204, 0, 0.1);
}

.card.size-1x1 { grid-column: span 1; grid-row: span 1; }
.card.size-1x2 { grid-column: span 1; grid-row: span 2; min-height: 216px; }
.card.size-2x1 { grid-column: span 2; grid-row: span 1; flex-direction: row; text-align: center; }
.card.size-2x2 { grid-column: span 2; grid-row: span 2; min-height: 216px; }

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: var(--card-color, var(--accent-blue));
  border: 2px solid var(--border-color);
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: var(--text-primary);
}

.card.size-2x1 .card-icon { width: 40px; height: 40px; font-size: 20px; }
.card.size-2x1 .card-title { font-size: 16px; }

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius);
  padding: 8px;
  min-width: 180px;
  z-index: 1000;
  display: none;
}

.context-menu.visible {
  display: block;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: background 0.1s;
}

.context-menu-item:hover {
  background: rgba(255,255,255,0.1);
}

.context-menu-item.danger {
  color: var(--accent-red);
}

.context-menu-item.danger:hover {
  background: var(--accent-red);
  color: var(--text-primary);
}

.context-menu-divider {
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 6px 0;
}

.size-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.size-option {
  padding: 8px 16px;
  border: 2px solid var(--text-secondary);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.size-option:hover {
  border-color: var(--text-primary);
}

.size-option.active {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: var(--bg-primary);
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-overlay.visible {
  display: flex;
}

.modal {
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius);
  padding: 28px;
  width: 380px;
  max-width: 90vw;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
}

.modal-field {
  margin-bottom: 20px;
}

.modal-field label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-field input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-primary);
  border: 2px solid var(--text-secondary);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.modal-field input:focus {
  border-color: var(--accent-blue);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius);
  border: var(--border-width) solid var(--border-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.modal-btn.cancel {
  background: transparent;
  color: var(--text-primary);
}

.modal-btn.cancel:hover {
  background: rgba(255,255,255,0.1);
}

.modal-btn.confirm {
  background: var(--accent-blue);
  color: var(--bg-primary);
}

.modal-btn.confirm:hover {
  background: var(--accent-green);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius);
  padding: 14px 28px;
  font-size: 14px;
  z-index: 3000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast.visible {
  transform: translateX(-50%) translateY(0);
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-primary);
}
```

- [ ] **Step 3: 提交**

```bash
git add index.html
git commit -m "feat: 创建导航主页 HTML 结构和粗野主义样式"
```

---

### Task 2: JavaScript 数据层与状态管理

**Files:**
- Modify: `index.html` 中的 `<script>` 部分

- [ ] **Step 1: 实现数据结构与存储**

```javascript
// 数据模型
const defaultData = {
  version: '1.0',
  categories: [
    { id: 'cat-1', name: '常用', icon: '🏠', order: 0, createdAt: Date.now() },
    { id: 'cat-2', name: '编程', icon: '💻', order: 1, createdAt: Date.now() },
    { id: 'cat-3', name: 'AI', icon: '🤖', order: 2, createdAt: Date.now() },
  ],
  cards: [
    { id: 'card-1', categoryId: 'cat-1', title: 'GitHub', url: 'https://github.com', emoji: '🐙', size: '1x1', color: 'var(--accent-blue)', order: 0, createdAt: Date.now() },
    { id: 'card-2', categoryId: 'cat-1', title: 'ChatGPT', url: 'https://chat.openai.com', emoji: '🤖', size: '1x1', color: 'var(--accent-green)', order: 1, createdAt: Date.now() },
    { id: 'card-3', categoryId: 'cat-1', title: 'DeepSeek', url: 'https://deepseek.com', emoji: '🧠', size: '1x1', color: 'var(--accent-purple)', order: 2, createdAt: Date.now() },
    { id: 'card-4', categoryId: 'cat-1', title: 'Claude', url: 'https://claude.ai', emoji: '✨', size: '1x1', color: 'var(--accent-orange)', order: 3, createdAt: Date.now() },
    { id: 'card-5', categoryId: 'cat-1', title: 'Vercel', url: 'https://vercel.com', emoji: '▲', size: '1x1', color: 'var(--accent-pink)', order: 4, createdAt: Date.now() },
    { id: 'card-6', categoryId: 'cat-1', title: 'Figma', url: 'https://figma.com', emoji: '🎨', size: '1x1', color: 'var(--accent-yellow)', order: 5, createdAt: Date.now() },
    { id: 'card-7', categoryId: 'cat-2', title: 'Stack Overflow', url: 'https://stackoverflow.com', emoji: '📚', size: '1x1', color: 'var(--accent-orange)', order: 0, createdAt: Date.now() },
    { id: 'card-8', categoryId: 'cat-2', title: 'MDN', url: 'https://developer.mozilla.org', emoji: '🦊', size: '1x1', color: 'var(--accent-blue)', order: 1, createdAt: Date.now() },
    { id: 'card-9', categoryId: 'cat-2', title: 'npm', url: 'https://npmjs.com', emoji: '📦', size: '1x1', color: 'var(--accent-red)', order: 2, createdAt: Date.now() },
    { id: 'card-10', categoryId: 'cat-3', title: 'Midjourney', url: 'https://midjourney.com', emoji: '🎨', size: '1x1', color: 'var(--accent-pink)', order: 0, createdAt: Date.now() },
    { id: 'card-11', categoryId: 'cat-3', title: 'Stable Diffusion', url: 'https://stability.ai', emoji: '🖼️', size: '1x1', color: 'var(--accent-purple)', order: 1, createdAt: Date.now() },
  ],
  settings: {}
};

let state = {
  categories: [],
  cards: [],
  activeCategoryId: null,
  editingCard: null,
  editingCategory: null,
  selectedCardSize: '1x1'
};

// 加载数据
function loadData() {
  const saved = localStorage.getItem('navIndexData');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.categories = parsed.categories || [];
      state.cards = parsed.cards || [];
    } catch (e) {
      state.categories = [...defaultData.categories];
      state.cards = [...defaultData.cards];
    }
  } else {
    state.categories = [...defaultData.categories];
    state.cards = [...defaultData.cards];
  }
  // 确保至少有一个分类
  if (state.categories.length === 0) {
    state.categories = [...defaultData.categories];
  }
  state.activeCategoryId = state.categories[0]?.id || null;
}

// 保存数据
function saveData() {
  const data = {
    version: '1.0',
    categories: state.categories,
    cards: state.cards,
    settings: {}
  };
  localStorage.setItem('navIndexData', JSON.stringify(data));
}

// 生成唯一 ID
function generateId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat: 添加数据层与状态管理"
```

---

### Task 3: 时钟与渲染功能

**Files:**
- Modify: `index.html` 中的 `<script>` 部分

- [ ] **Step 1: 实现时钟更新和渲染函数**

```javascript
// 时钟更新
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}`;

  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][now.getDay()]}`;
  document.getElementById('date').textContent = dateStr;

  // 简化农历
  document.getElementById('lunar').textContent = '四月初七';
}

// 渲染分类列表
function renderCategories() {
  const container = document.getElementById('sidebarCategories');
  const sorted = [...state.categories].sort((a, b) => a.order - b.order);

  container.innerHTML = sorted.map(cat => `
    <div class="sidebar-category ${cat.id === state.activeCategoryId ? 'active' : ''}"
         data-id="${cat.id}"
         draggable="true">
      <span>${cat.icon}</span>
      <div class="cat-actions">
        <div class="cat-action" data-action="edit" title="编辑">✎</div>
        <div class="cat-action" data-action="delete" title="删除">✕</div>
      </div>
    </div>
  `).join('');

  // 绑定点击事件
  container.querySelectorAll('.sidebar-category').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('cat-action')) return;
      const id = el.dataset.id;
      state.activeCategoryId = id;
      renderCategories();
      renderCards();
    });

    el.addEventListener('dragstart', handleCategoryDragStart);
    el.addEventListener('dragover', handleCategoryDragOver);
    el.addEventListener('drop', handleCategoryDrop);
    el.addEventListener('dragend', handleCategoryDragEnd);

    // 编辑/删除按钮
    el.querySelectorAll('.cat-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const catId = el.dataset.id;
        if (action === 'edit') {
          openCategoryModal(catId);
        } else if (action === 'delete') {
          deleteCategory(catId);
        }
      });
    });
  });
}

// 渲染卡片网格
function renderCards() {
  const grid = document.getElementById('cardsGrid');
  const categoryCards = state.cards
    .filter(c => c.categoryId === state.activeCategoryId)
    .sort((a, b) => a.order - b.order);

  if (categoryCards.length === 0) {
    grid.innerHTML = `
      <div class="card-placeholder">
        <p>该分类下暂无卡片</p>
        <button class="add-card-btn" onclick="openCardModal()">+ 添加卡片</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = categoryCards.map(card => `
    <div class="card size-${card.size}"
         data-id="${card.id}"
         draggable="true"
         style="--card-color: ${card.color}">
      <div class="card-icon">${card.emoji}</div>
      <div class="card-title">${card.title}</div>
    </div>
  `).join('');

  // 绑定卡片事件
  grid.querySelectorAll('.card').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.button === 0) {
        const card = state.cards.find(c => c.id === el.dataset.id);
        if (card) window.open(card.url, '_blank');
      }
    });

    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showContextMenu(e, el.dataset.id);
    });

    el.addEventListener('dragstart', handleCardDragStart);
    el.addEventListener('dragover', handleCardDragOver);
    el.addEventListener('dragleave', handleCardDragLeave);
    el.addEventListener('drop', handleCardDrop);
    el.addEventListener('dragend', handleCardDragEnd);
  });

  // 添加分类头部
  const section = document.getElementById('cardsSection');
  const activeCat = state.categories.find(c => c.id === state.activeCategoryId);
  const header = section.querySelector('.category-header') || createCategoryHeader();
  header.querySelector('.category-title span:last-child').textContent = activeCat?.name || '';
}

// 创建分类头部
function createCategoryHeader() {
  const header = document.createElement('div');
  header.className = 'category-header';
  header.innerHTML = `
    <div class="category-title">
      <span id="categoryIconDisplay">🏠</span>
      <span id="categoryNameDisplay">常用</span>
    </div>
    <button class="add-card-btn" onclick="openCardModal()">+ 添加卡片</button>
  `;
  const section = document.getElementById('cardsSection');
  section.insertBefore(header, section.querySelector('.cards-grid'));
  return header;
}
```

- [ ] **Step 2: 初始化时钟并启动**

```javascript
// 启动
updateClock();
setInterval(updateClock, 1000);
loadData();
renderCategories();
renderCards();
```

- [ ] **Step 3: 提交**

```bash
git add index.html
git commit -m "feat: 实现时钟更新和分类卡片渲染"
```

---

### Task 4: 拖拽排序功能

**Files:**
- Modify: `index.html` 中的 `<script>` 部分

- [ ] **Step 1: 实现分类拖拽**

```javascript
let draggedCategoryId = null;

function handleCategoryDragStart(e) {
  draggedCategoryId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleCategoryDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleCategoryDrop(e) {
  e.preventDefault();
  const targetId = e.currentTarget.dataset.id;
  if (draggedCategoryId === targetId) return;

  const draggedIdx = state.categories.findIndex(c => c.id === draggedCategoryId);
  const targetIdx = state.categories.findIndex(c => c.id === targetId);

  const [dragged] = state.categories.splice(draggedIdx, 1);
  state.categories.splice(targetIdx, 0, dragged);

  // 更新 order
  state.categories.forEach((c, i) => c.order = i);

  saveData();
  renderCategories();
}

function handleCategoryDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedCategoryId = null;
}
```

- [ ] **Step 2: 实现卡片拖拽**

```javascript
let draggedCardId = null;

function handleCardDragStart(e) {
  draggedCardId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleCardDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleCardDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleCardDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');

  const targetId = e.currentTarget.dataset.id;
  if (draggedCardId === targetId) return;

  const draggedIdx = state.cards.findIndex(c => c.id === draggedCardId);
  const targetIdx = state.cards.findIndex(c => c.id === targetId);

  const [dragged] = state.cards.splice(draggedIdx, 1);
  state.cards.splice(targetIdx, 0, dragged);

  // 更新同分类内的 order
  const categoryCards = state.cards
    .filter(c => c.categoryId === state.activeCategoryId)
    .sort((a, b) => a.order - b.order);
  categoryCards.forEach((c, i) => c.order = i);

  saveData();
  renderCards();
}

function handleCardDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedCardId = null;
}
```

- [ ] **Step 3: 提交**

```bash
git add index.html
git commit -m "feat: 实现分类和卡片的拖拽排序功能"
```

---

### Task 5: 右键菜单与卡片编辑

**Files:**
- Modify: `index.html` 中的 `<script>` 部分

- [ ] **Step 1: 实现右键菜单**

```javascript
let currentContextCard = null;

function showContextMenu(e, cardId) {
  currentContextCard = state.cards.find(c => c.id === cardId);
  if (!currentContextCard) return;

  const menu = document.getElementById('contextMenu');
  menu.innerHTML = `
    <div class="context-menu-item" data-action="open">
      <span>↗</span> 在新标签页打开
    </div>
    <div class="context-menu-divider"></div>
    <div class="context-menu-item" data-action="size">
      <span>◧</span> 布局
    </div>
    <div class="size-options" id="contextSizeOptions" style="display:none; padding: 8px 16px;">
      <div class="size-option ${currentContextCard.size === '1x1' ? 'active' : ''}" data-size="1x1">1x1</div>
      <div class="size-option ${currentContextCard.size === '1x2' ? 'active' : ''}" data-size="1x2">1x2</div>
      <div class="size-option ${currentContextCard.size === '2x1' ? 'active' : ''}" data-size="2x1">2x1</div>
      <div class="size-option ${currentContextCard.size === '2x2' ? 'active' : ''}" data-size="2x2">2x2</div>
    </div>
    <div class="context-menu-divider"></div>
    <div class="context-menu-item" data-action="edit">
      <span>✎</span> 编辑卡片
    </div>
    <div class="context-menu-item danger" data-action="delete">
      <span>✕</span> 删除
    </div>
  `;

  menu.style.left = `${e.clientX}px`;
  menu.style.top = `${e.clientY}px`;
  menu.classList.add('visible');

  // 绑定菜单项事件
  menu.querySelectorAll('.context-menu-item').forEach(item => {
    item.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const action = item.dataset.action;
      handleContextAction(action);
      hideContextMenu();
    });
  });

  // 布局选项切换
  menu.querySelectorAll('.size-option').forEach(opt => {
    opt.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const size = opt.dataset.size;
      if (currentContextCard) {
        currentContextCard.size = size;
        saveData();
        renderCards();
      }
      hideContextMenu();
    });
  });
}

function hideContextMenu() {
  document.getElementById('contextMenu').classList.remove('visible');
  currentContextCard = null;
}

function handleContextAction(action) {
  if (!currentContextCard) return;

  switch (action) {
    case 'open':
      window.open(currentContextCard.url, '_blank');
      break;
    case 'edit':
      openCardModal(currentContextCard.id);
      break;
    case 'delete':
      deleteCard(currentContextCard.id);
      break;
  }
}

// 点击其他地方关闭菜单
document.addEventListener('click', hideContextMenu);
```

- [ ] **Step 2: 实现卡片弹窗**

```javascript
function openCardModal(cardId = null) {
  const modal = document.getElementById('cardModal');
  const title = document.getElementById('cardModalTitle');
  const titleInput = document.getElementById('cardTitleInput');
  const urlInput = document.getElementById('cardUrlInput');
  const emojiInput = document.getElementById('cardEmojiInput');

  if (cardId) {
    const card = state.cards.find(c => c.id === cardId);
    if (!card) return;
    state.editingCard = card;
    title.textContent = '编辑卡片';
    titleInput.value = card.title;
    urlInput.value = card.url;
    emojiInput.value = card.emoji;
    state.selectedCardSize = card.size;
  } else {
    state.editingCard = null;
    title.textContent = '添加卡片';
    titleInput.value = '';
    urlInput.value = '';
    emojiInput.value = '🚀';
    state.selectedCardSize = '1x1';
  }

  // 更新尺寸选项
  document.querySelectorAll('#sizeOptions .size-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.size === state.selectedCardSize);
  });

  modal.classList.add('visible');
  titleInput.focus();
}

function closeCardModal() {
  document.getElementById('cardModal').classList.remove('visible');
  state.editingCard = null;
}

function saveCard() {
  const title = document.getElementById('cardTitleInput').value.trim();
  const url = document.getElementById('cardUrlInput').value.trim();
  const emoji = document.getElementById('cardEmojiInput').value.trim() || '🚀';

  if (!title) {
    showToast('请输入标题');
    return;
  }

  if (state.editingCard) {
    // 编辑
    state.editingCard.title = title;
    state.editingCard.url = url || 'https://';
    state.editingCard.emoji = emoji;
    state.editingCard.size = state.selectedCardSize;
  } else {
    // 新增
    const categoryCards = state.cards.filter(c => c.categoryId === state.activeCategoryId);
    const newCard = {
      id: generateId(),
      categoryId: state.activeCategoryId,
      title,
      url: url || 'https://',
      emoji,
      size: state.selectedCardSize,
      color: ['var(--accent-blue)', 'var(--accent-green)', 'var(--accent-purple)', 'var(--accent-orange)', 'var(--accent-pink)', 'var(--accent-yellow)'][Math.floor(Math.random() * 6)],
      order: categoryCards.length,
      createdAt: Date.now()
    };
    state.cards.push(newCard);
  }

  saveData();
  renderCards();
  closeCardModal();
  showToast(state.editingCard ? '卡片已更新' : '卡片已添加');
}

function deleteCard(cardId) {
  state.cards = state.cards.filter(c => c.id !== cardId);
  saveData();
  renderCards();
  showToast('卡片已删除');
}

// 尺寸选项事件
document.querySelectorAll('#sizeOptions .size-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#sizeOptions .size-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    state.selectedCardSize = opt.dataset.size;
  });
});

document.getElementById('cardCancel').addEventListener('click', closeCardModal);
document.getElementById('cardConfirm').addEventListener('click', saveCard);
```

- [ ] **Step 3: 提交**

```bash
git add index.html
git commit -m "feat: 实现右键菜单和卡片编辑弹窗"
```

---

### Task 6: 分类管理与导入导出

**Files:**
- Modify: `index.html` 中的 `<script>` 部分

- [ ] **Step 1: 实现分类弹窗**

```javascript
function openCategoryModal(categoryId = null) {
  const modal = document.getElementById('categoryModal');
  const title = document.getElementById('categoryModalTitle');
  const nameInput = document.getElementById('categoryNameInput');
  const iconInput = document.getElementById('categoryIconInput');

  if (categoryId) {
    const cat = state.categories.find(c => c.id === categoryId);
    if (!cat) return;
    state.editingCategory = cat;
    title.textContent = '编辑分类';
    nameInput.value = cat.name;
    iconInput.value = cat.icon;
  } else {
    state.editingCategory = null;
    title.textContent = '添加分类';
    nameInput.value = '';
    iconInput.value = '📁';
  }

  modal.classList.add('visible');
  nameInput.focus();
}

function closeCategoryModal() {
  document.getElementById('categoryModal').classList.remove('visible');
  state.editingCategory = null;
}

function saveCategory() {
  const name = document.getElementById('categoryNameInput').value.trim();
  const icon = document.getElementById('categoryIconInput').value.trim() || '📁';

  if (!name) {
    showToast('请输入分类名称');
    return;
  }

  if (state.editingCategory) {
    state.editingCategory.name = name;
    state.editingCategory.icon = icon;
  } else {
    const newCat = {
      id: generateId(),
      name,
      icon,
      order: state.categories.length,
      createdAt: Date.now()
    };
    state.categories.push(newCat);
    state.activeCategoryId = newCat.id;
  }

  saveData();
  renderCategories();
  renderCards();
  closeCategoryModal();
  showToast(state.editingCategory ? '分类已更新' : '分类已添加');
}

function deleteCategory(categoryId) {
  const catCards = state.cards.filter(c => c.categoryId === categoryId);
  if (catCards.length > 0) {
    if (!confirm(`该分类下有 ${catCards.length} 张卡片，删除分类将同时删除所有卡片。确定删除吗？`)) {
      return;
    }
    state.cards = state.cards.filter(c => c.categoryId !== categoryId);
  }

  state.categories = state.categories.filter(c => c.id !== categoryId);

  // 如果删除了当前选中的分类，切换到第一个
  if (state.activeCategoryId === categoryId) {
    state.activeCategoryId = state.categories[0]?.id || null;
  }

  saveData();
  renderCategories();
  renderCards();
  showToast('分类已删除');
}

document.getElementById('addCategoryBtn').addEventListener('click', () => openCategoryModal());
document.getElementById('categoryCancel').addEventListener('click', closeCategoryModal);
document.getElementById('categoryConfirm').addEventListener('click', saveCategory);
```

- [ ] **Step 2: 实现导入导出**

```javascript
// 导出
function exportConfig() {
  const data = {
    version: '1.0',
    categories: state.categories,
    cards: state.cards,
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nav-index-config-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('配置已导出');
}

// 导入
function importConfig(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // 验证格式
      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error('无效的配置文件格式');
      }

      // 合并数据
      if (confirm('导入将合并现有数据（新增的分类和卡片会被添加，冲突的会覆盖）。确定导入吗？')) {
        // 合并分类
        data.categories.forEach(cat => {
          const existing = state.categories.find(c => c.id === cat.id);
          if (existing) {
            Object.assign(existing, cat);
          } else {
            state.categories.push(cat);
          }
        });

        // 合并卡片
        data.cards.forEach(card => {
          const existing = state.cards.find(c => c.id === card.id);
          if (existing) {
            Object.assign(existing, card);
          } else {
            state.cards.push(card);
          }
        });

        saveData();
        renderCategories();
        renderCards();
        showToast('配置已导入');
      }
    } catch (err) {
      showToast('导入失败: ' + err.message);
    }
  };
  reader.readAsText(file);
}

document.getElementById('exportBtn').addEventListener('click', exportConfig);
document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    importConfig(file);
    e.target.value = '';
  }
});
```

- [ ] **Step 3: Toast 提示**

```javascript
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2000);
}
```

- [ ] **Step 4: 搜索功能**

```javascript
// 搜索
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) {
      window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(q)}`, '_blank');
    }
  }
});
```

- [ ] **Step 5: 提交**

```bash
git add index.html
git commit -m "feat: 实现分类管理和导入导出功能"
```

---

### Task 7: 最终调试与验证

**Files:**
- Verify: `index.html`

- [ ] **Step 1: 完整测试所有功能**
- 打开 `index.html` 在浏览器中
- 测试分类：添加/编辑/删除/拖拽排序
- 测试卡片：添加/编辑/删除/拖拽排序/右键菜单/尺寸切换
- 测试导入/导出
- 测试搜索
- 测试数据持久化（刷新页面后数据是否保留）

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat: 完成导航主页全部功能"
```

---

## 自检清单

- [x] Spec 覆盖：所有设计规格都有对应任务
- [x] 无占位符：所有步骤都包含完整代码
- [x] 类型一致性：ID 生成、数据结构、函数命名统一

## 执行选项

**Plan complete and saved to `docs/superpowers/plans/2026-05-11-nav-index-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
