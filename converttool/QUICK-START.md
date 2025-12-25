# 快速开始指南 🚀

## ✅ 问题已修复

错误原因：Hugo 模板中 `.Date.Format` 语法在新版本中不兼容。
解决方案：改用 `dateFormat` 函数。

---

## 📝 创建新文章（推荐）

### 方法1：使用默认模板
```bash
hugo new content/posts/tech/my-article.md
```

### 方法2：使用分类专用模板
```bash
# 技术文章
hugo new content/posts/tech/python-tutorial.md

# 思考笔记
hugo new --kind thinking content/posts/thinking/book-review.md

# 生活日记
hugo new --kind diary content/posts/diary/today.md

# 项目复盘
hugo new --kind project-review content/posts/project-review/my-project.md
```

---

## 🔄 转换现有文章

### Shell 脚本（单文件）
```bash
cd converttool
./convert-md.sh ../my-article.md
```

### Python 脚本（批量）
```bash
cd converttool
python3 convert-md.py ../my-article.md tech
python3 convert-md.py --batch ../drafts/ thinking
```

---

## 📚 可用的模板

| 模板文件 | 分类 | 用法 |
|---------|------|------|
| default.md | tech | `hugo new content/posts/tech/file.md` |
| tech.md | tech | `hugo new --kind tech content/posts/tech/file.md` |
| thinking.md | thinking | `hugo new --kind thinking content/posts/thinking/file.md` |
| diary.md | diary | `hugo new --kind diary content/posts/diary/file.md` |
| project-review.md | project-review | `hugo new --kind project-review content/posts/project-review/file.md` |

---

## 🎯 完整流程示例

```bash
# 1. 创建新文章
hugo new content/posts/tech/gemini-intro.md

# 2. 编辑文章
vim content/posts/tech/gemini-intro.md

# 3. 修改 Front Matter
# - 更新 tags: ["AI", "Gemini", "教程"]
# - 完善 description
# - 设置 draft: false

# 4. 本地预览
hugo server -D

# 5. 提交部署
git add .
git commit -m "feat: add gemini introduction"
git push
```

---

## ✨ 生成的文件格式

```yaml
---
title: "Gemini Test"              # 自动从文件名生成
date: "2025-12-25"                # 当前日期，格式正确
author: "Cooper"                  # 固定作者
categories: ["tech"]              # 根据模板设置
tags: ["待添加"]                   # 需要手动修改
description: "文章简短描述..."     # 需要手动修改
slug: "gemini-test"               # 自动从文件名生成
draft: true                       # 草稿状态
featured: false                   # 非精选
---

> 文章引言或摘要（可选）

<!--more-->

## 正文开始

在这里写你的内容...
```

---

## ⚠️ 注意事项

1. **必须修改的字段**：
   - `tags`: 改为相关标签
   - `description`: 填写 100-160 字符的描述
   - `draft`: 完成后改为 `false`

2. **文件命名建议**：
   - 使用英文和连字符：`python-tutorial.md` ✅
   - 避免空格和特殊字符：`Python 教程.md` ❌
   - 使用小写字母：`gemini-intro.md` ✅

3. **日期格式**：
   - 正确：`"2025-12-25"` ✅
   - 错误：`2025-12-25` (无引号) ❌
   - 错误：`"2025/12/25"` (斜杠) ❌

---

## 🐛 常见错误

### 错误1: 模板错误
```
Error: can't evaluate field Format in type string
```
**原因**：使用了旧版本的模板语法
**解决**：已修复，使用 `dateFormat` 函数

### 错误2: 文件已存在
```
Error: file already exists
```
**解决**：删除或重命名现有文件
```bash
rm content/posts/tech/existing-file.md
```

### 错误3: Front Matter 格式错误
```
Error: invalid YAML
```
**检查**：
- YAML 缩进（使用空格，不用 Tab）
- 引号配对
- 数组格式 `["tag1", "tag2"]`

---

## 📞 获取帮助

查看完整文档：
```bash
cat converttool/CONVERSION-GUIDE.md
```

测试模板：
```bash
hugo new content/posts/tech/test.md
cat content/posts/tech/test.md
```

---

**现在可以正常使用了！** 🎉
