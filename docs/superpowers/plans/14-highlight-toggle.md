# Task 14: 高亮开关组件

> **Phase 1 / 21** | 依赖: Task 6

**目标**: 创建高亮开关 Toggle 按钮，放在阅读页顶栏。

**文件**:
- 创建: `src/components/reader/HighlightToggle.tsx`

---

- [ ] **Step 1: 写 HighlightToggle.tsx**

```tsx
'use client';

// src/components/reader/HighlightToggle.tsx
import { useAppContext } from '@/context/AppContext';

export default function HighlightToggle() {
  const { highlightEnabled, toggleHighlight } = useAppContext();

  return (
    <button
      onClick={toggleHighlight}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        highlightEnabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      title={highlightEnabled ? '关闭高亮' : '开启高亮'}
    >
      <span className="text-[10px] mr-1 text-white/70 w-full text-right pr-0.5">
        {highlightEnabled ? 'ON' : ''}
      </span>
      <span
        className={`absolute left-0.5 inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          highlightEnabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
```

- [ ] **Step 2: 类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 提交**

```bash
git add src/components/reader/HighlightToggle.tsx && git commit -m "feat: add highlight toggle component"
```
