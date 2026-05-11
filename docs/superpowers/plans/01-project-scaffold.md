# Task 1: 项目脚手架

> **Phase 1 / 21** | 创建时间: 2026-05-11

**目标**: 使用 `create-next-app` 创建 Next.js + TypeScript + Tailwind 项目骨架。

**依赖**: 无

---

- [ ] **Step 1: 创建项目**

```bash
cd /Users/vcrunyue/Documents/Claude/english-reader
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

提示 `project already contains files` 时选 **Yes** 继续。

- [ ] **Step 2: 安装额外依赖**

```bash
cd /Users/vcrunyue/Documents/Claude/english-reader
npm install gray-matter lucide-react
```

> `gray-matter` 解析 Markdown frontmatter，`lucide-react` 提供侧边栏图标。

- [ ] **Step 3: 验证能跑起来**

```bash
npm run dev
```

打开 http://localhost:3000 ，看到 Next.js 默认页面即可。

- [ ] **Step 4: 类型检查**

```bash
npm run typecheck
```

必须通过，无报错。

- [ ] **Step 5: 提交**

```bash
git add -A && git commit -m "feat: scaffold Next.js + TypeScript + Tailwind project"
```
