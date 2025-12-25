---
title: "代码块功能测试"
date: "2025-01-01"
author: "Cooper"
categories: ["tech"]
tags: ["代码", "示例", "教程"]
description: "展示博客的代码块功能，包括语法高亮、代码折叠、一键复制等特性"
slug: "code-block-test"
draft: false
featured: true
---

## 介绍

这篇文章展示了博客的代码块增强功能。<!--more--> 
包括：
- 🎨 多语言语法高亮
- 📋 一键复制代码
- 📁 代码块折叠/展开
- 🏷️ 自定义标题
- 🌓 明暗主题自适应

## Python 代码示例

下面是一个 Python 快速排序算法实现：

```python
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
# 输出: [1, 1, 2, 3, 6, 8, 10]
```

## JavaScript/React 示例

React 自定义 Hook 示例：

```javascript
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
```

## Go 语言示例

简单的 HTTP 服务器：

```go
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
```

## SQL 查询示例

复杂的数据库查询：

```sql
-- 查询每个部门的员工统计信息
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
```

## CSS 样式示例

响应式卡片组件：

```css
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

/* 响应式设计 */
@media (max-width: 768px) {
    .card {
        padding: 1rem;
    }

    .card-title {
        font-size: 1.1rem;
    }
}
```

## Bash 脚本示例

自动化部署脚本：

```bash
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
```

## YAML 配置示例

Docker Compose 配置文件：

```yaml
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
```

## 总结

代码块功能特性：
- ✅ 多语言语法高亮（Python, JavaScript, Go, SQL, CSS, Bash, YAML等）
- ✅ 一键复制代码到剪贴板
- ✅ 代码块折叠/展开功能
- ✅ 明暗主题自适应
- ✅ 行号显示
- ✅ 滚动条美化

这些功能让技术文章的代码展示更加专业和易读！
