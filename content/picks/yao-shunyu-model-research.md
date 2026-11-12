---
title: "姚顺宇谈模型研究：进步来自怎样的反馈？"
date: 2026-11-09
description: "预训练有没有撞墙，编程模型为何进步快，AI 能不能自己做研究？这场长访谈用实验和反馈把三个问题串了起来。"
curator: "Coopers"
author: "CoopersAgent"
programme: "姚顺宇访谈"
source_type: bilibili
duration: "约 3 小时 48 分钟"
takeaways:
  - "实验结果不及预期时，先区分规律失效、条件改变和实现错误。"
  - "编程有大量可构造的任务，也有相对清晰的测试反馈，这两点缺一不可。"
  - "AI 辅助研究能否走得更远，要看它能否从实验结果出发提出并检验下一条假设。"
reading_version: "v2"
reading_skill: "deep-read@0.2.2"
---

模型分数上涨，怎样判断是真进步？姚顺宇把答案落在可检验的反馈：异常能否排查，实验能否指向下一条假设。这条线串起预训练、编程，也贯穿他从理论物理转入 AI 的经历。

本期精华是三个具体动作：拆开“撞墙”的原因；核对理论与数值的冲突；把算法效果连同采样成本一起比较。模型能生成代码之后，人仍要定义问题、解释结果，并为整体系统负责。

## 带着问题读

- **预训练还有空间，依据是什么？** 他感觉模型更容易学会新任务；曲线停住时，要排查规律失效、条件不足与实现错误。可见的四个月，不代表知道终点。[读这一节]({{< relref "/picks/yao-shunyu-model-research/detail.md#pretraining" >}})
- **编程为什么进步快？** 测试反馈清楚，GitHub 能构造大量环境，专业用户对好代码有共识。九成以上代码由模型生成，仍需人审查。[读这一节]({{< relref "/picks/yao-shunyu-model-research/detail.md#coding-feedback" >}})
- **物理经历教会了他什么？** 周期边界理论与开放边界数值对不上，促使他重查本征态描述；不能只相信手算。[读这一节]({{< relref "/picks/yao-shunyu-model-research/detail.md#non-hermitian" >}})
- **AI 自己做研究还差哪步？** 写代码之后，还要运行、分析结果、提出新假设并检验，形成完整循环。[读这一节]({{< relref "/picks/yao-shunyu-model-research/detail.md#ml-research" >}})
- **怎样判断算法真的更好？** 同时核对数据、规模稳定性、训练与采样成本，再看是否改善真实瓶颈。[读这一节]({{< relref "/picks/yao-shunyu-model-research/detail.md#research-reliability" >}})

依据所供自动字幕，未核听；姓名按既有节目资料统一为姚顺宇。观点与预测保留访谈的 2026 年第一季度语境。

[阅读全文与主题目录]({{< relref "/picks/yao-shunyu-model-research/detail.md" >}}) · [原始节目](https://www.bilibili.com/video/BV1YR5E6EE9o/)

## 继续阅读

[阅读长版精读]({{< relref "/picks/yao-shunyu-model-research/detail.md" >}})

- [哔哩哔哩：对姚顺宇的 4 小时访谈](https://www.bilibili.com/video/BV1YR5E6EE9o/)
