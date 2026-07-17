import { PageState } from '@/components/feedback/PageState';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageState
        title="没有找到这个页面"
        description="链接可能已经失效，或文章已从本地内容库移除。"
        action={{ label: '返回首页', href: '/' }}
        tone="empty"
      />
    </div>
  );
}
