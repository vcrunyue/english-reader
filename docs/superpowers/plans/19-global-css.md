# Task 19: 全局样式

> **Phase 1 / 21** | 依赖: Task 1

**目标**: 替换默认 globals.css，设置 Tailwind + 自定义字体和基础样式。

**文件**:
- 修改: `src/app/globals.css`
- 修改: `tailwind.config.ts`（如需要）

---

- [ ] **Step 1: 修改 globals.css**

```css
/* src/app/globals.css */
@import "tailwindcss";

/* 基础变量 */
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-serif: 'Georgia', 'Noto Serif', 'Times New Roman', serif;
}

/* 文章正文衬线体 */
.font-serif {
  font-family: var(--font-serif);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 选中文字颜色 */
::selection {
  background-color: #bfdbfe;
  color: #1e3a5f;
}
```

- [ ] **Step 2: 验证样式生效**

```bash
npm run dev
```

确认文章正文使用衬线体，UI 文字使用无衬线体，滚动条样式生效。

- [ ] **Step 3: 提交**

```bash
git add src/app/globals.css && git commit -m "feat: add global styles with serif reading font and custom scrollbar"
```
