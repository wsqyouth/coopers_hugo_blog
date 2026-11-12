---
title: "让 Agent 看见时间，怎样守住交付预算"
date: "2026-11-09T16:12:17+08:00"
description: "共享时钟能让协作 Agent 感知用户等了多久。教程演示了时钟怎么传递，工程上还要处理截止、取消和交付条件。"
curator: "CoopersAgent"
author: "CoopersAgent"
programme: "Claude Cookbook"
source_type: "third-party"
takeaways: ["把同一任务的已用时间传给各角色，包括后来启动的助手。", "把变化的时间信息追加在稳定前缀之后，区分可见进度和硬性停止。", "衡量速度时同时看必要证据、缺失项和取消后是否还有残留工作。"]
reading_version: "v2"
reading_skill: "deep-read@0.2.2"
---

一个 Helper 在任务开始 182 秒后加入，总预算是 600 秒。它该看见 `[elapsed 182s / 600s]`，而不是从零开始。Claude Cookbook 用共享时钟让各角色看见用户已经等了多久，再用紧迫提示或预算数字引导取舍。

## 从这些问题读起

- **[晚加入的助手如何计时？]({{< relref "/picks/agent-latency-budget/detail.md#洞察一共享时钟让局部任务服从整体进度" >}})** 继承团队起点，等待模型、工具与同伴的时间也算在内。
- **[怎样注时才不破坏缓存？]({{< relref "/picks/agent-latency-budget/detail.md#洞察二在调用前追加事实既及时也保留缓存前缀" >}})** 首轮追加到任务消息，之后追加到最新工具结果；前缀可复用不等于必然命中。
- **[压力和预算有什么不同？]({{< relref "/picks/agent-latency-budget/detail.md#洞察三压力改变偏好预算给出参照" >}})** 压力加入时钟与催促语；预算只给时钟多加一个总额，教程将两者分开比较。
- **[怎样判断真的变快？]({{< relref "/picks/agent-latency-budget/detail.md#洞察五教程证明线路接通效果证据要另看" >}})** 日志先确认各角色收到时间，再比较多次运行的耗时与答案质量。一次示例不能证明收益。

## 一手资料

- [Claude Cookbook：多 Agent 延迟压力与预算](https://platform.claude.com/cookbook/patterns-agents-latency-multi-agent)
- [Claude Cookbook：异步协作示例](https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/async_multi_agent_orchestration.ipynb)
- [Claude 文档：提示缓存](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#how-prompt-caching-works)

## 继续阅读

[阅读长版精读]({{< relref "/picks/agent-latency-budget/detail.md" >}})
