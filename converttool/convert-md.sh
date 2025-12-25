#!/bin/bash

# Markdown 文件格式转换脚本
# 用法: ./convert-md.sh <文件路径>

if [ $# -eq 0 ]; then
    echo "用法: ./convert-md.sh <markdown文件路径>"
    echo "示例: ./convert-md.sh my-article.md"
    exit 1
fi

FILE="$1"

if [ ! -f "$FILE" ]; then
    echo "❌ 错误: 文件 $FILE 不存在"
    exit 1
fi

# 提取文件名（不含扩展名）
FILENAME=$(basename "$FILE" .md)
SLUG=$(echo "$FILENAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr '_' '-')

# 获取当前日期
DATE=$(date +"%Y-%m-%d")

# 读取原文件内容
CONTENT=$(cat "$FILE")

# 检查是否已有 Front Matter
if [[ "$CONTENT" =~ ^---.*--- ]]; then
    echo "⚠️  文件已包含 Front Matter，跳过转换"
    exit 0
fi

# 创建备份
BACKUP="${FILE}.backup"
cp "$FILE" "$BACKUP"
echo "📦 已创建备份: $BACKUP"

# 提取第一行作为标题（如果是 # 开头）
if [[ "$CONTENT" =~ ^#[[:space:]]+(.+)$ ]]; then
    TITLE="${BASH_REMATCH[1]}"
    # 删除第一行标题
    CONTENT=$(echo "$CONTENT" | tail -n +2)
else
    # 使用文件名作为标题
    TITLE="$FILENAME"
fi

# 生成新的文件内容
cat > "$FILE" << FRONTMATTER
---
title: "$TITLE"
date: "$DATE"
author: "Cooper"
categories: ["tech"]
tags: ["待添加"]
description: "文章简短描述，100-160字符"
slug: "$SLUG"
draft: true
featured: false
---

$CONTENT
FRONTMATTER

echo "✅ 转换完成: $FILE"
echo "📝 请手动修改以下字段："
echo "   - categories: 选择合适的分类"
echo "   - tags: 添加相关标签"
echo "   - description: 填写文章描述"
echo "   - draft: 完成后改为 false"
