'use client';

import { PageState } from '@/components/feedback/PageState';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  void error;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageState
        title="页面暂时无法加载"
        description="你的本地学习数据没有被修改。可以重试，或返回首页。"
        action={{ label: '重试', onClick: reset }}
        tone="error"
      />
    </div>
  );
}
