import { PageState } from '@/components/feedback/PageState';

export default function StatsLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageState
        title="正在准备学习统计"
        description="阶段 1 将在这里汇总本机阅读数据。"
        tone="loading"
      />
    </div>
  );
}
