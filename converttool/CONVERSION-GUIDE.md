# Markdown 转换工具使用指南

快速将普通 Markdown 文件转换为 Hugo 博客格式的完整指南。

## 📋 目录

- [方案对比](#方案对比)
- [方案1: Hugo Archetypes](#方案1-hugo-archetypes推荐)
- [方案2: Shell 脚本转换](#方案2-shell-脚本转换)
- [方案3: Python 脚本转换](#方案3-python-脚本转换)
- [方案4: AI 辅助转换](#方案4-ai-辅助转换)

---

## 🎯 方案对比

| 方案 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| Hugo Archetypes | 新建文章 | ✅ 自动化，规范 | ❌ 不能转换现有文件 |
| Shell 脚本 | 转换现有文件 | ✅ 简单快速 | ⚠️ 功能有限 |
| Python 脚本 | 批量转换 | ✅ 功能强大，智能 | ⚠️ 需要 Python |
| AI 辅助 | 复杂内容 | ✅ 智能理解内容 | ⚠️ 需要手动操作 |

---

## 方案1: Hugo Archetypes（推荐）⭐

### 🎯 适用场景
创建新文章时自动使用模板。

### 📝 使用方法

**创建默认文章：**
```bash
hugo new content/posts/tech/my-article.md
```

**创建技术文章：**
```bash
hugo new content/posts/tech/python-tutorial.md --kind tech
```

**支持的模板类型：**
- `default.md` - 默认模板
- `tech.md` - 技术文章模板

### 🎨 自定义模板

编辑 `archetypes/default.md` 或创建新模板：

```yaml
---
title: "{{ replace .Name "-" " " | title }}"
date: "{{ .Date.Format "2006-01-02" }}"
author: "Cooper"
categories: ["tech"]
tags: ["待添加"]
description: "文章简短描述"
slug: "{{ .Name }}"
draft: true
featured: false
---

在这里写内容...
```

---

## 方案2: Shell 脚本转换

### 🎯 适用场景
快速转换单个现有 Markdown 文件。

### 📝 使用方法

```bash
# 转换单个文件
./convert-md.sh my-article.md

# 会自动：
# 1. 提取第一行 # 作为标题
# 2. 生成当前日期
# 3. 创建备份文件
# 4. 添加 Front Matter
```

### ⚙️ 工作原理

1. **备份原文件** → `my-article.md.backup`
2. **提取标题** → 使用第一个 `#` 标题
3. **生成 slug** → 文件名转小写，空格变连字符
4. **添加模板** → 插入完整 Front Matter

### ⚠️ 注意事项

- 会自动跳过已有 Front Matter 的文件
- 需要手动修改：分类、标签、描述
- 默认设置为草稿（`draft: true`）

---

## 方案3: Python 脚本转换

### 🎯 适用场景
- 批量转换多个文件
- 需要智能提取信息
- 高级自定义需求

### 📝 使用方法

**转换单个文件：**
```bash
python3 convert-md.py my-article.md tech
```

**批量转换目录：**
```bash
python3 convert-md.py --batch ./drafts/ thinking
```

### ✨ 高级功能

1. **智能标题提取**
   - 自动提取第一个 `#` 标题
   - 支持中英文标题

2. **自动生成描述**
   - 提取前 150 字符
   - 移除 Markdown 标记

3. **批量处理**
   - 一次转换整个目录
   - 跳过已转换文件
   - 显示处理进度

### 🔧 自定义参数

```python
# 修改脚本中的默认值
AUTHOR = "Cooper"
DEFAULT_CATEGORY = "tech"
DEFAULT_TAGS = ["待添加"]
```

---

## 方案4: AI 辅助转换

### 🎯 适用场景
- 内容复杂，需要智能理解
- 需要生成高质量描述和标签
- 一次性转换少量文件

### 📝 使用方法

1. **打开 AI-CONVERSION-PROMPT.md**
2. **复制 Prompt 模板**
3. **粘贴到 ChatGPT/Claude**
4. **粘贴你的 Markdown 内容**
5. **获取转换后的内容**

### 💡 Prompt 模板

```
请将下面的 Markdown 文章转换为 Hugo 博客格式。

要求：
1. 添加完整的 Front Matter
2. 根据内容选择合适的分类
3. 提取 3-5 个相关标签
4. 生成 100-160 字符的描述
5. 添加 <!--more--> 分隔符

[粘贴你的 Markdown]
```

### ✅ 优势

- 智能理解内容主题
- 自动生成高质量标签
- 优化 SEO 描述
- 适合技术文章

---

## 🔄 完整工作流程

### 新建文章（推荐流程）

```bash
# 1. 使用 Archetype 创建
hugo new content/posts/tech/my-new-article.md

# 2. 编辑文章内容
vim content/posts/tech/my-new-article.md

# 3. 修改 Front Matter
# - 更新 tags
# - 完善 description
# - 设置 draft: false

# 4. 预览
hugo server -D

# 5. 发布
git add .
git commit -m "feat: add my-new-article"
git push
```

### 转换现有文章

```bash
# 方案A: 单文件（Shell）
./convert-md.sh existing-article.md

# 方案B: 批量（Python）
python3 convert-md.py --batch ./my-drafts/ tech

# 方案C: AI 辅助
# 使用 AI-CONVERSION-PROMPT.md 中的 Prompt

# 完成后检查
hugo server -D
```

---

## 📚 Front Matter 字段说明

### 必填字段

| 字段 | 示例 | 说明 |
|------|------|------|
| title | "Python 教程" | 文章标题 |
| date | "2025-01-01" | 发布日期 YYYY-MM-DD |
| author | "Cooper" | 作者名称 |
| categories | ["tech"] | 分类（英文 key） |
| tags | ["Python", "教程"] | 标签（可中文） |
| description | "详细的 Python 教程..." | SEO 描述 100-160字 |
| slug | "python-tutorial" | URL 路径 |
| draft | false | 是否草稿 |
| featured | false | 是否精选 |

### 分类映射

| 英文 Key | 中文名称 | 说明 |
|---------|---------|------|
| tech | 技术分享 | 技术教程、编程 |
| thinking | 思考笔记 | 读书、思考 |
| diary | 生活日记 | 日常、感悟 |
| project-review | 项目复盘 | 项目总结 |

---

## ⚡ 快速参考

### 创建新文章
```bash
hugo new content/posts/tech/article-name.md
```

### 转换单个文件
```bash
./convert-md.sh file.md
```

### 批量转换
```bash
python3 convert-md.py --batch ./dir/ tech
```

### AI 转换
```
打开 AI-CONVERSION-PROMPT.md → 复制 Prompt → 粘贴内容
```

---

## 🐛 常见问题

### Q1: 转换后中文显示乱码？

```bash
# 确保文件编码为 UTF-8
file -I your-file.md

# 转换编码
iconv -f GBK -t UTF-8 your-file.md > new-file.md
```

### Q2: Shell 脚本没有执行权限？

```bash
chmod +x convert-md.sh
```

### Q3: Python 脚本报错？

```bash
# 检查 Python 版本（需要 3.6+）
python3 --version

# 确保使用 UTF-8 编码
export LANG=en_US.UTF-8
```

### Q4: Archetype 不生效？

```bash
# 检查模板位置
ls archetypes/

# 重启 Hugo 服务器
hugo server -D
```

---

## 📖 更多资源

- [Hugo 使用指南](content/posts/project-review/blog-guide-and-features.md)
- [Front Matter 文档](https://gohugo.io/content-management/front-matter/)
- [Markdown 语法参考](content/posts/other/markdown-validate.md)

---

**祝你写作顺利！** ✍️
