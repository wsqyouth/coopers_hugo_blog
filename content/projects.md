---
title: "项目"
date: "2026-10-23"
layout: "plain"
url: "/projects/"
description: "我自己在做、并且在用的东西"
---

按成熟度排。只放真正在跑的东西——不列想法，不列半成品。

## EchoFlow · 音频博客

最成熟的作品。把录音与播客变成可以订阅、可以检索的音频博客。

- 线上：<https://echo.wsqyouth.cn>
- 形态：Go + SQLite 单服务，蓝绿部署
- 状态：主力在用的产品

## ReadFlow · RSS 阅读器

信息入口。订阅源抓取、清洗、归类、稍后读，一套自用的阅读链路。

- 线上：<https://read.wsqyouth.cn>
- 形态：Go 单二进制 + SQLite + React 前端，蓝绿部署
- 状态：自用成熟，持续加能力

## NoteFlow · 短笔记

轻记录。公共板与私有板双空间，按账户隔离。

- 线上：<https://note.wsqyouth.cn>
- 形态：Go + SQLite，systemd 部署
- 状态：已上线，迭代中

## 本博客

你现在看的这个站。Hugo + PaperMod 纯静态，GitHub Actions 构建推送。
写作在 Obsidian，发布链路全自动：AI 判断元数据 → 脚本搬运与转换 → 本地真构建验证 → 推送上线。

- 线上：<https://www.wsqyouth.cn>
- 形态：Hugo 静态站 + 自研发布 skill
