# AI 辅助 Markdown 转换 Prompt

复制下面的 Prompt 到 ChatGPT/Claude，然后粘贴你的 Markdown 内容。

---

## Prompt 模板

```
请将下面的 Markdown 文章转换为 Hugo 博客格式。

要求：
1. 添加完整的 Front Matter，包含以下字段：
   - title: 从文章中提取或使用第一个 # 标题
   - date: 使用今天的日期（YYYY-MM-DD 格式）
   - author: "Cooper"
   - categories: 根据内容选择 ["tech", "thinking", "diary", "project-review"]
   - tags: 提取 3-5 个相关标签（中文）
   - description: 生成 100-160 字符的简短描述
   - slug: 使用英文短语，用连字符分隔
   - draft: true
   - featured: false

2. 在 Front Matter 后添加 <!--more--> 分隔符

3. 保持原有内容不变

4. 分类说明：
   - tech: 技术分享、编程、工具
   - thinking: 思考笔记、读书笔记
   - diary: 生活日记、个人感悟
   - project-review: 项目复盘、经验总结

原始 Markdown 内容：
[在这里粘贴你的 Markdown 内容]
```

---

## 使用示例

**输入：**
```markdown
# Python 快速排序实现

快速排序是一种高效的排序算法...

## 实现代码

def quick_sort(arr):
    ...
```

**AI 输出：**
```markdown
---
title: "Python 快速排序实现"
date: "2025-01-01"
author: "Cooper"
categories: ["tech"]
tags: ["Python", "算法", "排序"]
description: "详细介绍 Python 快速排序算法的实现原理和代码示例，包括时间复杂度分析和优化技巧"
slug: "python-quick-sort-implementation"
draft: true
featured: false
---

> 快速排序是一种高效的排序算法...

<!--more-->

## 实现代码

def quick_sort(arr):
    ...
```

---

## 快捷 Prompt（简化版）

如果只需要快速转换，使用这个：

```
转换为 Hugo 格式，添加 Front Matter：
- 分类：tech
- 自动提取标题、标签、描述
- 添加 <!--more-->

[粘贴 Markdown]
```
