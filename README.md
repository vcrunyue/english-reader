<p align="center">
  <h1 align="center">English Reader</h1>
  <p align="center">面向中国大学生和高中生的智能英文阅读学习工具</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

---

## 这是什么

English Reader 是一个网页端的英文阅读辅助工具。读真实英文文章时，自动识别**四六级及考研范围内的生词**，用颜色高亮标注难度等级。鼠标悬停即可查看释义，一键收藏到生词本。

支持**精读模式**：点击段落，右侧展示逐句中英双语对照。

> 适用于备考四六级 / 考研的大学生，以及想通过阅读扩大词汇量的高中生。

---

## 功能

| 功能 | 说明 |
|------|------|
| 难度高亮 | 自动匹配词汇表，四级绿 / 六级黄 / 考研红，生词一目了然 |
| 悬浮查词 | 鼠标悬停单词 → 弹出释义卡片，支持一键收藏 |
| 精读模式 | 点击段落 → 右侧面板逐句展示中英对照 |
| 生词收藏 | 阅读中收藏生词，集中复习 |
| 熟词管理 | 标记已认识 → 不再高亮干扰 |
| 文章收藏 | 收藏喜欢的文章，按时间排序回顾 |
| 学习统计 | 阅读天数、词汇量、收藏统计（即将上线） |
| 文章导入 | 粘贴文本或输入 URL 自动抓取（即将上线） |
| 难度筛选 | 按四/六/考研筛选文章和单词 |
| 侧边栏折叠 | 可收起侧边栏，扩大阅读区域 |

---

## 快速开始

```bash
# 克隆项目
git clone https://github.com/vcrunyue/english-reader.git
cd english-reader

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

---

## 使用指南

### 阅读文章

1. 首页展示所有文章，可按**难度**和**来源**筛选，支持网格 / 列表两种视图
2. 点击文章卡片进入阅读页
3. 正文中**彩色高亮**的单词 = 四六级/考研范围内的生词
4. **鼠标悬停**高亮单词 → 弹出释义卡片，点击⭐收藏
5. 右侧**单词栏**列出当前文章所有生词，可标记"已认识"

### 精读模式

1. 顶部工具栏打开**精读**开关
2. 点击正文中的任意段落
3. 右侧精读面板展示该段落的**逐句中英对照**
4. 适合逐句理解长难句

### 管理词汇

| 页面 | 路径 | 用途 |
|------|------|------|
| 开始学习 | `/` | 文章浏览与筛选 |
| 生词收藏 | `/collection` | 所有收藏的生词，按难度筛选 |
| 熟词收藏 | `/known-words` | 已标记认识的词汇，不再高亮 |
| 文章收藏 | `/saved-articles` | 收藏的文章列表 |
| 导入文章 | `/import` | 粘贴文本 / 输入 URL 导入文章 |

---

## 添加新文章

文章以 Markdown 文件存放在 `content/articles/` 目录，YAML 头部定义元信息：

```markdown
---
title: "文章标题"
source: "文章来源（如 BBC News）"
difficulty: "cet6"
topic: "technology"
date: "2026-04-15"
coverImage: "/covers/my-article.jpg"   # 可选
---

正文段落，用空行分隔。

§ 中文翻译行，以 § 开头，紧跟在对应英文段落后。
```

- `difficulty`: `cet4` / `cet6` / `postgrad`
- `topic`: `technology` / `environment` / `science` 或其他自定义主题
- `§` 翻译行可选 —— 有则为精读模式提供对照，无则自动分句

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16（App Router）+ React 19 |
| 语言 | TypeScript（strict mode） |
| 样式 | Tailwind CSS 4 |
| 内容 | Markdown（gray-matter 解析 YAML frontmatter） |
| 数据 | 浏览器 localStorage（词汇表 JSON 静态托管） |
| 部署 | Vercel |
| 图标 | Lucide React |
| 字体 | Lora / DM Serif Display / Noto Serif SC / Noto Sans SC |

### 架构

```
src/
├── app/                  # Next.js App Router 页面
│   └── article/[slug]/   # 文章阅读页（SSG 预渲染）
├── components/
│   ├── gallery/          # 文章卡片、筛选栏
│   ├── layout/           # 侧边栏
│   └── reader/           # 正文、弹窗、单词面板、精读面板
├── config/               # 集中配置（难度颜色等）
├── context/              # React Context 状态管理（3 个独立 Context）
├── lib/                  # 工具函数（词汇匹配、Markdown 解析、存储）
└── types/                # TypeScript 类型定义

content/articles/         # 内置文章（Markdown）
public/vocab/             # 四六级 / 考研词汇对照表（JSON）
```

---

## 开发命令

```bash
npm run dev        # 启动开发服务器
npm run build      # 生产构建
npm run lint       # ESLint 代码检查
npm run typecheck  # TypeScript 类型检查
```

---

## 数据存储

所有用户数据（熟词、生词、文章收藏、已读记录）存储在浏览器 `localStorage`，无后端依赖。清除浏览器数据会导致记录丢失。

---

## License

MIT
