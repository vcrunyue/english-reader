import { PageState } from '@/components/feedback/PageState';

export default function ArticleLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageState
        title="正在打开文章"
        description="正在准备正文、词表和阅读状态。"
        tone="loading"
      />
    </div>
  );
}
