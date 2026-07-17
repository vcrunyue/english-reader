import { PageState } from '@/components/feedback/PageState';

export default function StatsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="mb-6 font-display text-3xl text-[#2D2B28] sm:mb-10 sm:text-4xl">学习统计</h1>
      <PageState
        title="本地学习统计将在阶段 1 提供"
        description="当前阶段尚未生成统计数据，后续会基于本机阅读记录进行汇总。"
        tone="empty"
      />
    </div>
  );
}
