'use client';

const FONTS = [
  {
    name: '当前使用：Noto Sans SC',
    family: 'Noto Sans SC',
    category: '无衬线体 · 全局默认',
    where: '侧边栏标签、按钮、正文内中文、弹窗',
  },
  {
    name: '当前使用：Noto Serif SC',
    family: 'Noto Serif SC',
    category: '衬线体 · font-zh-serif',
    where: '筛选标签、页面标题、提示文字',
  },
  {
    name: 'ZCOOL XiaoWei',
    family: 'ZCOOL XiaoWei',
    category: '衬线体 · 文学温暖',
    where: '备选 — 适合标题/标签',
  },
  {
    name: 'Ma Shan Zheng',
    family: 'Ma Shan Zheng',
    category: '书法体 · 手写风雅',
    where: '备选 — 适合特殊强调',
  },
  {
    name: 'ZCOOL QingKe HuangYou',
    family: 'ZCOOL QingKe HuangYou',
    category: '装饰体 · 趣味',
    where: '备选 — 适合装饰元素',
  },
  {
    name: 'Zhi Mang Xing',
    family: 'Zhi Mang Xing',
    category: '行书体 · 流畅',
    where: '备选 — 适合特殊标题',
  },
  {
    name: 'Liu Jian Mao Cao',
    family: 'Liu Jian Mao Cao',
    category: '草书体 · 飘逸',
    where: '备选 — 适合装饰',
  },
];

const SAMPLES: Record<string, string> = {
  title: '发现文章',
  subtitle: '生词收藏 · 熟词收藏',
  nav: '开始学习  导入文章  学习统计',
  filter: '难度  全部  四级  六级  考研  来源',
  body: '人工智能正在改变教育。世界领导人达成历史性气候协议。',
  hint: '还没有收藏的生词。阅读文章时点击 ⭐ 即可收藏。',
  label: '高亮  词汇  句子  已认识  返回',
};

export default function FontPreviewPage() {
  return (
    <div className="min-h-screen bg-[#FEFCF5] px-8 py-10 font-sans">
      <h1 className="font-display text-4xl text-[#2D2B28] mb-2">中文字体预览</h1>
      <p className="text-sm text-[#78716C] mb-10 font-zh-serif">
        当前项目使用 Noto Sans SC + Noto Serif SC，下方展示同类风格备选
      </p>

      <div className="space-y-10 max-w-4xl">
        {FONTS.map(font => (
          <div key={font.name} className="border border-[#E8E4DD] rounded-xl p-6 bg-white/60">
            <div className="flex items-baseline gap-3 mb-1">
              <h2 className="text-lg font-semibold text-[#2D2B28]">{font.name}</h2>
              <span className="text-xs text-[#78716C] font-zh-serif">{font.category}</span>
            </div>
            <p className="text-xs text-[#A09888] mb-4">出现位置：{font.where}</p>

            <div className="space-y-3" style={{ fontFamily: `${font.family}, sans-serif` }}>
              {Object.entries(SAMPLES).map(([key, text]) => (
                <div key={key} className="flex items-start gap-4 border-b border-[#E8E4DD]/50 pb-2">
                  <span className="text-[11px] text-[#A09888] w-12 shrink-0 mt-0.5 font-sans">
                    {key}
                  </span>
                  <span className={
                    key === 'title' ? 'text-2xl text-[#2D2B28]' :
                    key === 'subtitle' ? 'text-base text-[#2D2B28]' :
                    key === 'nav' ? 'text-[13px] text-[#78716C]' :
                    key === 'filter' ? 'text-sm text-[#78716C]' :
                    key === 'body' ? 'text-[15px] text-[#2D2B28] leading-relaxed' :
                    'text-xs text-[#78716C]'
                  }>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
