# 阶段 1：本地学习闭环 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在阶段 0 全绿后，实现版本化 Local Repository、文章导入、完整备份恢复、学习统计和基础复习，使导入内容与内置 Markdown 获得一致的阅读与词汇体验。

**Architecture:** 内置 Markdown 继续由 Server Components 通过 `fs` 读取；用户文章和学习数据只存在浏览器的单一版本化快照中，由 `Local*Repository` 访问。页面和 Context 只消费 Repository 与共享阅读视图，不直接访问 `localStorage`；导入、迁移、备份合并、统计均为可注入依赖的纯函数并以 TDD 实现。

**Tech Stack:** Next.js 16.2 App Router、React 19.2、TypeScript strict、Tailwind CSS 4、Vitest、浏览器 `localStorage`、Web Crypto；不新增后端、数据库、云服务或图表服务

---

## 前置门槛与交付约束

- 必须先完成 `2026-07-16-phase-0-quality-baseline.md`，且 test/typecheck/lint/build/三视口浏览器验证全绿。
- 不提交、不推送；本计划不包含任何 git 写操作。
- 不做 URL 抓取、账号、后端数据库、支付、社交、AI 解析、复杂间隔复习或云同步。
- 不删除 `content/articles/*.md`；导入文章是并行内容源。
- 不新增运行时服务。阶段 0 的 Vitest 足以覆盖本计划；图表用语义 HTML/Tailwind/SVG，不安装图表库。
- 每个任务先跑相关单测；只有整个阶段 1 完成后才运行完整 test/typecheck/lint/build 和生产构建浏览器矩阵，并向用户汇报。

## 规格决策补全

规格没有定义的细节在本计划中固定如下，以保证实现可测试；若用户希望改变，应在执行 Task 1 前修改计划：

- 主数据 key：`english-reader:data`；初始 `schemaVersion = 1`。
- 导入文章路由：`/article/imported/[id]`，避免与内置 slug 碰撞。
- 稳定 id：生产使用 `crypto.randomUUID()`，测试注入 deterministic `IdGenerator`。
- 内容指纹：规范化正文后用 Web Crypto SHA-256；“仍保存副本”保留相同 `contentHash`、生成新 id，绝不覆盖旧文章。
- 长度上限采用规格建议值 100,000 字符；少于 20 个英文词拒绝。
- 阶段 1 继续“打开即已读”：首次打开记录 `opened`，每次成功进入阅读页记录 `read`；累计词数按 article id 去重。
- “待复习”定义为 `status === 'saved' && lastReviewedAt === null`；“最近复习”按 `lastReviewedAt` 倒序，不引入到期算法。
- 热力图强度：0、1、2–3、4–6、7+ 个事件对应 0–4 档；页面提供图例。
- 旧 `YYYY-MM-DD` 只能近似迁移为该日 `12:00:00.000Z`；这是不可恢复原始时刻时的确定性策略，并在 migration result 中记录 warning。
- `ReadingActivity` 增加 `updatedAt`；`BackupEnvelope` 增加 `appVersion`，用于满足规格的通用可迁移字段和导出版本要求。
- `ArticleRepository` 在实现层分成只读 `BuiltInArticleRepository`（server）与 `LocalArticleRepository`（client user data），在共享 `ArticleView` 的 view model 边界组合；不创建会把 `fs` 和 `localStorage` 打入同一 bundle 的伪统一类。

## 文档发现与允许 API

- 规格来源：`docs/superpowers/specs/2026-07-16-product-roadmap-design.md:77-85,120-207,219-245,258-266`。
- 现有可复用 API：
  - `src/lib/articles.ts:14-99`：`getAllArticleMetas`、`getArticleBySlug`、`getAllArticleSlugs`、`extractTranslations`、`stripTranslationLines`，仅服务端。
  - `src/lib/vocab.ts:65-107`：统一英文 token 规则；抽出 `countEnglishWords` 后内置/导入共用。
  - `src/app/article/[slug]/ArticleReader.tsx:7-25`：共享阅读 UI 的起点。
  - `gray-matter@4.0.3` 当前 package 的 `matter(input) -> { data, content }`；其 package 声明 `browser.fs = false`，允许在浏览器本地解析，不上传内容。
  - `useSyncExternalStore` 继续作为外部 Repository snapshot 的 React 订阅边界：[React reference](https://react.dev/reference/react/useSyncExternalStore)。
- 禁止：页面/Context/统计直接 `localStorage`、读取时静默迁移写回、多个 key 的半成功写入、UTC date-only 统计、组件维护冗余计数器、客户端 import `fs/path`。

## 文件结构

### 领域与存储

- `src/domain/models.ts`：所有可迁移实体、snapshot 与 Repository 输入/结果类型。
- `src/domain/errors.ts`：`ValidationError`、`StorageReadError`、`StorageWriteError`。
- `src/domain/time.ts`：ISO 时间与指定时区的自然日 key。
- `src/domain/article-content.ts`：normalize/count/hash。
- `src/repositories/contracts.ts`：规格中的五个业务 Repository 接口及 built-in server facet。
- `src/repositories/server/BuiltInArticleRepository.ts`：只读包装现有 `fs` Markdown loader；不进入客户端 bundle。
- `src/repositories/local/storage-adapter.ts`：浏览器/内存 StorageAdapter。
- `src/repositories/local/migrations.ts`：legacy keys → V1 纯迁移。
- `src/repositories/local/LocalDatabaseStore.ts`：单 key 读、单次 commit、订阅。
- `src/repositories/local/LocalArticleRepository.ts`
- `src/repositories/local/LocalWordRepository.ts`
- `src/repositories/local/LocalProgressRepository.ts`
- `src/repositories/local/LocalSettingsRepository.ts`
- `src/repositories/local/LocalBackupRepository.ts`
- `src/repositories/local/create-local-repositories.ts`
- 同目录对应 `*.test.ts`。

### React/页面

- `src/context/RepositoryContext.tsx`：延迟创建 Local Repositories，并提供稳定 snapshot。
- 修改现有 Collection/KnownWords/Reading Context：兼容现有 hooks，内部改接 Repository。
- `src/lib/import/parse-import.ts` 与测试。
- `src/app/import/ImportArticleForm.tsx`：输入、预览、重复确认、保存。
- `src/app/article/[slug]/ArticleView.tsx`：内置/导入共用阅读壳。
- `src/app/article/imported/[id]/page.tsx` 与 `ImportedArticleRoute.tsx`。
- `src/lib/backup/validate-backup.ts`、`merge-backup.ts` 与测试。
- `src/app/settings/data/page.tsx`、`DataManagement.tsx`。
- `src/lib/stats/calculate-stats.ts` 与测试。
- `src/app/stats/StatsDashboard.tsx`。
- `src/app/collection/CollectionContent.tsx`：三视图、搜索、标记复习。
- `src/components/layout/MoreMenu.tsx`：移动端次级入口。

## 规格覆盖矩阵

| 规格要求 | 实施任务 | 验收证据 |
| --- | --- | --- |
| Repository、版本化数据、迁移、活动模型 | Task 1–3 | domain/store/Repository tests + 无业务层 localStorage |
| 粘贴/Markdown、预览、重复、保存、阅读 | Task 4 | parser tests + 两条浏览器主流程 |
| JSON 导出、预检、合并/替换、失败保护 | Task 5 | validation/merge/repository tests + 幂等浏览器恢复 |
| 四卡、7/30、365 热力图、本地时区 | Task 6 | 统计纯函数 tests + 页面核对 |
| 待复习、已复习、最近复习、搜索筛选 | Task 7 | WordRepository tests + 键盘/触控流程 |
| 全流、无障碍、性能、隐私、质量门槛 | Task 8 | grep + test/typecheck/lint/build + 三视口生产验证 |

---

### Task 1: 定义版本化领域模型、时间与内容纯函数

**Files:**

- Create: `src/domain/models.ts`
- Create: `src/domain/errors.ts`
- Create: `src/domain/time.ts`
- Create: `src/domain/time.test.ts`
- Create: `src/domain/article-content.ts`
- Create: `src/domain/article-content.test.ts`
- Modify: `src/types/index.ts`
- Modify: `src/lib/articles.ts`

- [ ] **Step 1: 先写时间和文章内容的失败测试**

测试必须覆盖：

```ts
expect(toLocalDateKey(new Date('2026-07-16T16:30:00.000Z'), 'Asia/Shanghai'))
  .toBe('2026-07-17');
expect(countEnglishWords("Climate isn't static.")).toBe(3);
expect(normalizeArticleContent('  First line\r\n\r\nSecond line  '))
  .toBe('First line\n\nSecond line');
expect(await hashArticleContent('same text')).toBe(await hashArticleContent(' same text '));
```

Run:

```powershell
npm run test -- src/domain/time.test.ts src/domain/article-content.test.ts
```

Expected: FAIL，因为模块尚不存在。

- [ ] **Step 2: 定义实体与快照**

`src/domain/models.ts` 至少包含以下一致类型；后续任务只能引用这里，不得重复定义：

```ts
import type { Difficulty } from '@/types';

export const CURRENT_SCHEMA_VERSION = 1 as const;
export type WordStatus = 'saved' | 'known';
export type ActivityType =
  | 'opened'
  | 'read'
  | 'saved-article'
  | 'removed-article'
  | 'saved-word'
  | 'known-word'
  | 'removed-word'
  | 'reviewed'
  | 'imported';

export interface ImportedArticle {
  id: string;
  contentHash: string;
  title: string;
  source: string;
  content: string;
  difficulty: Difficulty;
  topic: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordProgress {
  word: string;
  status: WordStatus;
  definition: string;
  pos: string;
  difficulty: Difficulty;
  articleIds: string[];
  createdAt: string;
  lastReviewedAt: string | null;
  reviewCount: number;
  updatedAt: string;
}

export interface SaveWordInput {
  word: string;
  definition: string;
  pos: string;
  difficulty: Difficulty;
  articleId: string;
}

export interface ArticleProgress {
  articleId: string;
  sourceType: 'built-in' | 'imported';
  wordCount: number;
  savedAt: string | null;
  openedAt: string | null;
  readAt: string | null;
  updatedAt: string;
}

export interface ReadingActivity {
  id: string;
  articleId: string | null;
  date: string;
  type: ActivityType;
  wordCount: number;
  updatedAt: string;
}

export interface GalleryPreferences {
  difficulty: Difficulty | 'all';
  source: string;
  view: 'grid' | 'list';
  sort: 'default' | 'wordCount' | 'random';
}

export interface UserSettings {
  id: 'user-settings';
  highlightEnabled: boolean;
  closeReadingEnabled: boolean;
  gallery: GalleryPreferences;
  savedGallery: GalleryPreferences;
  schemaVersion: 1;
  updatedAt: string;
}

export interface LocalDatabaseV1 {
  schemaVersion: 1;
  importedArticles: Record<string, ImportedArticle>;
  words: Record<string, WordProgress>;
  articleProgress: Record<string, ArticleProgress>;
  activities: Record<string, ReadingActivity>;
  settings: UserSettings;
}

export interface BackupEnvelope {
  schemaVersion: number;
  exportedAt: string;
  appVersion: string;
  payload: LocalDatabaseV1;
}

export interface ArticleEventInput {
  articleId: string;
  sourceType: 'built-in' | 'imported';
  wordCount: number;
}

export interface BackupSummary {
  articleCount: number;
  savedWordCount: number;
  knownWordCount: number;
  activityCount: number;
  sourceSchemaVersion: number;
}

export interface BackupPreview {
  envelope: BackupEnvelope;
  summary: BackupSummary;
}

export interface RestoreCounts {
  added: number;
  updated: number;
  skipped: number;
  failed: number;
}

export interface RestoreReport {
  articles: RestoreCounts;
  words: RestoreCounts;
  articleProgress: RestoreCounts;
  activities: RestoreCounts;
  settings: RestoreCounts;
}
```

- [ ] **Step 3: 实现纯函数并统一内置文章词数**

`countEnglishWords` 必须复用与 `tokenize` 相同的正则规则；`src/lib/articles.ts` 删除私有 `countWords`，改用该函数。`hashArticleContent` 用：

```ts
const bytes = new TextEncoder().encode(normalizeArticleContent(content));
const digest = await crypto.subtle.digest('SHA-256', bytes);
return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
```

`toLocalDateKey` 使用 `Intl.DateTimeFormat(...).formatToParts()` 拼出 `YYYY-MM-DD`，不要假设 locale 输出格式，也不要使用 `toISOString().split('T')[0]`。

- [ ] **Step 4: 运行纯函数测试和静态检查**

```powershell
npm run test -- src/domain/time.test.ts src/domain/article-content.test.ts
npm run typecheck
```

Expected: PASS。

---

### Task 2: 以 TDD 实现单快照存储和 legacy migration

**Files:**

- Create: `src/repositories/local/storage-adapter.ts`
- Create: `src/repositories/local/migrations.ts`
- Create: `src/repositories/local/migrations.test.ts`
- Create: `src/repositories/local/LocalDatabaseStore.ts`
- Create: `src/repositories/local/LocalDatabaseStore.test.ts`

- [ ] **Step 1: 写 legacy migration 失败测试**

fixtures 必须覆盖当前真实 keys：`eng_known_words`（`string[]` 和 record 两种）、`eng_saved_words`、`eng_saved_articles`、`eng_read_articles`、两个 toggle、`eng_filter_state`、`eng_filter_state_saved`。

断言至少包括：

- saved/known 冲突最终只有一个 `WordProgress`，同日冲突优先 `known` 并产生 warning。
- date-only 变为 `T12:00:00.000Z` 完整时间。
- read article 生成 `ArticleProgress` 和稳定 `read` activity。
- gallery/toggle 进入 `UserSettings`。
- 输入对象不被 mutation。

- [ ] **Step 2: 写原子 store 失败测试**

用内存 StorageAdapter 模拟 `setItem` 抛出 quota error，断言：

```ts
expect(() => store.update(draft => {
  draft.settings.highlightEnabled = false;
  return draft;
})).toThrow(StorageWriteError);
expect(storage.getItem(DATA_KEY)).toBe(before);
```

还要覆盖损坏 JSON 显式抛 `StorageReadError`、成功写入只调用一次 `setItem(DATA_KEY, ...)`、legacy keys 不删除、同 tab subscriber 只在成功 commit 后触发。

- [ ] **Step 3: 实现可注入 adapter 和 store**

```ts
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface RuntimeDependencies {
  now: () => Date;
  newId: () => string;
}

export const DATA_KEY = 'english-reader:data';
```

`LocalDatabaseStore` 公开 `getSnapshot()`、`getServerSnapshot()`、`subscribe(listener)`、`update(mutator)`、`replace(snapshot)`。snapshot 必须缓存引用；`update` 先 `structuredClone`，完整 stringify 后只写一次主 key，成功后才替换 cache/通知。

- [ ] **Step 4: 运行迁移/store 测试**

```powershell
npm run test -- src/repositories/local/migrations.test.ts src/repositories/local/LocalDatabaseStore.test.ts
```

Expected: PASS，且无 skipped tests。

---

### Task 3: 实现 Repository contracts、Local 实现和 Context 适配

**Files:**

- Create: `src/repositories/contracts.ts`
- Create: `src/repositories/server/BuiltInArticleRepository.ts`
- Create: `src/repositories/local/LocalArticleRepository.ts`
- Create: `src/repositories/local/LocalArticleRepository.test.ts`
- Create: `src/repositories/local/LocalWordRepository.ts`
- Create: `src/repositories/local/LocalWordRepository.test.ts`
- Create: `src/repositories/local/LocalProgressRepository.ts`
- Create: `src/repositories/local/LocalProgressRepository.test.ts`
- Create: `src/repositories/local/LocalSettingsRepository.ts`
- Create: `src/repositories/local/LocalSettingsRepository.test.ts`
- Create: `src/repositories/local/create-local-repositories.ts`
- Create: `src/context/RepositoryContext.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/context/CollectionContext.tsx`
- Modify: `src/context/KnownWordsContext.tsx`
- Modify: `src/context/ReadingContext.tsx`
- Modify: `src/app/FilterableGallery.tsx`
- Modify: `src/app/saved-articles/SavedArticlesContent.tsx`
- Modify: `src/components/reader/ArticleBody.tsx`
- Modify: `src/components/reader/WordPanel.tsx`

- [ ] **Step 1: 写 Repository 合约测试**

必须证明：

- `LocalArticleRepository.createImported`、`findByContentHash`、`getImported`、`listImported`。
- `LocalWordRepository.save` 与 `markKnown` 是单次 store update，互斥且写活动；写失败时旧状态不变。
- `markReviewed` 只允许 saved word，递增 `reviewCount`、写 `lastReviewedAt` 和 `reviewed` activity。
- `LocalProgressRepository.recordOpenAndRead` 首次写 `opened`，每次写 `read`，并维护 `ArticleProgress`。
- `setArticleSaved` 更新同一 `ArticleProgress`，不创建第二套收藏 map。
- `LocalSettingsRepository.updateGallery` 覆盖两个旧页面的散落 key。

- [ ] **Step 2: 固定接口签名**

`contracts.ts` 的公开面保持业务化：

```ts
export interface ArticleRepository {
  listImported(): ImportedArticle[];
  getImported(id: string): ImportedArticle | null;
  findByContentHash(hash: string): ImportedArticle | null;
  createImported(input: Omit<ImportedArticle, 'id' | 'createdAt' | 'updatedAt'>): ImportedArticle;
}

export interface BuiltInArticleRepository {
  list(): ArticleMeta[];
  getBySlug(slug: string): Article | null;
  listSlugs(): string[];
}

export interface WordRepository {
  list(): WordProgress[];
  save(input: SaveWordInput): WordProgress;
  markKnown(input: SaveWordInput): WordProgress;
  unmarkKnown(word: string): void;
  remove(word: string): void;
  markReviewed(word: string): WordProgress;
}

export interface ProgressRepository {
  recordOpenAndRead(input: ArticleEventInput): void;
  setArticleSaved(input: ArticleEventInput, saved: boolean): void;
}

export interface SettingsRepository {
  get(): UserSettings;
  setHighlight(enabled: boolean): void;
  setCloseReading(enabled: boolean): void;
  updateGallery(scope: 'gallery' | 'savedGallery', value: GalleryPreferences): void;
}

export interface BackupRepository {
  export(): BackupEnvelope;
  preview(raw: string): BackupPreview;
  restore(preview: BackupPreview, mode: 'merge' | 'replace'): RestoreReport;
}
```

`SaveWordInput`、`ArticleEventInput`、`BackupPreview` 和 `RestoreReport` 均从 Task 1 的 `src/domain/models.ts` 导入，不得在 Repository 文件重复定义。

- [ ] **Step 3: 创建唯一 RepositoryProvider**

Root layout 从 `package.json` 读取 version 字符串传给 Client Provider；Provider 使用 outer gate + hydrated inner provider，在 client-ready 后延迟创建 browser StorageAdapter、store 与 Repository bundle。`LocalDatabaseStore` 的三个订阅方法实现为绑定后的 arrow properties，snapshot 用：

```ts
const snapshot = useSyncExternalStore(
  repositories.store.subscribe,
  repositories.store.getSnapshot,
  repositories.store.getServerSnapshot,
);
```

不要在模块 scope 访问 `window.localStorage`。

- [ ] **Step 4: 保留现有 hook 名，内部切到 Repository**

三个 Context 从同一 snapshot 派生 view model；组件不再串联 saved/known 两次写。`ArticleBody`/`WordPanel` 只调用 `wordRepository.save` 或 `markKnown`，Repository 原子保证互斥。

两个 gallery 只经 `SettingsRepository` 读取/更新偏好；完成后全仓 gate：

```powershell
rg -n "localStorage|from '@/lib/storage'" src/app src/components src/context
```

Expected: 无匹配；`localStorage` 只存在 `src/repositories/local/storage-adapter.ts`（旧 `src/lib/storage.ts` 可在迁移稳定后删除，不再有消费者）。

- [ ] **Step 5: 运行 Repository 测试与静态检查**

```powershell
npm run test -- src/repositories/local
npm run typecheck
npm run lint
```

Expected: PASS。

---

### Task 4: 以 TDD 实现粘贴/Markdown 导入和共享阅读路由

**Files:**

- Create: `src/lib/import/parse-import.ts`
- Create: `src/lib/import/parse-import.test.ts`
- Modify: `src/domain/article-content.ts`
- Modify: `src/domain/article-content.test.ts`
- Create: `src/app/import/ImportArticleForm.tsx`
- Modify: `src/app/import/page.tsx`
- Create: `src/app/article/[slug]/ArticleView.tsx`
- Create: `src/app/article/imported/[id]/page.tsx`
- Create: `src/app/article/imported/[id]/ImportedArticleRoute.tsx`
- Create: `src/app/article/imported/[id]/loading.tsx`
- Modify: `src/app/article/[slug]/page.tsx`
- Modify: `src/app/article/[slug]/ArticleReader.tsx`
- Modify: `src/components/reader/ArticleBody.tsx`
- Modify: `src/app/article/[slug]/WordPanelWrapper.tsx`
- Modify: `src/components/reader/ArticleReadMarker.tsx`
- Modify: `src/components/reader/ArticleBookmarkButton.tsx`
- Modify: `src/components/gallery/ArticleCard.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/FilterableGallery.tsx`
- Modify: `src/app/saved-articles/page.tsx`
- Modify: `src/app/saved-articles/SavedArticlesContent.tsx`

- [ ] **Step 1: 写 parser 失败测试**

覆盖：纯文本 trim、20 词边界、100,000 字符边界、UTF-8 `.md`、frontmatter 四字段、非法 difficulty、损坏 frontmatter 保留纯文本、相同规范化正文得到相同 SHA-256。

返回类型固定：

```ts
export interface ImportDraft {
  title: string;
  source: string;
  difficulty: Difficulty;
  topic: string;
  content: string;
  wordCount: number;
  contentHash: string;
  warnings: string[];
}

export type ImportParseResult =
  | { ok: true; draft: ImportDraft }
  | { ok: false; message: string; recoverableText: string };
```

- [ ] **Step 2: 实现本地 parser**

`parsePastedText` 和 `parseMarkdownText` 只处理内存字符串。文件先以 `new TextDecoder('utf-8', { fatal: true })` 解码；Markdown 使用现有 `gray-matter`，只接受 `title/source/difficulty/topic`，忽略未知 frontmatter。任何错误返回 result，不 throw 到页面；正文永不上传。

- [ ] **Step 3: 实现三步导入 UI**

`ImportArticleForm` 状态机：`input -> preview -> duplicate -> saving/error`。

- 输入：粘贴或 `.md` file，URL 只显示“后续支持”，不渲染可用 input。
- 预览：标题、来源、难度、主题、wordCount、正文摘要可核对。
- 重复：默认显示“打开已有文章”；次级动作“仍保存副本”。
- 保存失败：保留 draft 和表单，显示“导出旧数据/释放空间”建议。
- 保存成功：`router.push('/article/imported/' + article.id)`。

- [ ] **Step 4: 抽取 ArticleView 并整合导入路由**

`ArticleView` 接口固定：

```ts
interface ArticleViewProps {
  articleId: string;
  sourceType: 'built-in' | 'imported';
  title: string;
  source: string;
  date: string;
  difficulty: Difficulty;
  content: string;
  wordCount: number;
  translations: SentencePair[][];
}
```

内置 `[slug]/page.tsx` 继续 Server Component，通过 `BuiltInArticleRepository` 包装的 `fs` loader 读取并传给 ArticleView。`/article/imported/[id]/page.tsx` 只把 id 传给 Client `ImportedArticleRoute`，后者从 `LocalArticleRepository` 取本地文章并呈现 loading/not-found/ArticleView；不得 import `src/lib/articles.ts` 或 server repository。

`ArticleReadMarker`、收藏按钮、ArticleBody、WordPanel 必须获得 articleId/sourceType/wordCount，保证事件与词来源完整。
`ArticleReadMarker` 用 `useRef(false)` 防止同一次挂载重复记录；Repository 仍负责 `opened` 幂等，不能只依赖组件 guard。

为避免 100,000 字符文章一次生成成千上万个高亮按钮，`article-content.ts` 增加 `splitHighlightChunks(text, 2_000)`，按最近空白切成不超过 2,000 字符的稳定 chunk，并先写边界/文本无损测试。`ArticleBody` 的 `LazyHighlightedChunk` 初始只渲染纯文本；用 `IntersectionObserver`（`rootMargin: '400px'`）在 chunk 接近视口时才渲染高亮词，observer callback 中更新 state，卸载时 disconnect。不得用 `useDeferredValue` 冒充移出主线程，也不得改变存储正文。

- [ ] **Step 5: 首页与收藏页合并内置 metas 与本地 imported metas**

两个 Server page 仍传内置 metas；Client 由 Repository snapshot 追加导入 metas。首页允许用户再次找到导入文章，收藏页按 `ArticleProgress.savedAt` 过滤。两处都用显式 `href`：内置 `/article/[slug]`，导入 `/article/imported/[id]`。ArticleCard 不再自行假设所有 article 都是内置 slug。

- [ ] **Step 6: 运行 import tests 和 build checkpoint**

```powershell
npm run test -- src/lib/import/parse-import.test.ts src/domain/article-content.test.ts src/repositories/local/LocalArticleRepository.test.ts
npm run typecheck
npm run lint
npm run build
```

Expected: PASS；build 不出现客户端 `fs/path` polyfill 错误。

---

### Task 5: 以 TDD 实现备份预检、合并、替换与失败保护

**Files:**

- Create: `src/lib/backup/validate-backup.ts`
- Create: `src/lib/backup/validate-backup.test.ts`
- Create: `src/lib/backup/merge-backup.ts`
- Create: `src/lib/backup/merge-backup.test.ts`
- Create: `src/repositories/local/LocalBackupRepository.ts`
- Create: `src/repositories/local/LocalBackupRepository.test.ts`
- Modify: `src/repositories/local/create-local-repositories.ts`
- Modify: `src/context/RepositoryContext.tsx`
- Create: `src/app/settings/data/page.tsx`
- Create: `src/app/settings/data/DataManagement.tsx`
- Create: `src/app/settings/data/loading.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: 写 schema/merge 失败测试**

覆盖：非法 JSON、缺字段、未知未来 schema、错误实体类型、摘要计数、word 以 lowercase key 合并、实体以 stable id 合并、新 `updatedAt` 优先、activity id 去重、重复导入幂等、输入不 mutation。

Task 1 已固定 `RestoreReport`；本任务的测试直接构造并断言该结构：

```ts
expect(report.activities).toEqual({ added: 0, updated: 0, skipped: 2, failed: 0 });
```

- [ ] **Step 2: 实现 unknown → validated envelope**

手写窄而严格的 type guards；不要用 `JSON.parse` 后 cast，不要用旧 `readJSON` 的 fallback。`preview(raw)` 只返回 envelope + 摘要，不触碰 store。

- [ ] **Step 3: 实现 export/merge/replace**

`export()` 生成 `{ schemaVersion, exportedAt, appVersion, payload }`。`restore(preview, 'merge' | 'replace')` 只通过 `LocalDatabaseStore.replace(nextSnapshot)` 单次 commit；校验或写入任一步失败，旧 snapshot 与 subscriber 状态保持不变。

- [ ] **Step 4: 实现数据管理页**

- 导出：用户点击后生成 Blob + 临时 object URL 下载，随后 revoke。
- 导入：file text → preview，展示文章/生词/熟词/活动/来源版本。
- 默认合并；替换必须输入或点击二次确认。
- 成功显示新增/更新/跳过/失败；失败保留当前数据与已选文件摘要。

- [ ] **Step 5: 运行 backup tests**

```powershell
npm run test -- src/lib/backup src/repositories/local/LocalBackupRepository.test.ts
npm run typecheck
npm run lint
```

Expected: PASS。

---

### Task 6: 以 TDD 实现统计计算与无依赖统计页

**Files:**

- Create: `src/lib/stats/calculate-stats.ts`
- Create: `src/lib/stats/calculate-stats.test.ts`
- Create: `src/app/stats/StatsDashboard.tsx`
- Modify: `src/app/stats/page.tsx`

- [ ] **Step 1: 写跨时区和去重失败测试**

固定 `now` 和 `timeZone`，覆盖：

- 同 article 多个 read activity 只计一次累计词数。
- imported 和 built-in 都统计。
- 学习天数按本地自然日去重。
- 7 天含今天共 7 个 bucket，30 天含今天共 30 个。
- UTC 跨午夜在 `Asia/Shanghai` 归入正确日期。
- 365 天 heatmap 包含 0 活动日和 0–4 强度档。
- current saved/known 来自 `WordProgress` 当前状态，不是历史事件。

- [ ] **Step 2: 实现纯统计 API**

```ts
export interface DailyActivity {
  date: string;
  eventCount: number;
  readWordCount: number;
}

export interface HeatmapDay extends DailyActivity {
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface StatisticsResult {
  overview: {
    readArticleCount: number;
    totalReadWords: number;
    learningDayCount: number;
    savedWordCount: number;
    knownWordCount: number;
  };
  trend7: DailyActivity[];
  trend30: DailyActivity[];
  heatmap365: HeatmapDay[];
}

export function calculateStatistics(
  database: LocalDatabaseV1,
  options: { now: Date; timeZone: string },
): StatisticsResult;
```

统计只读 snapshot，不访问 Repository 或 localStorage，不写缓存计数器。

- [ ] **Step 3: 实现统计页面**

- 四张概览卡。
- 7/30 切换。
- 用 CSS grid/语义列表渲染双指标柱条，不安装图表库。
- 365 日 heatmap 每格可 focus，`aria-label` 包含日期、事件数、阅读词数；hover/focus 显示同一 tooltip。
- 无数据时显示“开始阅读”和“导入文章”。
- 页面从 Repository snapshot `useMemo` 计算，浏览器时区取 `Intl.DateTimeFormat().resolvedOptions().timeZone`。

- [ ] **Step 4: 运行 stats tests**

```powershell
npm run test -- src/lib/stats/calculate-stats.test.ts
npm run typecheck
npm run lint
```

Expected: PASS。

---

### Task 7: 实现基础复习与移动端“更多”信息架构

**Files:**

- Create: `src/app/collection/CollectionContent.tsx`
- Modify: `src/app/collection/page.tsx`
- Create: `src/components/layout/MoreMenu.tsx`
- Modify: `src/components/layout/MobileBottomNav.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/repositories/local/LocalWordRepository.test.ts`

- [ ] **Step 1: 先扩展 review 行为测试**

覆盖 saved word 首次复习、重复复习、known word 拒绝复习、storage 写失败零变化、reviewed activity 内容。

- [ ] **Step 2: 实现生词三视图和搜索**

`CollectionContent` 提供：全部收藏、待复习、最近复习；难度筛选 + 大小写不敏感搜索；“本次已复习”调用 Repository。最近复习显示本地格式日期和次数；不显示“到期/正确率/记忆强度”等未实现结论。

- [ ] **Step 3: 实现五项底栏 + MoreMenu**

固定高频五项：阅读、生词、熟词、统计、更多。“更多”点击打开可关闭抽屉，显式链接导入文章、文章收藏、数据与设置；不再把“更多”伪装为 `/saved-articles` 链接。桌面 Sidebar 增加“数据与设置”。

- [ ] **Step 4: 运行 review tests 和全量单测**

```powershell
npm run test -- src/repositories/local/LocalWordRepository.test.ts
npm run test
```

Expected: PASS。

---

### Task 8: 阶段 1 全流回归、静态门槛、生产浏览器验收与汇报

**Files:**

- No planned code changes unless verification exposes a defect.

- [ ] **Step 1: 运行反模式 grep**

```powershell
rg -n "localStorage|toISOString\(\)\.split|eng_filter_state|eng_known_words|eng_saved_words" src/app src/components src/context src/lib/stats
rg -n "URL.*抓取|账号|云同步|AI.*解析" src/app/import src/app/settings src/app/stats
```

Expected: 第一条无业务层直读或 UTC date-only；第二条最多出现明确“后续支持/本阶段不提供”的说明，不出现可用控件。

- [ ] **Step 2: 运行完整阶段门槛**

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
```

Expected: 全部 exit 0；lint 0/0；无 skipped tests。

- [ ] **Step 3: 启动生产构建**

```powershell
npm run start -- -H 127.0.0.1 -p 3000
```

浏览器使用 320×800、768×1024、1280×800；不安装 Playwright。

- [ ] **Step 4: 验证导入主流程**

1. 粘贴 20+ 词文本 → 预览 → 保存 → `/article/imported/[id]` → 阅读。
2. 上传含四字段 frontmatter 的 UTF-8 Markdown → 预览 → 保存 → 阅读。
3. 导入文章执行收藏、已读、查词、收藏词、标熟、撤销标熟；行为与内置文章一致。
4. 刷新导入文章 route，数据仍在；控制台无 error/hydration warning。

- [ ] **Step 5: 验证导入失败保护**

验证空/少于 20 词、损坏 frontmatter、100,001 字符、重复内容、模拟 quota error。每种情况表单内容保留，旧 snapshot 不变；重复默认打开已有文章，保存副本不会覆盖。

- [ ] **Step 6: 验证备份恢复**

导出 → 修改本地词/文章 → 合并恢复 → 再次合并同一文件，第二次不重复；非法 JSON、错误 schema、错误字段均在 preview 阶段失败且 snapshot 字节保持不变；替换必须二次确认。

- [ ] **Step 7: 验证统计和复习**

核对四卡、7/30 bucket、365 热力图；用跨午夜 fixture 或浏览器注入的测试 snapshot 确认本地日期。生词三视图、搜索、难度筛选、标记复习、最近复习排序均通过键盘和触控。

- [ ] **Step 8: 验证布局、隐私与性能**

- 三视口无整页横向溢出。
- 移动“更多”可达导入/收藏/数据设置。
- 100,000 字符边界内导入和阅读不出现长时间主线程冻结；若可观察卡顿，记录性能 profile 并在完成前修复。
- Network 面板无用户文章/词汇/备份内容上传请求。
- Console 0 runtime error、0 hydration warning。

- [ ] **Step 9: 若修复任何回归，重跑 Step 1–8 的相关项及完整静态门槛**

- [ ] **Step 10: 汇报后停止**

汇报必须包含：

- test/typecheck/lint/build 的 exit code 和测试数量。
- 三视口主流程 PASS/FAIL 表。
- 导入异常、备份幂等/非法数据、统计时区、复习结果。
- localStorage 直读 grep 与网络隐私检查结果。
- 明确“未提交、未推送、未安装外部服务”。

## 阶段 1 完成定义

- Repository、导入 parser、migration、backup merge、statistics 全部有自动化测试。
- 页面、Context、统计无直接 `localStorage` 访问；用户数据只经 Local Repository。
- 粘贴和 Markdown 都完成“输入 → 预览 → 保存 → 阅读”。
- 导入文章的阅读、收藏、已读与词汇行为和内置文章一致。
- 备份合并幂等、替换二次确认、非法备份零写入。
- 统计与活动日志一致，7/30/365 按本地时区正确。
- 基础复习只有主动标记与最近日期，不包含复杂算法。
- `npm run test`、`typecheck`、`lint`、`build` 与三视口生产浏览器验证全部通过。
- 没有提交、推送或外部服务变更。
