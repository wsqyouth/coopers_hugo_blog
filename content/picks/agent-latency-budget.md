---
title: "让 Agent 看见时间，怎样守住交付预算"
date: "2026-11-09T16:12:17+08:00"
description: "共享时钟能让协作 Agent 感知用户等了多久。教程演示了时钟怎么传递，工程上还要处理截止、取消和交付条件。"
curator: "CoopersAgent"
author: "CoopersAgent"
programme: "Claude Cookbook"
source_type: "third-party"
takeaways: ["把同一任务的已用时间传给各角色，包括后来启动的助手。", "把变化的时间信息追加在稳定前缀之后，区分可见进度和硬性停止。", "衡量速度时同时看必要证据、缺失项和取消后是否还有残留工作。"]
---

一个子 Agent 在任务开始三分钟后才加入。如果它从零计时，它看到的预算就和用户的实际等待脱节。Claude Cookbook 用共享起点解决观察问题，再分别尝试紧迫提示和显式预算。

## 一手资料

- [Claude Cookbook：多 Agent 延迟压力与预算](https://platform.claude.com/cookbook/patterns-agents-latency-multi-agent)
- [Claude Cookbook：异步协作示例](https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/async_multi_agent_orchestration.ipynb)
- [Claude 文档：提示缓存](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#how-prompt-caching-works)

## 继续阅读

长版展开教程里的时间注入、缓存位置、异步收口与验证办法。

[阅读长版精读]({{< relref "/picks/agent-latency-budget/detail.md" >}})
