#!/usr/bin/env python3
"""
批量转换 blog_docs 文章到 Hugo 格式
支持从 git 历史获取真实创建时间，智能生成分类和标签
"""

import os
import re
import subprocess
from datetime import datetime
from pathlib import Path

# 分类映射
CATEGORY_MAP = {
    'algorithm': 'tech',
    'backend_develop': 'tech',
    'linux': 'tech',
    'book_note': 'thinking',
    'life': 'diary'
}

# 标签映射（每个文章最多2个标签）
TAG_MAP = {
    '双指针法总结学习.md': ['算法', '双指针'],
    'mysql_explain记录.md': ['MySQL', '数据库'],
    '基于go标准分层架构项目设计实现.md': ['Go', '架构设计'],
    '基于minikube和golang搭建容器编排服务.md': ['Go', 'Kubernetes'],
    '记录数据库查询超时排查过程.md': ['数据库', '故障排查'],
    '编码-笔记.md': ['读书笔记'],
    '微服务设计-笔记.md': ['读书笔记'],
    '2023-09复盘记录.md': ['复盘'],
    '我能为公司带来什么.md': ['个人成长'],
    'nginx安装及反向代理.md': ['Nginx', 'Linux'],
    '个人网站服务搭建.md': ['博客搭建']
}

def get_git_creation_date(file_path, repo_path):
    """从 git 历史获取文件真实创建时间"""
    try:
        # 使用相对路径
        rel_path = os.path.relpath(file_path, repo_path)

        # 获取文件首次提交的时间
        cmd = [
            'git', '-C', repo_path, 'log', '--diff-filter=A',
            '--format=%ai', '--', rel_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0 and result.stdout.strip():
            # 解析日期 "2023-10-07 20:55:53 +0800"
            date_str = result.stdout.strip().split()[0]
            return date_str
        else:
            print(f"⚠️  无法从git获取 {file_path} 的创建时间，使用当前日期")
            return datetime.now().strftime('%Y-%m-%d')
    except Exception as e:
        print(f"❌ 获取git时间出错: {e}")
        return datetime.now().strftime('%Y-%m-%d')

def extract_title(content):
    """从内容中提取标题"""
    # 移除开头的空行
    content = content.lstrip()

    # 尝试提取第一个 # 标题
    match = re.match(r'^#+\s+(.+)$', content, re.MULTILINE)
    if match:
        title = match.group(1).strip()
        # 移除标题行
        content_without_title = re.sub(r'^#+\s+.+\n', '', content, count=1)
        return title, content_without_title
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
    # 中文文件名转拼音或保持原样（Hugo支持中文slug）
    slug = slug.lower()
    slug = re.sub(r'[\s_]+', '-', slug)
    return slug

def get_category_from_path(file_path):
    """根据文件路径确定分类"""
    parts = Path(file_path).parts
    for part in parts:
        if part in CATEGORY_MAP:
            return CATEGORY_MAP[part]
    return 'tech'  # 默认分类

def get_tags_from_filename(filename):
    """根据文件名获取标签"""
    return TAG_MAP.get(filename, ['待添加'])

def convert_file(file_path, blog_docs_root):
    """转换单个文件"""
    file_path = Path(file_path)

    if not file_path.exists():
        print(f"❌ 文件不存在: {file_path}")
        return False

    # 读取原文件
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否已有 Front Matter
    if has_frontmatter(content):
        print(f"⚠️  {file_path.name} 已包含 Front Matter，跳过")
        return False

    # 创建备份
    backup_path = file_path.with_suffix('.md.backup')
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"📦 已创建备份: {backup_path}")

    # 提取信息
    title, content_without_title = extract_title(content)
    if not title:
        title = file_path.stem.replace('-', ' ').replace('_', ' ')

    description = extract_description(content_without_title)
    slug = generate_slug(file_path.name)

    # 从git获取真实创建时间
    date = get_git_creation_date(file_path, blog_docs_root)

    # 确定分类
    category = get_category_from_path(file_path)

    # 确定标签
    tags = get_tags_from_filename(file_path.name)

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
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✅ 转换完成: {file_path.name}")
    print(f"   日期: {date}, 分类: {category}, 标签: {tags}")
    return True

def batch_convert(blog_docs_root):
    """批量转换所有文件"""
    blog_docs_root = Path(blog_docs_root)
    docs_dir = blog_docs_root / 'docs'

    if not docs_dir.exists():
        print(f"❌ 目录不存在: {docs_dir}")
        return

    # 查找所有 .md 文件（排除备份文件）
    md_files = []
    for category_dir in docs_dir.iterdir():
        if category_dir.is_dir():
            for md_file in category_dir.glob('*.md'):
                if not md_file.name.endswith('.backup'):
                    md_files.append(md_file)

    if not md_files:
        print(f"❌ 未找到 markdown 文件")
        return

    print(f"📁 找到 {len(md_files)} 个 Markdown 文件\n")

    converted = 0
    for md_file in sorted(md_files):
        if convert_file(md_file, blog_docs_root):
            converted += 1
        print()

    print(f"✅ 批量转换完成: {converted}/{len(md_files)} 个文件")

def main():
    # blog_docs 仓库根目录（相对于当前脚本位置）
    script_dir = Path(__file__).parent
    blog_docs_root = script_dir.parent.parent / 'blog_docs'

    if not blog_docs_root.exists():
        print(f"❌ blog_docs 目录不存在: {blog_docs_root}")
        return

    print(f"🚀 开始批量转换 blog_docs 文章")
    print(f"📂 源目录: {blog_docs_root}")
    print(f"=" * 60)
    print()

    batch_convert(blog_docs_root)

    print()
    print("=" * 60)
    print("📝 转换完成！接下来请：")
    print("   1. 检查转换后的文件内容")
    print("   2. 将文件移动到 coopers_hugo_blog/content/posts/ 对应目录")
    print("   3. 运行 hugo server -D 预览效果")

if __name__ == '__main__':
    main()
