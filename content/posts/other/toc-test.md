---
title: "侧边目录和阅读进度功能演示"
date: "2025-01-01"
author: "Cooper"
categories: ["tech"]
tags: ["功能", "演示", "用户体验"]
description: "展示博客的侧边目录和阅读进度功能，提升长文章的阅读体验"
slug: "toc-and-reading-progress"
draft: false
featured: false
---
展示博客的侧边目录和阅读进度功能，提升长文章的阅读体验。

<!--more-->
## 介绍

这篇文章展示了博客的两个重要功能：**侧边目录**和**阅读进度**。这些功能对于长文章特别有用，能够帮助读者：
- 📑 快速导航到感兴趣的章节
- 📊 了解当前阅读进度
- 🎯 清晰掌握文章结构

## 第一部分：基础功能

### 什么是侧边目录

侧边目录（Table of Contents, TOC）是一个导航工具，可以帮助读者快速定位文章的不同部分。它会自动提取文章中的所有标题，构建一个可点击的目录树。

#### 侧边目录的优势

1. **快速导航** - 一键跳转到任意章节
2. **清晰结构** - 一目了然的文章框架
3. **提升体验** - 特别适合技术文档和教程

#### 实现方式

侧边目录通过 JavaScript 动态跟踪滚动位置，当前阅读的章节会在目录中高亮显示。

### 阅读进度显示

阅读进度以百分比的形式显示在"回到顶部"按钮上，实时反映你已经阅读了多少内容。

## 第二部分：技术实现

### HTML 结构

侧边目录的 HTML 结构需要正确解析 Markdown 中的标题层级，并生成对应的嵌套列表。

#### 标题提取

```javascript
// 提取所有标题元素
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
```

#### 层级处理

根据标题级别（h1-h6）构建嵌套的列表结构，确保目录层次分明。

### CSS 样式

#### 基础样式

目录容器需要固定定位，确保滚动时始终可见：

```css
.toc-container {
    position: fixed;
    top: 100px;
    right: 20px;
    max-width: 250px;
}
```

#### 高亮效果

当前阅读的标题会被特殊标记：

```css
.toc-item.active {
    font-weight: 600;
    color: var(--primary-color);
    border-left: 3px solid var(--primary-color);
}
```

### JavaScript 交互

#### 滚动监听

通过监听滚动事件来判断当前阅读位置：

```javascript
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    updateActiveElement(scrollPosition);
});
```

#### 平滑滚动

点击目录项时，页面会平滑滚动到对应位置：

```javascript
element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
});
```

## 第三部分：响应式设计

### 桌面端显示

在宽屏设备上（≥1024px），目录显示在文章右侧，不占用主要阅读区域。

#### 布局策略

- 文章主体：居中显示，最大宽度800px
- 侧边目录：固定在右侧，宽度250px
- 间距控制：确保不会重叠

### 移动端优化

在窄屏设备上（<768px），目录自动隐藏或折叠到文章顶部，避免占用宝贵的屏幕空间。

#### 触摸优化

- 增大点击区域，方便手指点击
- 简化目录层级，只显示主要章节
- 提供展开/收起按钮

### 平板设备

在中等屏幕设备上（768px-1023px），根据横屏/竖屏状态自动调整显示策略。

## 第四部分：性能优化

### 防抖处理

避免滚动事件触发过于频繁，影响性能：

```javascript
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const handleScroll = debounce(updateProgress, 100);
window.addEventListener('scroll', handleScroll);
```

### 缓存计算

缓存元素位置信息，减少重复的 DOM 查询：

```javascript
// 初始化时计算所有标题位置
const headingPositions = headings.map(h => ({
    element: h,
    top: h.offsetTop
}));
```

### 虚拟滚动

对于超长目录（>50项），使用虚拟滚动技术只渲染可见部分。

## 第五部分：实际应用场景

### 技术博客

长篇技术文章特别需要目录导航，帮助读者快速找到感兴趣的技术点。

#### 教程文章

分步骤的教程可以通过目录快速跳转到特定步骤：
- 环境准备
- 安装配置
- 代码实现
- 测试部署

#### API 文档

API 文档通常很长，目录是必不可少的导航工具。

### 学术文章

论文和研究报告通常结构复杂，目录能够清晰展示逻辑框架。

### 新闻报道

深度报道和特稿文章使用目录可以提升可读性。

## 第六部分：浏览器兼容性

### 现代浏览器

所有现代浏览器都完美支持这些功能：

#### Chrome/Edge

- ✅ 完美支持
- ✅ 性能优秀
- ✅ 无已知问题

#### Firefox

- ✅ 支持良好
- ✅ 滚动平滑
- ✅ 无兼容性问题

#### Safari

- ✅ 基本支持
- ⚠️ 某些 CSS 属性需要前缀
- ✅ 整体表现良好

### 移动浏览器

#### iOS Safari

触摸滚动和平滑滚动都表现良好。

#### Android Chrome

完全兼容，性能优秀。

## 结论

侧边目录和阅读进度是提升博客阅读体验的重要功能。通过合理的技术实现和性能优化，可以为读者提供更好的导航和定位能力。

### 主要优势

1. ✅ 改善长文章的可读性
2. ✅ 提供清晰的文章结构
3. ✅ 增强用户交互体验
4. ✅ 提升专业度

### 实现要点

1. 响应式设计适配不同设备
2. 性能优化避免卡顿
3. 无障碍支持提升可访问性
4. 优雅的动画过渡

### 未来改进方向

1. 添加搜索功能
2. 支持目录折叠
3. 记忆阅读位置
4. 提供更多主题样式

感谢阅读！如果你觉得这个功能有用，欢迎在评论区留言。
