# UI 细节修复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复折叠侧栏首按钮宽度、文章难度高亮消失，以及词汇悬浮卡片操作色块过大的问题。

**Architecture:** 保持现有 React 组件和交互逻辑不变，只调整三个视觉边界。触控点击区继续保持至少 44px，但侧栏和词汇卡片的可见背景色块按用户要求单独收窄。

**Tech Stack:** Next.js App Router、React 19、TypeScript、Tailwind CSS 4、Vitest、Codex 本地浏览器

---

## 执行约束

- 不提交、不推送、不安装依赖。
- 不改变收藏、熟词、高亮开关或词汇弹窗的数据逻辑。
- 浏览器现状作为 RED 基线：折叠按钮 48px、下方导航约 44px；高亮词计算背景为透明；词卡操作色块为 55×44px。

### Task 1: 对齐折叠侧栏首按钮

**Files:**

- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: 保留 RED 测量证据**

折叠状态下首按钮宽 48px，下方导航约 44px；差异来自 `min-w-12` 与 `!mx-[3px]`。

- [ ] **Step 2: 最小调整折叠态尺寸**

将折叠态改为固定 44px 点击区并居中于 54px 侧栏：

```tsx
collapsed
  ? '!mx-[5px] w-11 min-w-11 shrink-0 justify-center !px-0'
  : 'gap-3'
```

- [ ] **Step 3: 浏览器复验**

在 1280px 视口折叠侧栏，确认首按钮与下方导航的可见 hover 宽度一致，首按钮点击区仍为 44px。

### Task 2: 恢复文章难度高亮

**Files:**

- Modify: `src/components/reader/ArticleBody.tsx`

- [ ] **Step 1: 保留 RED 测量证据**

高亮词同时带 `bg-transparent` 与难度背景类，浏览器计算背景为 `rgba(0, 0, 0, 0)`。

- [ ] **Step 2: 删除冲突背景类**

从 `HighlightedWord` 的 className 删除 `bg-transparent`；保留 `appearance-none`、`border-0`、字体继承和 `getDifficultyColor()` 返回的难度色。

- [ ] **Step 3: 浏览器复验**

高亮开启时确认 CET-4、CET-6、考研词的计算背景不透明；关闭高亮后正文仍不渲染词汇按钮。

### Task 3: 缩小词汇悬浮卡片操作色块

**Files:**

- Modify: `src/components/reader/WordPopup.tsx`

- [ ] **Step 1: 保留 RED 测量证据**

“认识”和“收藏”按钮的可见色块当前均为 55×44px。

- [ ] **Step 2: 分离点击区与可见色块**

外层 button 继续保持至少 44px 点击区并改为透明 group；在内部增加约 28px 高、横向 padding 为 6px 的 pill：

```tsx
const btnBase =
  'group flex min-h-11 min-w-11 shrink-0 items-center justify-center p-0 text-xs font-semibold';

<span className="inline-flex h-7 items-center justify-center gap-1 rounded-md px-1.5 transition-colors">
  {/* icon + label */}
</span>
```

状态色与 hover 色应用到内部 span；关闭按钮保持 44×44px 不变。

- [ ] **Step 3: 浏览器复验**

确认外层点击区不小于 44px，内部色块约 28px 高、宽度较原 55px 略小，认识/收藏状态与焦点行为不变。

### Task 4: 完整验证

**Files:**

- No additional files.

- [ ] **Step 1: 运行静态门槛**

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
```

Expected: 全部 exit 0；lint 0 error / 0 warning。

- [ ] **Step 2: 生产浏览器复验**

重新启动最新 production build，复测三项原始问题、整页横向溢出和控制台错误；保持本地预览服务运行。

