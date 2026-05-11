# Task 10: 示例文章

> **Phase 1 / 21** | 依赖: Task 9

**目标**: 创建 3 篇示例 Markdown 文章，覆盖四级/六级/考研三个难度。

**文件**:
- 创建: `content/articles/ai-in-education.md`
- 创建: `content/articles/climate-summit.md`
- 创建: `content/articles/space-exploration.md`

---

- [ ] **Step 1: 创建第一篇（六级 — BBC）**

```md
// content/articles/ai-in-education.md
---
title: "How AI Is Transforming Education"
source: "BBC News"
difficulty: "cet6"
topic: "technology"
date: "2026-04-15"
---

## How AI Is Transforming Education

Artificial intelligence is rapidly changing the way students learn and teachers teach. From personalized learning platforms to automated grading systems, AI tools are becoming increasingly common in classrooms around the world.

One of the most significant developments is adaptive learning software. These programs analyze a student's performance and adjust the difficulty of questions accordingly. If a student struggles with a particular concept, the system provides additional practice and explanation. Conversely, if a student demonstrates mastery, the software moves on to more advanced material.

However, experts caution that AI should complement rather than replace human teachers. The role of educators remains crucial in fostering creativity, critical thinking, and emotional intelligence — skills that machines cannot easily replicate.

Privacy concerns also accompany the rise of AI in education. Schools must ensure that student data collected by AI systems is protected and used responsibly. Regulators in several countries are now developing guidelines for the ethical use of AI in educational settings.

Despite these challenges, the potential benefits are substantial. AI can help bridge educational gaps by providing quality learning resources to students in remote or underserved areas. As the technology continues to evolve, its impact on education is likely to grow even further.
```

- [ ] **Step 2: 创建第二篇（四级 — VOA）**

```md
// content/articles/climate-summit.md
---
title: "Global Climate Summit Reaches Historic Agreement"
source: "VOA Learning English"
difficulty: "cet4"
topic: "environment"
date: "2026-03-22"
---

## Global Climate Summit Reaches Historic Agreement

World leaders have reached a historic agreement at the Global Climate Summit in Geneva. After two weeks of intense negotiations, nearly 200 countries committed to reducing carbon emissions by fifty percent before the year 2035.

The agreement represents a major step forward in the fight against climate change. Scientists have warned that without immediate action, global temperatures could rise by more than two degrees Celsius, causing severe weather events and rising sea levels.

Developing countries will receive financial support to help them transition to clean energy sources. The fund, worth one hundred billion dollars annually, will assist nations in building solar and wind power infrastructure.

Environmental groups have welcomed the agreement but stress that implementation will be the real test. Previous climate deals have sometimes failed to deliver on their promises due to lack of enforcement mechanisms.

The next phase involves each country submitting a detailed plan outlining how they will meet their emission targets. Progress will be reviewed every two years to ensure accountability.

Young climate activists, who have been pushing for stronger action, celebrated the news but vowed to continue their campaign for even more ambitious goals.
```

- [ ] **Step 3: 创建第三篇（考研 — The Guardian）**

```md
// content/articles/space-exploration.md
---
title: "The New Space Race: Private Companies Lead the Way"
source: "The Guardian"
difficulty: "postgrad"
topic: "science"
date: "2026-05-01"
---

## The New Space Race: Private Companies Lead the Way

The landscape of space exploration has undergone a profound transformation over the past decade. Whereas government agencies once held a virtual monopoly on extraterrestrial endeavors, private enterprises now dominate the forefront of innovation and implementation.

This paradigm shift has engendered both unprecedented opportunities and formidable challenges. Commercial entities have demonstrated remarkable alacrity in developing reusable rocket technology, substantially diminishing the prohibitive costs traditionally associated with space launches. The ramifications of this achievement extend far beyond mere economic considerations.

Proponents of privatization argue that market competition catalyzes technological advancement more efficaciously than bureaucratic institutions. They cite the exponential proliferation of satellite deployments, the nascent space tourism industry, and ambitious plans for lunar colonization as evidence of this thesis.

Detractors, however, raise pertinent concerns regarding the long-term implications of commercializing the cosmos. Questions of jurisdiction, resource allocation, and environmental stewardship remain largely unresolved. The absence of a comprehensive international regulatory framework exacerbates these uncertainties.

Furthermore, the ascendancy of private entities in space exploration has geopolitical ramifications. Nations that lag in commercial space capabilities risk ceding influence in an arena of growing strategic importance.

As humanity stands on the cusp of becoming a multi-planetary species, the decisions made in this decade will reverberate for generations. The convergence of public policy, private ambition, and scientific inquiry has never been more consequential.
```

- [ ] **Step 4: 验证文章能加载**

```bash
node -e "
const { getAllArticleMetas, getArticleBySlug } = require('./src/lib/articles.ts');
// 需用 tsx 或 ts-node
"
```

> 用 `npx tsx -e "..."` 或直接 `npm run dev` 后在浏览器验证。

- [ ] **Step 5: 提交**

```bash
git add content/articles/ && git commit -m "feat: add 3 sample articles (cet4/cet6/postgrad)"
```
