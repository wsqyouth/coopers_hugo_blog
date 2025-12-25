#!/usr/bin/env python3
"""
Markdown 文件格式转换工具
支持批量转换和智能提取信息
"""

import os
import re
import sys
from datetime import datetime
from pathlib import Path

def extract_title(content):
    """从内容中提取标题"""
    # 尝试提取第一个 # 标题
    match = re.match(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip(), re.sub(r'^#\s+.+\n', '', content, count=1)
    return None, content

def extract_description(content):
    """自动生成描述（取前100个字符）"""
    # 移除 markdown 标记
    text = re.sub(r'[#*`\[\]()]', '', content)
    text = re.sub(r'\n+', ' ', text)
    text = text.strip()[:150]
    return text if text else "文章简短描述"

def has_frontmatter(content):
    """检查是否已有 Front Matter"""
    return content.startswith('---')

def generate_slug(filename):
    """生成 URL slug"""
    slug = os.path.splitext(filename)[0]
    slug = slug.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    return slug

def convert_file(filepath, category='tech', tags=None):
    """转换单个文件"""
    if tags is None:
        tags = ['待添加']
    
    filepath = Path(filepath)
    
    if not filepath.exists():
        print(f"❌ 错误: 文件 {filepath} 不存在")
        return False
    
    # 读取原文件
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有 Front Matter
    if has_frontmatter(content):
        print(f"⚠️  {filepath.name} 已包含 Front Matter，跳过")
        return False
    
    # 创建备份
    backup_path = filepath.with_suffix('.md.backup')
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"📦 已创建备份: {backup_path}")
    
    # 提取信息
    title, content_without_title = extract_title(content)
    if not title:
        title = filepath.stem.replace('-', ' ').replace('_', ' ').title()
    
    description = extract_description(content_without_title)
    slug = generate_slug(filepath.name)
    date = datetime.now().strftime('%Y-%m-%d')
    
    # 生成新内容
    frontmatter = f"""---
title: "{title}"
date: "{date}"
author: "Cooper"
categories: ["{category}"]
tags: {tags}
description: "{description}"
slug: "{slug}"
draft: true
featured: false
---

"""
    
    new_content = frontmatter + content_without_title.lstrip()
    
    # 写入文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ 转换完成: {filepath}")
    return True

def batch_convert(directory, category='tech'):
    """批量转换目录中的所有 .md 文件"""
    directory = Path(directory)
    md_files = list(directory.glob('*.md'))
    
    if not md_files:
        print(f"❌ 目录 {directory} 中没有找到 .md 文件")
        return
    
    print(f"📁 找到 {len(md_files)} 个 Markdown 文件")
    
    converted = 0
    for md_file in md_files:
        if convert_file(md_file, category):
            converted += 1
    
    print(f"\n✅ 批量转换完成: {converted}/{len(md_files)} 个文件")

def main():
    if len(sys.argv) < 2:
        print("用法:")
        print("  单文件转换: python3 convert-md.py <文件路径> [分类]")
        print("  批量转换:   python3 convert-md.py --batch <目录路径> [分类]")
        print("\n示例:")
        print("  python3 convert-md.py my-article.md tech")
        print("  python3 convert-md.py --batch ./drafts/ thinking")
        print("\n支持的分类: tech, thinking, diary, project-review")
        sys.exit(1)
    
    if sys.argv[1] == '--batch':
        if len(sys.argv) < 3:
            print("❌ 请指定目录路径")
            sys.exit(1)
        directory = sys.argv[2]
        category = sys.argv[3] if len(sys.argv) > 3 else 'tech'
        batch_convert(directory, category)
    else:
        filepath = sys.argv[1]
        category = sys.argv[2] if len(sys.argv) > 2 else 'tech'
        convert_file(filepath, category)
        print("\n📝 请手动检查并修改以下字段:")
        print("   - categories: 确认分类正确")
        print("   - tags: 添加相关标签")
        print("   - description: 优化描述内容")
        print("   - draft: 完成后改为 false")

if __name__ == '__main__':
    main()
