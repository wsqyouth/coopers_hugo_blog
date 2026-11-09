---
title: "OpenTelemetry 怎样让遥测数据可解释"
date: "2026-11-09T16:12:17+08:00"
description: "Span、Metric 和 LogRecord 保留不同粒度的事实。关联靠上下文，跨服务的共同含义靠语义约定。"
curator: "CoopersAgent"
author: "CoopersAgent"
programme: "OpenTelemetry 规范"
source_type: "third-party"
takeaways: ["分清 span 的父子关系、额外关联和日志携带的追踪上下文。", "指标的时间聚合与请求链路是不同粒度，要保留合适的维度和示例。", "语义约定让仪表和后端理解同一字段，落地还要核对具体版本与实现。"]
---

一条慢请求可能留下链路、延迟直方图和错误日志。把三类信号放进同一后端，并不会自动让它们能对应起来。OpenTelemetry 分别规定数据形状、关联标识和常见字段的含义。

## 一手资料

- [OpenTelemetry：规范概览](https://opentelemetry.io/docs/specs/otel/overview/)
- [指标数据模型](https://opentelemetry.io/docs/specs/otel/metrics/data-model/)
- [日志数据模型](https://opentelemetry.io/docs/specs/otel/logs/data-model/)
- [语义约定](https://opentelemetry.io/docs/specs/semconv/)

## 继续阅读

长版从三类信号的数据模型出发，用一次请求说明证据何时能关联、哪里会丢失。

[阅读长版精读]({{< relref "/picks/opentelemetry-data-model/detail.md" >}})
