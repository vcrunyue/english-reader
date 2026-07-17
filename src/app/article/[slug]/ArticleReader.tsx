'use client';

import { useVocab } from '@/context/VocabContext';
import { useReading } from '@/context/ReadingContext';
import ArticleBody from '@/components/reader/ArticleBody';
import { PageState } from '@/components/feedback/PageState';

export default function ArticleReader({ content }: { content: string }) {
  const { vocab, error, retry } = useVocab();
  const { closeReadingEnabled, selectedParagraph, selectParagraph } = useReading();

  if (!content.trim()) {
    return (
      <PageState
        title="正文暂不可用"
        description="这篇文章还没有可阅读的正文内容，请返回文章列表选择其他文章。"
        action={{ label: '返回文章列表', href: '/' }}
        tone="empty"
      />
    );
  }

  if (error) {
    return (
      <PageState
        title="词表加载失败"
        description={`${error} 保存在本机的学习数据没有受到影响。`}
        action={{ label: '重新加载词表', onClick: retry }}
        tone="error"
      />
    );
  }

  if (!vocab) {
    return (
      <PageState
        title="正在加载词表"
        description="词表准备好后即可开始阅读和查词。"
        tone="loading"
      />
    );
  }

  return (
    <ArticleBody
      content={content}
      vocab={vocab}
      closeReadingEnabled={closeReadingEnabled}
      selectedParagraph={selectedParagraph}
      onParagraphSelect={selectParagraph}
    />
  );
}
