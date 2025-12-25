---
title: "{{ replace .Name "-" " " | title }}"
date: "{{ dateFormat "2006-01-02" .Date }}"
author: "Cooper"
categories: ["diary"]
tags: ["生活", "日记"]
description: "文章简短描述，100-160字符"
slug: "{{ .Name }}"
draft: true
featured: false
---

> 记录生活的点滴...

<!--more-->

## 今天

写下你的故事...
