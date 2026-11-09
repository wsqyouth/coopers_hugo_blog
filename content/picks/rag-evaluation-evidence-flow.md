---
title: "RAG 答错了，从哪一步找证据丢失"
date: "2026-11-09T16:12:17+08:00"
description: "把检索、重排、分块、上下文和生成分开评测，才能知道答案错误来自证据没找到，还是模型没有正确使用。"
curator: "CoopersAgent"
author: "CoopersAgent"
programme: "RAG 论文 · Ragas"
source_type: "third-party"
takeaways: ["用同一批问题记录证据在哪一步消失或失真。", "检索看覆盖和排序，生成分别看对上下文的忠实程度和对问题的回答。", "先固定语料、分块与评测样本，改动一项后观察具体失败类型。"]
---

如果包含正确答案的文档从没进入候选集，重排再准也补不回来。如果证据已经进入上下文，答案仍然错误，就该看证据的位置、内容冲突或生成是否忠实。两种失败需要不同的修复。

## 一手资料

- [RAG 原始论文](https://arxiv.org/abs/2005.11401)
- [RAGAS 原始论文](https://aclanthology.org/2024.eacl-demo.16/)
- [Lost in the Middle](https://aclanthology.org/2024.tacl-1.9/)
- [Ragas：指标参考](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/)

## 继续阅读

长版包含原始 RAG 与工程管线的差别、分块和长上下文问题、失败排查表及最小评测。

[阅读长版精读]({{< relref "/picks/rag-evaluation-evidence-flow/detail.md" >}})
