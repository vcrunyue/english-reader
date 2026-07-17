import { PageState } from '@/components/feedback/PageState';

export default function SavedArticlesLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageState
        title="正在读取文章收藏"
        description="收藏数据保存在本机，读取完成后会自动显示。"
        tone="loading"
      />
    </div>
  );
}
