---
title: "代码块功能测试"
date: 2025-10-09T22:44:41+08:00
lastmod: 2025-10-09T22:44:41+08:00
author: ["Cooper"]
tags: ["测试", "代码"]
categories: ["技术"]
description: "测试代码块折叠、高亮和复制功能"
weight: # 输入数字可以置顶文章，用来给文章展示排序
slug: "code-block-test"
draft: false # 是否为草稿
comments: true
showToc: true # 显示目录
TocOpen: true # 自动展开目录
hidemeta: false # 是否隐藏文章的元信息，如发布日期、作者等
disableShare: true # 底部不显示分享栏
showbreadcrumbs: true # 顶部显示当前路径
searchHidden: false # 优化SEO
ShowReadingTime: true
ShowWordCount: true
cover:
    image: ""
    caption: ""
    alt: ""
    relative: false
---

## 介绍

这篇文章用于测试博客的代码块增强功能，包括：
- 代码块折叠/展开
- 一键复制代码
- 自定义标题
- 多语言高亮

## Python 代码示例

下面是一个 Python 函数示例：

{{< code lang="python" title="快速排序算法" >}}
def quick_sort(arr):
    """快速排序算法实现"""
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)

# 测试
numbers = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(numbers))
{{< /code >}}

## JavaScript 代码示例

React Hook 使用示例：

{{< code lang="javascript" title="自定义 Hook - useLocalStorage" >}}
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // 更新 localStorage
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
{{< /code >}}

## Go 代码示例

HTTP 服务器示例：

{{< code lang="go" title="简单的 HTTP 服务器" >}}
package main

import (
    "fmt"
    "log"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path != "/hello" {
        http.Error(w, "404 not found.", http.StatusNotFound)
        return
    }
    if r.Method != "GET" {
        http.Error(w, "Method is not supported.", http.StatusNotFound)
        return
    }
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    http.HandleFunc("/hello", helloHandler)
    fmt.Printf("Starting server at port 8080\n")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
}
{{< /code >}}

## SQL 查询示例

数据库查询示例：

{{< code lang="sql" title="用户统计查询" >}}
-- 查询每个部门的员工数量和平均工资
SELECT
    d.department_name,
    COUNT(e.employee_id) as employee_count,
    AVG(e.salary) as avg_salary,
    MAX(e.salary) as max_salary,
    MIN(e.salary) as min_salary
FROM
    employees e
    INNER JOIN departments d ON e.department_id = d.department_id
WHERE
    e.status = 'active'
    AND e.hire_date >= '2020-01-01'
GROUP BY
    d.department_name
HAVING
    COUNT(e.employee_id) > 5
ORDER BY
    avg_salary DESC;
{{< /code >}}

## CSS 样式示例

响应式布局样式：

{{< code lang="css" title="卡片组件样式" >}}
.card {
    background: var(--card-bg);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
}

.card-content {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .card {
        padding: 1rem;
    }

    .card-title {
        font-size: 1.1rem;
    }
}
{{< /code >}}

## Bash 脚本示例

自动化部署脚本：

{{< code lang="bash" title="部署脚本" >}}
#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始部署...${NC}"

# 检查 Git 状态
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${RED}错误: 有未提交的更改${NC}"
  exit 1
fi

# 拉取最新代码
git pull origin main

# 安装依赖
npm install

# 构建项目
npm run build

# 重启服务
pm2 restart app

echo -e "${GREEN}部署完成！${NC}"
{{< /code >}}

## YAML 配置示例

Docker Compose 配置：

{{< code lang="yaml" title="docker-compose.yml" >}}
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./html:/usr/share/nginx/html:ro
    depends_on:
      - api
    restart: unless-stopped

  api:
    build: ./backend
    environment:
      - NODE_ENV=production
      - DB_HOST=database
      - DB_PORT=5432
    ports:
      - "3000:3000"
    depends_on:
      - database
    restart: unless-stopped

  database:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  pgdata:
{{< /code >}}

## 总结

代码块功能特性：
- ✅ 支持代码折叠/展开
- ✅ 一键复制代码
- ✅ 自定义标题显示
- ✅ 多语言语法高亮
- ✅ 明暗主题自适应
- ✅ 滚动条美化

点击代码块标题栏可以折叠/展开代码，点击右侧复制按钮可以快速复制代码内容。
