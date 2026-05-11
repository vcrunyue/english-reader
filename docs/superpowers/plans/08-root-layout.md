# Task 8: 根布局

> **Phase 1 / 21** | 依赖: Task 6, Task 7

**目标**: 修改根 layout.tsx，整合侧边栏 + AppProvider + 主内容区。

**文件**:
- 修改: `src/app/layout.tsx`

---

- [ ] **Step 1: 修改 layout.tsx**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'English Reader',
  description: '智能英文阅读学习工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="flex h-screen overflow-hidden bg-white text-gray-900 antialiased">
        <AppProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 启动开发服务器验证布局**

```bash
npm run dev
```

打开 http://localhost:3000 ，应看到左侧侧边栏 + 右侧主内容区。

- [ ] **Step 3: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 4: 提交**

```bash
git add src/app/layout.tsx && git commit -m "feat: integrate sidebar and AppProvider into root layout"
```
