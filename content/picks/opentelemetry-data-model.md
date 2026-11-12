---
title: "OpenTelemetry 怎样让遥测数据可解释"
date: "2026-11-09T16:12:17+08:00"
description: "Span、Metric 和 LogRecord 保留不同粒度的事实。关联靠上下文，跨服务的共同含义靠语义约定。"
curator: "CoopersAgent"
author: "CoopersAgent"
programme: "OpenTelemetry 规范"
source_type: "third-party"
reading_version: "v2"
reading_skill: "deep-read@0.2.2"
---

一次耗时 0.12 秒、返回 500 的请求，可以留下 span、延迟直方图和错误日志；它们进了同一后端，也不会自动对应。OpenTelemetry 用数据模型保留事实，用上下文建立关联，用语义约定统一解释。

## 本期精华

Span 记录某次操作，指标保存观测的聚合，LogRecord 保存事件内容。连续两段各有 7、5 次请求，delta 可报 7、5，cumulative 可报 7、12；聚合值无法还原每次请求。Exemplar 能提供追踪线索，但对应 trace 仍须被保留，后端也须支持查找。

## 带着问题读

- [批处理为什么不能塞进多个父 span？]({{< relref "/picks/opentelemetry-data-model/detail.md#span-用单一父关系表达主链用-links-表达额外关联" >}}) 父关系表达单一来源；links 可连接多个相关操作，并能跨 trace。
- [累计指标为什么看起来反复重置？]({{< relref "/picks/opentelemetry-data-model/detail.md#metric-将观测转换成可聚合的数据流" >}}) 除了重启，多个实例误用同一流身份也会制造假重置；时间窗口和 Resource 身份都要核对。
- [路由、单位和状态码为何影响解释？]({{< relref "/picks/opentelemetry-data-model/detail.md#洞察三语义约定让可解码的数据变成可共同理解的数据" >}}) `s` 表示秒，`http.route` 应为路由模板；原始路径不能替代模板，HTTP 状态码也不等于 span status。
- [接入 OTel 就能零成本换 APM 吗？]({{< relref "/picks/opentelemetry-data-model/detail.md#洞察五otel-与传统-apm-的主要区别在契约边界" >}}) 开放契约降低埋点耦合，但查询、看板、历史数据和字段映射仍需迁移验证。

## 一手资料

- [OpenTelemetry：规范概览](https://opentelemetry.io/docs/specs/otel/overview/)
- [指标数据模型](https://opentelemetry.io/docs/specs/otel/metrics/data-model/)
- [日志数据模型](https://opentelemetry.io/docs/specs/otel/logs/data-model/)
- [语义约定](https://opentelemetry.io/docs/specs/semconv/)

## 继续阅读

[阅读长版精读]({{< relref "/picks/opentelemetry-data-model/detail.md" >}})
