# Task 21: 占位页面 + 收尾

> **Phase 1 / 21** | 依赖: 所有前序任务

**目标**: 为导入文章和学习统计创建占位页面，最终集成测试，推送。

**文件**:
- 创建: `src/app/import/page.tsx`
- 创建: `src/app/stats/page.tsx`
- 验证: `npm run build` 无报错

---

- [ ] **Step 1: 创建导入文章占位页**

```tsx
'use client';

// src/app/import/page.tsx
export default function ImportPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">导入文章</h1>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
        <p className="text-gray-400 mb-2">文章导入功能即将上线</p>
        <p className="text-xs text-gray-300">
          后续将支持粘贴文章文本或输入 URL 自动抓取内容
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建学习统计占位页**

```tsx
// src/app/stats/page.tsx
export default function StatsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">学习统计</h1>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
        <p className="text-gray-400 mb-2">学习统计功能即将上线</p>
        <p className="text-xs text-gray-300">
          后续将展示阅读天数、累积词汇量、收藏统计等数据
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 生产构建验证**

```bash
npm run build
```

必须通过，无类型错误、无构建错误。

- [ ] **Step 4: 全流程手动走一遍**

```bash
npm run dev
```

1. 首页 → 3 张卡片可见，筛选按钮可切换
2. 点击卡片 → 阅读页加载成功，正文渲染
3. 打开高亮开关 → 生词显示色块
4. hover 生词 → 弹窗出现，点收藏
5. 右侧面板 → 生词列表显示，点已认识
6. 回到首页 → 侧边栏点击「生词收藏夹」→ 已收藏词汇可见
7. 侧边栏点击「导入文章」→ 占位页面显示
8. 侧边栏折叠/展开 → 动画正常

- [ ] **Step 5: 最终提交并推送**

```bash
git add -A
git commit -m "feat: complete Phase 1 MVP - core reading experience with vocabulary assistance"
git push origin main
```
