# Task 3: 词汇表 JSON

> **Phase 1 / 21** | 依赖: Task 1

**目标**: 创建四级/六级/考研词汇对照表 JSON 文件。

**文件**:
- 创建: `public/vocab/cet4.json`
- 创建: `public/vocab/cet6.json`
- 创建: `public/vocab/postgrad.json`

---

- [ ] **Step 1: 创建四级词汇文件**

```json
// public/vocab/cet4.json
{
  "abandon": { "word": "abandon", "definition": "放弃；抛弃", "pos": "v.", "difficulty": "cet4" },
  "ability": { "word": "ability", "definition": "能力；才能", "pos": "n.", "difficulty": "cet4" },
  "abroad": { "word": "abroad", "definition": "在国外；到国外", "pos": "adv.", "difficulty": "cet4" },
  "absence": { "word": "absence", "definition": "缺席；不在", "pos": "n.", "difficulty": "cet4" },
  "absolute": { "word": "absolute", "definition": "绝对的；完全的", "pos": "adj.", "difficulty": "cet4" },
  "absorb": { "word": "absorb", "definition": "吸收；吸引", "pos": "v.", "difficulty": "cet4" },
  "abstract": { "word": "abstract", "definition": "抽象的；摘要", "pos": "adj./n.", "difficulty": "cet4" },
  "abundant": { "word": "abundant", "definition": "丰富的；充裕的", "pos": "adj.", "difficulty": "cet4" },
  "abuse": { "word": "abuse", "definition": "滥用；虐待", "pos": "v./n.", "difficulty": "cet4" },
  "academic": { "word": "academic", "definition": "学术的；学院的", "pos": "adj.", "difficulty": "cet4" },
  "accelerate": { "word": "accelerate", "definition": "加速；加快", "pos": "v.", "difficulty": "cet4" },
  "access": { "word": "access", "definition": "进入；通道；访问", "pos": "n./v.", "difficulty": "cet4" },
  "accompany": { "word": "accompany", "definition": "陪伴；伴随", "pos": "v.", "difficulty": "cet4" },
  "accomplish": { "word": "accomplish", "definition": "完成；实现", "pos": "v.", "difficulty": "cet4" },
  "account": { "word": "account", "definition": "账户；说明", "pos": "n.", "difficulty": "cet4" },
  "accurate": { "word": "accurate", "definition": "准确的；精确的", "pos": "adj.", "difficulty": "cet4" },
  "achieve": { "word": "achieve", "definition": "达到；取得", "pos": "v.", "difficulty": "cet4" },
  "acknowledge": { "word": "acknowledge", "definition": "承认；确认", "pos": "v.", "difficulty": "cet4" },
  "acquire": { "word": "acquire", "definition": "获得；习得", "pos": "v.", "difficulty": "cet4" },
  "adapt": { "word": "adapt", "definition": "适应；改编", "pos": "v.", "difficulty": "cet4" }
}
```

> 上面是示例。实际文件应包含 ~200+ 四级词汇。实现时由 AI 按此格式扩充。

- [ ] **Step 2: 创建六级词汇文件**

```json
// public/vocab/cet6.json
{
  "abnormal": { "word": "abnormal", "definition": "异常的；不正常的", "pos": "adj.", "difficulty": "cet6" },
  "abolish": { "word": "abolish", "definition": "废除；取消", "pos": "v.", "difficulty": "cet6" },
  "abrupt": { "word": "abrupt", "definition": "突然的；唐突的", "pos": "adj.", "difficulty": "cet6" },
  "absurd": { "word": "absurd", "definition": "荒谬的；可笑的", "pos": "adj.", "difficulty": "cet6" },
  "abundance": { "word": "abundance", "definition": "丰富；充裕", "pos": "n.", "difficulty": "cet6" },
  "academy": { "word": "academy", "definition": "学院；研究院", "pos": "n.", "difficulty": "cet6" },
  "accommodate": { "word": "accommodate", "definition": "容纳；提供住宿", "pos": "v.", "difficulty": "cet6" },
  "accord": { "word": "accord", "definition": "一致；符合", "pos": "n./v.", "difficulty": "cet6" },
  "accountability": { "word": "accountability", "definition": "责任；问责制", "pos": "n.", "difficulty": "cet6" },
  "accumulate": { "word": "accumulate", "definition": "积累；积聚", "pos": "v.", "difficulty": "cet6" },
  "acquaint": { "word": "acquaint", "definition": "使熟悉；使认识", "pos": "v.", "difficulty": "cet6" },
  "activate": { "word": "activate", "definition": "激活；启动", "pos": "v.", "difficulty": "cet6" },
  "acute": { "word": "acute", "definition": "急性的；敏锐的", "pos": "adj.", "difficulty": "cet6" },
  "addict": { "word": "addict", "definition": "上瘾；沉迷者", "pos": "n./v.", "difficulty": "cet6" },
  "adequate": { "word": "adequate", "definition": "充足的；适当的", "pos": "adj.", "difficulty": "cet6" },
  "administer": { "word": "administer", "definition": "管理；执行", "pos": "v.", "difficulty": "cet6" },
  "adolescent": { "word": "adolescent", "definition": "青少年；青春期的", "pos": "n./adj.", "difficulty": "cet6" },
  "adverse": { "word": "adverse", "definition": "不利的；相反的", "pos": "adj.", "difficulty": "cet6" },
  "advocate": { "word": "advocate", "definition": "倡导；拥护者", "pos": "v./n.", "difficulty": "cet6" },
  "aesthetic": { "word": "aesthetic", "definition": "美学的；审美的", "pos": "adj.", "difficulty": "cet6" }
}
```

> 同上，需扩充至 ~200+ 六级词汇。

- [ ] **Step 3: 创建考研词汇文件**

```json
// public/vocab/postgrad.json
{
  "aberration": { "word": "aberration", "definition": "异常；偏差", "pos": "n.", "difficulty": "postgrad" },
  "abstain": { "word": "abstain", "definition": "戒绝；弃权", "pos": "v.", "difficulty": "postgrad" },
  "accolade": { "word": "accolade", "definition": "赞扬；荣誉", "pos": "n.", "difficulty": "postgrad" },
  "acquiesce": { "word": "acquiesce", "definition": "默许；勉强同意", "pos": "v.", "difficulty": "postgrad" },
  "acrimonious": { "word": "acrimonious", "definition": "尖刻的；激烈的", "pos": "adj.", "difficulty": "postgrad" },
  "admonish": { "word": "admonish", "definition": "告诫；警告", "pos": "v.", "difficulty": "postgrad" },
  "adorn": { "word": "adorn", "definition": "装饰；装扮", "pos": "v.", "difficulty": "postgrad" },
  "adulation": { "word": "adulation", "definition": "奉承；谄媚", "pos": "n.", "difficulty": "postgrad" },
  "adversary": { "word": "adversary", "definition": "对手；敌手", "pos": "n.", "difficulty": "postgrad" },
  "aesthetic": { "word": "aesthetic", "definition": "审美的；美学的", "pos": "adj.", "difficulty": "postgrad" }
}
```

> 同上，需扩充至 ~100+ 考研词汇。

- [ ] **Step 4: 验证文件格式**

```bash
node -e "
const c4 = require('./public/vocab/cet4.json');
const c6 = require('./public/vocab/cet6.json');
const pg = require('./public/vocab/postgrad.json');
console.log('cet4:', Object.keys(c4).length, 'words');
console.log('cet6:', Object.keys(c6).length, 'words');
console.log('postgrad:', Object.keys(pg).length, 'words');
"
```

- [ ] **Step 5: 提交**

```bash
git add public/vocab/ && git commit -m "feat: add CET-4/CET-6/postgrad vocabulary lookup tables"
```
