import { PageState } from '@/components/feedback/PageState';

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageState
        title="正在准备页面"
        description="内容会保留在本机，页面准备好后会自动显示。"
        tone="loading"
      />
    </div>
  );
}
