import { PageState } from '@/components/feedback/PageState';

export default function ImportLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageState
        title="正在准备导入页面"
        description="阶段 1 将在这里提供本地文章导入能力。"
        tone="loading"
      />
    </div>
  );
}
