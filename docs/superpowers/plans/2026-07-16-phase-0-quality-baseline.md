# 阶段 0：质量与体验基线 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不增加学习功能的前提下，把当前 8 个 ESLint error、6 个 warning、缺失的路由状态、触控/窄屏问题和测试空白收敛为可重复验证的质量基线。

**Architecture:** 保持 Next.js App Router 的 Server/Client Component 边界；用 `useSyncExternalStore` 的 server/client snapshot 取代 effect 中同步初始化，使用 App Router 特殊文件提供路由状态，并将词汇解析等纯逻辑纳入 Vitest。阶段 0 只建立数据层可测试的基础，不提前接入 Repository、导入、备份或统计页面。

**Tech Stack:** Next.js 16.2 App Router、React 19.2、TypeScript strict、Tailwind CSS 4、ESLint 9、Vitest（仅本地 devDependency，无外部服务）

---

## 执行约束与阶段边界

- 本计划依据 `docs/superpowers/specs/2026-07-16-product-roadmap-design.md:64-75,211-237,258-266`。
- 不提交、不推送；本计划故意不包含 `git add`、`git commit` 或 `git push`。
- 不引入账号、后端、数据库、URL 抓取、分析服务或云服务。
- 唯一建议新增的是本地测试运行器 `vitest`。它不是外部服务；若执行时用户把“不得安装”也解释为不得新增 npm devDependency，必须在 Task 1 前暂停确认。
- 阶段 0 完整验收通过前，不开始阶段 1。
- `docs/superpowers/specs/2026-07-16-product-roadmap-design.md` 当前是未跟踪文件；实施期间保留它，不擅自提交或删除。

## 文档发现与允许模式

可复制/遵循的模式：

- App Router `loading.tsx`、`error.tsx`、`not-found.tsx`：[Next.js loading](https://nextjs.org/docs/app/api-reference/file-conventions/loading)、[Next.js not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)。
- `error.tsx` 必须是 Client Component，并接收 `reset()`；不要用普通页面模拟错误边界。
- 外部浏览器状态用 `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`，且 snapshot 在未变化时保持引用稳定：[React useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)。
- Tailwind 继续使用当前 v4 `@import "tailwindcss"` 配置；窄屏局部滚动用 `overflow-x-auto` 和响应式变体，不新增 `tailwind.config.*`：[Tailwind overflow](https://tailwindcss.com/docs/overflow)、[responsive design](https://tailwindcss.com/docs/responsive-design)。
- 复用 `src/lib/vocab.ts:65-107` 的 `tokenize`、`lookupWord`、`analyzeText` 作为首批 characterization tests。

禁止模式：

- 不用 `setTimeout`、`queueMicrotask` 或 eslint disable 绕过 `react-hooks/set-state-in-effect`。
- 不在 render/helper 路径读取 ref；ref 只在事件处理器、callback ref 或 layout effect 中使用。
- 不把 localStorage lazy initializer 直接放进 SSR 首次渲染，避免 hydration 不一致。
- 不用 skipped/空壳测试冒充导入、迁移、统计测试已建立；这些测试随阶段 1 对应模块 TDD 落地。
- 不用临时 `npx vitest` 或 `npx playwright` 下载依赖。
- 不把 Tailwind v4 当成 v3，不新增无必要的配置文件。

## 当前证据基线

`npm run lint` 已在 2026-07-16 只读执行，结果为 8 error / 6 warning：

- error：`FilterableGallery.tsx:87`、`SavedArticlesContent.tsx:93`、`template.tsx:12`、`ArticleBody.tsx:112`、`WordPopup.tsx:53`、三个持久化 Context 的挂载初始化。
- warning：`scripts/build-vocab.mjs:9`、两个随机排序 memo、`layout.tsx:23` 字体 link、`ArticleCard.tsx:64,128` 原生图片。
- 仓库目前没有测试脚本、测试文件、路由状态文件或浏览器验证脚本。

## 文件结构

### 新建

- `vitest.config.ts`：Node 环境、`@` 别名与测试匹配规则。
- `src/lib/vocab.test.ts`：现有词汇纯函数基线。
- `src/hooks/use-client-ready.ts`：SSR 安全的 hydration snapshot。
- `src/components/feedback/PageState.tsx`：可复用 loading/error/empty 呈现。
- `src/app/loading.tsx`、`src/app/error.tsx`、`src/app/not-found.tsx`：根 segment 状态。
- `src/app/article/[slug]/loading.tsx`：阅读页即时 loading。
- `src/app/saved-articles/loading.tsx`、`src/app/import/loading.tsx`、`src/app/stats/loading.tsx`：关键页面 loading。
- `src/app/article/[slug]/MobileReaderTools.tsx`：手机端可触达的词汇/精读抽屉。

### 修改

- `package.json`、`package-lock.json`：测试脚本、Vitest devDependency、lint 零 warning 门槛。
- `src/context/CollectionContext.tsx`、`KnownWordsContext.tsx`、`ReadingContext.tsx`：移除挂载 effect 同步初始化。
- `src/context/VocabContext.tsx`、`src/app/article/[slug]/ArticleReader.tsx`：词表失败与重试。
- `src/app/FilterableGallery.tsx`、`src/app/saved-articles/SavedArticlesContent.tsx`：SSR 安全的筛选偏好初始化和真实 seeded shuffle。
- `src/app/template.tsx`、`src/app/globals.css`：用 template 重挂载 + CSS 动画取代 visible effect。
- `src/components/reader/ArticleBody.tsx`、`WordPopup.tsx`：ref 正确性、点击/键盘/触控弹窗。
- `src/components/gallery/FilterBar.tsx`、`ArticleCard.tsx`：筛选可访问性和 image warning。
- `src/app/layout.tsx`：移除运行时 Google Fonts link，保留现有系统字体 fallback。
- `src/app/article/[slug]/page.tsx`、`PanelContainer.tsx`、`CloseReadingPanelWrapper.tsx`：窄屏阅读工具布局。
- `src/components/layout/MobileBottomNav.tsx`、`Sidebar.tsx`：320px 导航与真实 button 语义。
- `scripts/build-vocab.mjs`：删除未使用的 `SOURCES` 常量。

## 规格覆盖矩阵

| 规格要求 | 实施任务 | 验收证据 |
| --- | --- | --- |
| ESLint、客户端初始化、ArticleBody ref | Task 2–4 | lint 0 error / 0 warning |
| 根级及关键页面 loading/error/empty | Task 4–5 | 特殊文件 + 浏览器状态矩阵 |
| 窄屏筛选、阅读侧栏、触控/键盘 | Task 3、5 | 320/768/1280 浏览器验证 |
| 自动化测试基线 | Task 1 | Vitest + vocab characterization tests |
| 阶段门槛与汇报 | Task 6 | test/typecheck/lint/build + 生产浏览器报告 |

规格把尚未存在的导入解析、迁移和统计测试也写在阶段 0。为遵守“先质量门槛、再 Repository/导入/备份/统计”的用户顺序，阶段 0 只建立 runner 与现有词汇基线；其余测试在阶段 1 对应任务中先于实现落地，不使用 skipped 测试。

---

### Task 1: 建立测试与零 warning 质量门槛

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `src/lib/vocab.test.ts`

- [ ] **Step 1: 安装唯一的本地测试 devDependency**

Run:

```powershell
npm install -D vitest
```

Expected: `package.json` 和 `package-lock.json` 只增加 Vitest 及其传递依赖；不启动或配置外部服务。

- [ ] **Step 2: 写入脚本与配置**

`package.json` 的 scripts 精确收敛为：

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint . --max-warnings=0",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

`vitest.config.ts`：

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: 为现有词汇行为写 characterization tests**

`src/lib/vocab.test.ts` 至少包含以下完整断言：

```ts
import { describe, expect, it } from 'vitest';
import type { VocabMap } from '@/types';
import { analyzeText, lookupWord, tokenize } from '@/lib/vocab';

const vocab: VocabMap = {
  climate: { word: 'climate', definition: '气候', pos: 'n.', difficulty: 'cet4' },
  resilient: { word: 'resilient', definition: '有韧性的', pos: 'adj.', difficulty: 'cet6' },
};

describe('vocab parsing', () => {
  it('tokenizes apostrophes and lowercases words', () => {
    expect(tokenize("Climate isn't static.").map(item => item.word)).toEqual([
      'climate',
      "isn't",
      'static',
    ]);
  });

  it('excludes known words from lookup', () => {
    expect(lookupWord('Climate', vocab, new Set(['climate']))).toBeNull();
  });

  it('deduplicates analyzed vocabulary and orders harder words first', () => {
    expect(analyzeText('Climate resilient climate', vocab, new Set()).map(item => item.word))
      .toEqual(['resilient', 'climate']);
  });
});
```

- [ ] **Step 4: 运行测试基线**

Run:

```powershell
npm run test -- src/lib/vocab.test.ts
```

Expected: 1 file、3 tests PASS。

---

### Task 2: 移除 effect 同步初始化与路由动画 error

**Files:**

- Create: `src/hooks/use-client-ready.ts`
- Modify: `src/context/CollectionContext.tsx`
- Modify: `src/context/KnownWordsContext.tsx`
- Modify: `src/context/ReadingContext.tsx`
- Modify: `src/app/FilterableGallery.tsx`
- Modify: `src/app/saved-articles/SavedArticlesContent.tsx`
- Modify: `src/app/template.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: 添加 SSR 安全的 client-ready snapshot**

```ts
// src/hooks/use-client-ready.ts
import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useClientReady(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
```

- [ ] **Step 2: 将三个 Provider 拆为 SSR 空快照 + hydration 后内部 Provider**

每个文件使用同一结构但保留各自现有公开 hook API；例如 `CollectionContext.tsx`：

```tsx
const EMPTY_COLLECTION: CollectionContextType = {
  savedWords: {},
  saveWordToCollection: () => undefined,
  removeWordFromCollection: () => undefined,
  isWordInCollection: () => false,
  savedArticles: {},
  saveArticleToCollection: () => undefined,
  removeArticleFromCollection: () => undefined,
  isArticleInCollection: () => false,
};

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const ready = useClientReady();
  if (!ready) {
    return (
      <CollectionContext.Provider value={EMPTY_COLLECTION}>
        {children}
      </CollectionContext.Provider>
    );
  }
  return <HydratedCollectionProvider>{children}</HydratedCollectionProvider>;
}

function HydratedCollectionProvider({ children }: { children: React.ReactNode }) {
  const [savedWords, setSavedWords] = useState(() => getSavedWords());
  const [savedArticles, setSavedArticles] = useState(() => getSavedArticles());
  // 保留现有 mutation callbacks 与 Provider value；删除初始化 useEffect。
}
```

`KnownWordsContext.tsx` 的 hydrated state 精确从一次 `getKnownWords()` 派生；`ReadingContext.tsx` 的 hydrated state 精确从 `getReadArticles()`、`getHighlightEnabled()`、`getCloseReadingEnabled()` 派生。不要在 render 中重复调用 storage getter。

- [ ] **Step 3: 把两个 gallery 拆成 outer gate + keyed hydrated component**

用模块级常量和解析函数取代 effect；偏好写入发生在用户 handler 内：

```ts
interface GalleryPreferences {
  difficulty: Difficulty | 'all';
  source: string;
  view: ViewMode;
  sort: SortMode;
}

const DEFAULT_PREFERENCES: GalleryPreferences = {
  difficulty: 'all',
  source: 'all',
  view: 'grid',
  sort: 'default',
};

function readPreferences(key: string): GalleryPreferences {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export default function FilterableGallery(props: { articles: ArticleMeta[] }) {
  const ready = useClientReady();
  const initial = ready ? readPreferences(FILTER_KEY) : DEFAULT_PREFERENCES;
  return <HydratedGallery key={ready ? 'client' : 'server'} {...props} initial={initial} />;
}
```

`HydratedGallery` 用 `useState(initial)`；`onDifficultyChange`、`onSourceChange`、view/sort handler 在更新 state 的同一事件中写入完整 preference。阶段 1 再把这层替换为 `SettingsRepository`。

- [ ] **Step 4: 让 randomSeed 真正参与随机排序**

将两个 gallery 的 `shuffleArray` 改为接收 seed 的确定性洗牌，memo 内调用 `shuffleArray(result, randomSeed)`；不要保留“仅为触发 memo 而存在但未读取”的依赖。

- [ ] **Step 5: 删除 template visible effect**

`src/app/template.tsx` 只保留 pathname 决定动画时长，并让 App Router template 的重挂载触发 CSS animation：

```tsx
'use client';

import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const animationClass = pathname.startsWith('/article/')
    ? 'route-enter route-enter--article'
    : 'route-enter';
  return <div className={`h-full ${animationClass}`}>{children}</div>;
}
```

在 `globals.css` 定义 `route-enter` keyframes，并为 `prefers-reduced-motion: reduce` 禁用动画。

- [ ] **Step 6: 验证本任务消除对应 lint errors**

Run:

```powershell
npm run lint
```

Expected: 不再报告三个 Context、两个 gallery 或 `template.tsx` 的 `set-state-in-effect`；其他尚未处理问题仍可失败。

---

### Task 3: 修复 ArticleBody/WordPopup 正确性并补触控与键盘入口

**Files:**

- Modify: `src/components/reader/ArticleBody.tsx`
- Modify: `src/components/reader/WordPopup.tsx`

- [ ] **Step 1: 把高亮单词渲染拆成显式组件边界**

新增文件内私有组件 `HighlightedText` 和 `HighlightedWord`；父组件只传 `onOpenWord`、`onScheduleClose`。`closeTimerRef.current` 只在 `clearCloseTimer`/`scheduleClose` 事件 callback 内读写，任何 render helper 都不得访问它。

`HighlightedWord` 的交互契约必须包含：

```tsx
<button
  type="button"
  className={`inline px-0.5 text-left ${colorClass}`}
  aria-label={`查看 ${word} 的释义`}
  onMouseEnter={event => onOpenWord(event.currentTarget, word, entry)}
  onFocus={event => onOpenWord(event.currentTarget, word, entry)}
  onClick={event => onOpenWord(event.currentTarget, word, entry)}
  onMouseLeave={onScheduleClose}
>
  {word}
</button>
```

保留正文排版；在 Tailwind class 中显式使用 `appearance-none border-0 bg-transparent [font:inherit]` 消除 button 默认样式，不要恢复为 hover-only span。

- [ ] **Step 2: WordPopup 首帧直接 portal，layout effect 只测量和写 DOM**

删除 `ready` state；弹窗先以 `visibility: hidden`、`left: 0`、`top: 0` 渲染，再在 layout effect 中测量并设置 `left/top/visibility`：

```tsx
const ref = useRef<HTMLDivElement>(null);

useLayoutEffect(() => {
  const element = ref.current;
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const x = clampPopupX(wordLeft, rect.width, window.innerWidth);
  const y = choosePopupY(wordTop, wordBottom, rect.height, window.innerHeight);
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.visibility = 'visible';
}, [wordLeft, wordTop, wordBottom]);

function clampPopupX(anchorLeft: number, width: number, viewportWidth: number): number {
  const minX = VIEWPORT_PAD;
  const maxX = Math.max(minX, viewportWidth - width - VIEWPORT_PAD);
  return Math.min(Math.max(anchorLeft - LEFT_SHIFT, minX), maxX);
}

function choosePopupY(
  anchorTop: number,
  anchorBottom: number,
  height: number,
  viewportHeight: number,
): number {
  const below = anchorBottom + GAP_BELOW;
  const candidate = below + height <= viewportHeight - VIEWPORT_PAD
    ? below
    : anchorTop - height - GAP_ABOVE;
  return Math.max(candidate, VIEWPORT_PAD);
}
```

弹窗容器增加 `max-w-[calc(100vw-2rem)]`，并添加 `role="dialog"`、可读 `aria-label`、显式“关闭释义”按钮；“认识”和“收藏”按钮都添加状态化 `aria-label`。触控按钮最小高度/宽度 44px。

- [ ] **Step 3: 验证 ref 和 popup lint error 消失**

Run:

```powershell
npm run lint
```

Expected: 不再报告 `ArticleBody.tsx` 的 `react-hooks/refs` 或 `WordPopup.tsx` 的 `set-state-in-effect`。

---

### Task 4: 清零 warning，并让失败状态可恢复

**Files:**

- Modify: `scripts/build-vocab.mjs`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/gallery/ArticleCard.tsx`
- Modify: `src/context/VocabContext.tsx`
- Modify: `src/app/article/[slug]/ArticleReader.tsx`

- [ ] **Step 1: 删除未使用的 SOURCES，或让构建脚本唯一从该常量迭代**

删除 `scripts/build-vocab.mjs:8-13` 未被 main flow 使用的 `SOURCES` 常量，不改变现有三次 `buildVocab` 与去重顺序；不添加 eslint disable。

- [ ] **Step 2: 移除运行时 Google Fonts link**

删除 `layout.tsx` 的 `<head><link ... /></head>`。阶段 0 保留 `globals.css:4-7` 已定义的系统 fallback，不在 build 时下载字体，也不新增远程服务。

- [ ] **Step 3: 处理 ArticleCard 图片 warning**

当前 12 篇内置文章没有 `coverImage`，全仓仅 `ArticleMeta` 和 `ArticleCard` 消费该字段。阶段 0 删除两个 `<img>` 分支、保留现有 topic gradient fallback，并从 `ArticleMeta` 删除未被数据源使用的 `coverImage?`；不新增远程域名配置，也不使用 eslint disable。

- [ ] **Step 4: 给词表加载增加 error/retry**

将 Context value 改为：

```ts
interface VocabContextType {
  vocab: VocabMap | null;
  error: string | null;
  retry: () => void;
}
```

异步 `loadVocab()` 的 reject 写入用户可理解文案；`retry()` 清错并重新请求。`ArticleReader` 在 error 时显示 PageState 与重试按钮，正文为空时显示解释性 empty state。

- [ ] **Step 5: 全量 lint 必须 0/0**

Run:

```powershell
npm run lint
```

Expected: exit 0，0 error，0 warning。

---

### Task 5: 建立路由状态、空状态和 320px 阅读体验

**Files:**

- Create: `src/components/feedback/PageState.tsx`
- Create: `src/app/loading.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/article/[slug]/loading.tsx`
- Create: `src/app/saved-articles/loading.tsx`
- Create: `src/app/import/loading.tsx`
- Create: `src/app/stats/loading.tsx`
- Create: `src/app/article/[slug]/MobileReaderTools.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/FilterableGallery.tsx`
- Modify: `src/app/collection/page.tsx`
- Modify: `src/app/saved-articles/SavedArticlesContent.tsx`
- Modify: `src/app/import/page.tsx`
- Modify: `src/app/stats/page.tsx`
- Modify: `src/app/article/[slug]/page.tsx`
- Modify: `src/app/article/[slug]/PanelContainer.tsx`
- Modify: `src/app/article/[slug]/CloseReadingPanelWrapper.tsx`
- Modify: `src/components/gallery/FilterBar.tsx`
- Modify: `src/components/layout/MobileBottomNav.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: 创建共享 PageState**

组件 API 固定为：

```ts
'use client';

interface PageStateProps {
  title: string;
  description: string;
  action?: { label: string; href?: string; onClick?: () => void };
  tone?: 'loading' | 'empty' | 'error';
}
```

若提供 `href` 使用 `next/link`，若提供 `onClick` 使用 button；两者不得同时存在。loading 使用 `aria-live="polite"`，error 使用 `role="alert"`。

- [ ] **Step 2: 按 App Router 约定创建状态文件**

`src/app/error.tsx` 必须包含：

```tsx
'use client';

import { PageState } from '@/components/feedback/PageState';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <PageState
      tone="error"
      title="页面暂时无法加载"
      description="你的本地学习数据没有被修改。可以重试，或返回首页。"
      action={{ label: '重试', onClick: reset }}
    />
  );
}
```

`not-found.tsx` 提供返回首页；各 `loading.tsx` 复用 PageState 或 lightweight skeleton。

- [ ] **Step 3: 区分内容库为空、筛选为空和用户集合为空**

- 首页 `articles.length === 0`：解释内容库为空；filtered 为空：提供清除筛选。
- 收藏页、生词页：提供“开始阅读”入口；筛选为空：提供重置筛选。
- 导入/统计在阶段 0 仍是未实现功能，但用明确 empty state 表达下一阶段范围，不显示 URL 抓取为可用功能。
- 阅读页词表失败可重试；不存在文章走 `notFound()`。

- [ ] **Step 4: 筛选条满足局部滚动与 ARIA**

两个筛选组使用 `role="group"` + `aria-label`；每个按钮使用 `aria-pressed={active}`。来源组外层 `min-w-0 overflow-x-auto`，右侧添加渐隐遮罩和“横向滑动查看更多”屏幕可见提示；整页不得使用 `overflow-x-hidden` 掩盖真实溢出。

- [ ] **Step 5: 手机端把固定侧栏改为可关闭抽屉**

桌面 `PanelContainer` 和 `CloseReadingPanelWrapper` 只在 `lg` 及以上显示。`MobileReaderTools` 在 `<lg` 提供“词汇/精读”两个 44px 按钮，抽屉使用 `role="dialog"`、`aria-modal="true"`、`aria-expanded`、Escape/关闭按钮，并限制 `max-h-[70dvh] overflow-y-auto`。阅读 header 在 320px 使用 wrap 与缩小 padding，所有开关均可达。

- [ ] **Step 6: 收敛移动底栏与侧栏语义**

阶段 0 将移动底栏控制为 5 个入口，移除第 6 个 `/font-preview` 设置 tab，避免 320px 触控目标过窄。Sidebar 折叠控件从 `div role="button"` 改为原生 `<button type="button">`。

- [ ] **Step 7: 静态门槛**

Run:

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
```

Expected: 四条命令全部 exit 0；lint 0 error / 0 warning。

---

### Task 6: 阶段 0 生产构建浏览器验收与汇报

**Files:**

- No code changes unless verification exposes a defect.

- [ ] **Step 1: 启动生产构建，不用 dev server 代替最终验证**

Run:

```powershell
npm run start -- -H 127.0.0.1 -p 3000
```

Expected: `http://127.0.0.1:3000` 可访问。使用 Codex 内置浏览器或已安装 Chrome；不安装 Playwright。

- [ ] **Step 2: 在 320×800、768×1024、1280×800 验证固定矩阵**

每个视口检查：

1. `/`：难度/来源筛选、排序、网格/列表、筛选无结果、键盘操作、无整页横向滚动。
2. `/article/ai-in-education`：返回、收藏、已读、高亮、精读、段落选择、点击/聚焦词汇、弹窗关闭与不越界、移动抽屉控件可达。
3. `/saved-articles`、`/collection`、`/import`、`/stats`：empty/loading 文案与下一步入口。
4. `/article/non-existent` 和未知 URL：not-found UI。
5. 阻断 `/vocab/*.json` 或用浏览器离线模式刷新阅读页：显示 error/retry，不出现未处理 Promise。
6. 控制台：0 runtime error、0 hydration warning。

- [ ] **Step 3: 若发现问题，回到最小相关任务修复并重跑完整门槛**

任何浏览器修复后重新执行：

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
```

- [ ] **Step 4: 汇报阶段结果后停止**

汇报必须列出：

- test/typecheck/lint/build 的命令、exit code 与摘要。
- 三个视口每条流程的 PASS/FAIL。
- 控制台和 hydration 结果。
- 保留的风险或 warning 理由；目标状态应为 0 warning。
- 明确“未提交、未推送、未安装外部服务”。

只有用户确认继续后，才执行阶段 1 计划。

## 阶段 0 完成定义

- `npm run test`、`npm run typecheck`、`npm run lint`、`npm run build` 全通过。
- ESLint 0 error / 0 warning。
- 首页、阅读、收藏、导入、统计具备 loading/error/empty 的适用状态。
- 320px、768px、1280px 下首页筛选与阅读操作无不可达控件、无整页横向溢出。
- 词汇弹窗可通过鼠标、触控、键盘打开和关闭。
- 阶段 1 尚未开始；Repository、导入、备份、统计功能没有被提前接线。
