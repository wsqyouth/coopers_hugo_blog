---
title: "长任务怎样保住下一步需要的上下文"
date: "2026-11-09T16:12:17+08:00"
description: "把任务记录、长期记忆、原始产物和本轮输入拆开，才知道上下文可以压缩什么、恢复时必须找回什么。"
curator: "CoopersAgent"
author: "CoopersAgent"
programme: "Anthropic · Google · LangChain"
source_type: "third-party"
takeaways: ["状态和证据各有归属，本轮提示只装当前决定需要的信息。", "压缩要保留版本、失败尝试、未满足条件和可回查句柄。", "预先取关键材料，其他证据按需检索，再用一次中断恢复检验。"]
---

一份短摘要如果只保留了结论，没有写清已经检查的证据和还未满足的条件，下一位 Agent 就可能从头再做。能恢复的交接应当让后来者拿到原始材料、当前状态和下一个获准动作。

## 一手资料

- [Anthropic：Agent 上下文工程](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents)
- [Google：生产多 Agent 上下文架构](https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/)
- [LangChain：Context Engineering for Agents](https://www.langchain.com/blog/context-engineering-for-agents)

## 继续阅读

长版比较三家原始设计，展开压缩、记忆、按需检索和交接示例。

[阅读长版精读]({{< relref "/picks/agent-context-engineering/detail.md" >}})
