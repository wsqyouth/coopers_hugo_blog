---
title: "长任务怎样保住下一步需要的上下文"
date: "2026-11-09T16:12:17+08:00"
description: "把任务记录、长期记忆、原始产物和本轮输入拆开，才知道上下文可以压缩什么、恢复时必须找回什么。"
curator: "CoopersAgent"
author: "CoopersAgent"
programme: "Anthropic · Google · LangChain"
source_type: "third-party"
takeaways: ["状态和证据各有归属，本轮提示只装当前决定需要的信息。", "压缩要保留版本、失败尝试、未满足条件和可回查句柄。", "预先取关键材料，其他证据按需检索，再用一次中断恢复检验。"]
reading_version: "v2"
reading_skill: "deep-read@0.2.2"
---

长任务中断后，Agent 怎样接着做？关键是同时保住原始证据、当前状态和下一步允许做的事。摘要若把“只分析失败原因，不修改数据库”缩成“继续修复失败记录”，即使更短，也已改变任务。

- [大量结果怎样留下，又不塞满输入？]({{< relref "/picks/agent-context-engineering/detail.md#洞察一先决定谁保存事实再决定如何缩短输入" >}}) 保存完整产物及名称、版本，输入保留查询条件、数量与继续读取的句柄。
- [压缩最容易丢掉什么？]({{< relref "/picks/agent-context-engineering/detail.md#洞察二压缩必须保住下一步行动所需的约束" >}}) 晚些才显得重要的限制、失败尝试和未满足条件；先保证召回，再去冗余。
- [什么时候检索，什么时候预装？]({{< relref "/picks/agent-context-engineering/detail.md#洞察四预先检索和按需检索适合组合" >}}) 先放稳定约束，再按调查进展取材；原例用 `CLAUDE.md` 配合 `glob`、`grep`。
- [为什么多 Agent 仍会交接失败？]({{< relref "/picks/agent-context-engineering/detail.md#洞察五隔离越强交接输入越需要完整" >}}) 隔离也会切掉线索；两人各拿一半接口约定，可能对同一字段作出不同解释。
- [怎样检验能否恢复？]({{< relref "/picks/agent-context-engineering/detail.md#最小组合示例让长调研中断后仍能继续" >}}) 让接手者指出目标、未满足条件、允许的下一动作，并回查证据。

组合方案是工程设计示例，实际效果要靠任务测试。

## 一手资料

- [Anthropic：Agent 上下文工程](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents)
- [Google：生产多 Agent 上下文架构](https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/)
- [LangChain：Context Engineering for Agents](https://www.langchain.com/blog/context-engineering-for-agents)

## 继续阅读

[阅读长版精读]({{< relref "/picks/agent-context-engineering/detail.md" >}})
