# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库工作提供指引。

## 项目概述

英文阅读学习应用 — 面向中国大学生和高中生的网页端英文阅读工具。帮助用户阅读真实英文文章，提供智能词汇辅助。

## 技术栈

- Next.js (App Router) + TypeScript
- Tailwind CSS 样式方案
- Markdown 文件 + YAML frontmatter 管理文章
- React Context + localStorage 存储用户数据
- Vercel 部署

## 开发命令

```bash
npm run dev       # 启动开发服务器 (http://localhost:3000)
npm run build     # 生产构建
npm run lint      # 运行 ESLint
npm run typecheck # TypeScript 类型检查 (tsc --noEmit)
```

## 项目结构

```
english-reader/
├── content/articles/     # 内置文章 (Markdown)
├── public/               # 静态资源 (封面图、词汇 JSON)
│   └── vocab/            # 四六级词汇对照表
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── components/       # React 组件
│   │   ├── layout/       # 侧边栏、顶栏
│   │   ├── reader/       # 文章正文、单词弹窗、生词面板
│   │   └── gallery/      # 文章卡片、筛选
│   ├── lib/              # 工具函数 (词汇匹配、Markdown 解析)
│   ├── hooks/            # 自定义 React Hooks
│   └── context/          # React Context 状态管理
└── docs/superpowers/specs/  # 设计文档
```

## 架构说明

- 所有用户数据存在浏览器 localStorage（无后端、无数据库）
- 文章通过 SSG 在构建时预渲染
- 词汇匹配在客户端根据静态 JSON 表完成
- 悬浮弹窗定位使用 floating UI（防止超出视口）
