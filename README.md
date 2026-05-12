# 网站导航 NAV-Index

一个简洁的个人导航主页，将常用网站按分类整理，支持搜索、拖拽排序、Gist 云同步。

## 功能

- **分类管理** — 添加/编辑/删除分类，支持 emoji 图标
- **卡片管理** — 添加/编辑/删除网站卡片，支持自定义图标 URL
- **实时搜索** — 输入即搜，跨所有分类匹配标题、URL 和描述
- **拖拽排序** — 卡片支持拖拽调整顺序
- **右键菜单** — 卡片和分类均支持右键编辑、删除、移动
- **Gist 同步** — 通过 GitHub Gist 备份和恢复配置
- **导入/导出** — 本地 JSON 文件的导入导出
- **图标自动获取** — 自动通过 Google Favicon API 获取网站图标
- **卡片悬停提示** — 鼠标悬停显示卡片完整描述

## 使用

直接用浏览器打开 `index.html` 即可（需要 HTTP 服务端，ES modules 不支持 `file://`）：

```bash
python3 -m http.server 8080
# 或
npx serve .
```

数据存储在浏览器 `localStorage` 中。

## 项目结构

```
nav-index/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式
├── js/
│   ├── app.js          # 入口：事件绑定、初始化
│   ├── state.js        # 状态管理、localStorage
│   ├── utils.js        # 工具函数
│   ├── render.js       # DOM 渲染
│   ├── categories.js   # 分类 CRUD
│   ├── cards.js        # 卡片 CRUD
│   ├── drag.js         # 拖拽排序
│   ├── context-menu.js # 右键菜单
│   ├── gist.js         # Gist 同步
│   └── settings.js     # 设置、导入导出
└── README.md
```

## 截图

![Nav-Index](https://github.com/popoforg/nav-index/raw/main/screenshot.png)

## License

MIT
