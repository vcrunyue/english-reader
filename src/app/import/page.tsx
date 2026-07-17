import { PageState } from '@/components/feedback/PageState';

export default function ImportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="mb-6 font-display text-3xl text-[#2D2B28] sm:mb-10 sm:text-4xl">导入文章</h1>
      <PageState
        title="本地文章导入将在阶段 1 提供"
        description="当前阶段先完成质量与阅读体验基线，尚未开放文章导入。"
        tone="empty"
      />
    </div>
  );
}
