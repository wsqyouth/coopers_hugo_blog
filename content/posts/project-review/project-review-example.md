---
title: "Cooper's Blog 使用指南与功能说明"
date: "2025-12-25"
author: "Cooper"
categories: ["project-review"]
tags: ["博客", "Hugo", "使用指南", "功能文档"]
description: "Cooper's Blog 完整功能说明、维护指南和最佳实践，包括如何添加文章、配置分类、使用代码块等"
slug: "blog-guide-and-features"
draft: false
featured: true
---

> 本文档详细介绍 Cooper's Blog 的所有功能特性、维护方法和使用技巧。
<!--more-->

## 📚 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [文章管理](#文章管理)
- [分类和标签](#分类和标签)
- [代码块使用](#代码块使用)
- [配置说明](#配置说明)
- [常见问题](#常见问题)

---

## ✨ 功能特性

### 1. macOS 风格代码块

**特性列表**：
- 🔴🟡🟢 macOS 窗口风格按钮
- 📋 一键复制代码（悬停显示）
- 🎨 200+ 编程语言语法高亮
- 🔢 行号显示
- 📏 美化的滚动条
- 🌓 明暗主题自适应
- 💫 代码折叠/展开功能

**支持的语言**：
```
Python, JavaScript, TypeScript, Go, Rust, Java, C/C++, C#,
PHP, Ruby, SQL, Bash/Shell, YAML, JSON, XML, HTML, CSS,
SCSS, Markdown, Docker, Makefile 等 200+ 种语言
```

**使用方法**：
````markdown
```python
def hello_world():
    print("Hello, World!")
```
````

### 2. 侧边栏功能

**博客统计**：
- 📊 文章总数统计
- 📂 分类数量统计

**分类导航**：
- 中英文分类名称映射
- 文章数量显示
- 悬停效果

**归档导航**：
- 按年月分组
- 快速跳转到时间轴

**搜索功能**：
- 全文搜索
- 实时结果

### 3. 响应式设计

**桌面端（≥1200px）**：
- 主内容 + 右侧边栏布局
- 最大宽度 1400px

**平板端（768px-1200px）**：
- 单列布局
- 侧边栏移至底部

**移动端（<768px）**：
- 优化触摸体验
- 代码复制按钮只显示图标
- 简化导航

### 4. 主题切换

- 🌞 亮色主题
- 🌙 暗色主题
- 🔄 自动适配系统偏好

### 5. 阅读体验优化

- 📖 文章摘要自动截断（2行）
- 🔗 "阅读全文"链接
- ⏱️ 阅读时间显示
- 📝 字数统计
- 🏷️ 标签和分类导航

---

## 🚀 快速开始

### 本地开发

```bash
# 启动开发服务器
hugo server -D

# 访问
open http://localhost:1313
```

### 构建部署

```bash
# 构建静态文件
hugo --minify

# 输出目录
# public/
```

---

## 📝 文章管理

### 1. 创建新文章

**推荐目录结构**：
```
content/posts/
├── tech/           # 技术分享
├── thinking/       # 思考笔记
├── diary/          # 生活日记
├── project-review/ # 项目复盘
└── other/          # 其他文章
```

**创建文章**：
```bash
# 方法1：使用 Hugo 命令
hugo new content/posts/tech/my-new-article.md

# 方法2：直接创建文件
touch content/posts/tech/my-new-article.md
```

### 2. Front Matter 配置

**完整示例**：
```yaml
---
title: "文章标题"                    # 必填：文章标题
date: "2025-01-01"                  # 必填：发布日期 YYYY-MM-DD
author: "Cooper"                    # 必填：作者名称
categories: ["tech"]                # 必填：分类（使用英文 key）
tags: ["Hugo", "教程", "最佳实践"]   # 必填：标签
description: "文章简短描述"         # 必填：SEO 描述 100-160 字符
slug: "url-slug"                    # 必填：URL 路径（英文）
draft: false                        # 必填：是否为草稿
featured: false                     # 必填：是否为精选文章
---
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | String | ✅ | 文章标题，显示在页面顶部 |
| date | String | ✅ | 发布日期，格式：YYYY-MM-DD |
| author | String | ✅ | 作者名称 |
| categories | Array | ✅ | 分类，使用英文 key（见下文） |
| tags | Array | ✅ | 标签，可以使用中文 |
| description | String | ✅ | SEO 描述，100-160 字符 |
| slug | String | ✅ | URL 路径，建议使用英文和连字符 |
| draft | Boolean | ✅ | true=草稿不发布，false=发布 |
| featured | Boolean | ✅ | 是否为精选文章 |

### 3. 设置文章摘要

**方法1：自动摘要**（推荐）
- 系统会自动提取文章开头 70 个单词作为摘要
- 首页显示时会截断为 2 行

**方法2：使用 description**
```yaml
---
description: "这是文章的简短描述，会显示在文章列表中"
---
```

**方法3：使用 `<!--more-->` 分隔符**
```markdown
这是文章摘要部分，会显示在列表中。

<!--more-->

这是文章正文，只在详情页显示。
```

**方法4：Front Matter 的 summary**
```yaml
---
summary: "自定义的文章摘要"
---
```

**优先级**：Front Matter summary > description > `<!--more-->` > 自动截取

---

## 🏷️ 分类和标签

### 分类（Categories）

**当前支持的分类**：

| 英文 Key | 中文名称 | 说明 |
|---------|---------|------|
| tech | 技术分享 | 技术教程、编程经验 |
| thinking | 思考笔记 | 读书笔记、个人思考 |
| diary | 生活日记 | 日常记录、生活感悟 |
| project-review | 项目复盘 | 项目总结、经验教训 |

**如何添加新分类**：

1. **在 `hugo.yaml` 中添加映射**：
```yaml
params:
    categoryNames:
        tech: "技术分享"
        thinking: "思考笔记"
        diary: "生活日记"
        project-review: "项目复盘"
        tutorial: "教程指南"      # 新增
        tools: "工具推荐"         # 新增
```

2. **在文章中使用**：
```yaml
---
categories: ["tutorial"]  # 使用英文 key
---
```

3. **显示效果**：
   - 文章页面：显示"教程指南"
   - 侧边栏：显示"教程指南 (5)"
   - URL：`/categories/tutorial/`

**注意事项**：
- ✅ 只需在 `hugo.yaml` 维护一处映射
- ✅ 文章中使用英文 key
- ✅ 所有页面自动显示中文
- ❌ 不要在文章中直接写中文分类

### 标签（Tags）

**标签使用更灵活**：
```yaml
---
tags: ["Hugo", "静态博客", "前端", "部署"]
---
```

**建议**：
- 每篇文章 3-5 个标签
- 可以使用中文
- 标签要具体、有意义

---

## 💻 代码块使用

### 基础语法

````markdown
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```
````

### 指定语言

支持 200+ 种语言，常用的有：

````markdown
```javascript
const greeting = () => console.log("Hello");
```

```go
package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}
```

```sql
SELECT * FROM users WHERE age > 18 ORDER BY created_at DESC;
```

```bash
#!/bin/bash
echo "Hello, World!"
```

```yaml
version: "3.8"
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
```
````

### 高级特性

**行号显示**：
- 自动显示（已在 `hugo.yaml` 中配置）

**代码复制**：
- 悬停代码块时右上角显示"复制"按钮
- 点击后自动复制（不含行号）
- 成功后显示绿色"✓ 已复制"

**代码折叠**：
- 超过 600px 高度自动显示滚动条

**横向滚动**：
- 超长代码行自动显示横向滚动条

---

## ⚙️ 配置说明

### 重要配置文件

**`hugo.yaml`** - 主配置文件：

```yaml
# 基础配置
baseURL: http://www.wsqyouth.cn/
title: Cooper's Blog
theme: PaperMod

# 摘要长度
summaryLength: 70  # 约 35 个中文字

# 分页
pagination:
    pagerSize: 10  # 每页 10 篇文章

# 分类映射（重要！）
params:
    categoryNames:
        tech: "技术分享"
        thinking: "思考笔记"
        diary: "生活日记"
        project-review: "项目复盘"

    # 代码高亮
    markup:
        highlight:
            lineNos: true        # 显示行号
            codeFences: true     # 代码围栏
            guessSyntax: true    # 自动识别语言
```

### 修改配置

1. **更改每页文章数**：
```yaml
pagination:
    pagerSize: 15  # 改为 15 篇
```

2. **调整摘要长度**：
```yaml
summaryLength: 100  # 改为 100 个单词
```

3. **添加新分类**：
```yaml
params:
    categoryNames:
        new-category: "新分类名称"
```

4. **调整代码块最大高度**：
修改 `assets/css/extended/shortcode/code.css`:
```css
.post-content pre {
    max-height: 800px; /* 改为 800px */
}
```

---

## 🖼️ 图片使用

### 存放位置

```
static/
└── img/
    ├── avatar.svg          # 头像
    ├── favicon.ico         # 网站图标
    └── posts/              # 文章图片
        └── 2025/
            └── my-image.jpg
```

### 在文章中使用

```markdown
![图片描述](/img/posts/2025/my-image.jpg)

<!-- 或相对路径 -->
![图片描述](../../../static/img/posts/2025/my-image.jpg)
```

### 图片优化建议

- ✅ 使用 WebP 格式（更小）
- ✅ 压缩图片（推荐 TinyPNG）
- ✅ 设置合适的尺寸（宽度 ≤ 1200px）
- ✅ 使用有意义的文件名
- ❌ 避免超大图片（>2MB）

---

## 🔍 搜索功能

### 使用搜索

1. 点击侧边栏"搜索"框
2. 跳转到搜索页面
3. 输入关键词
4. 实时显示结果

### 搜索范围

搜索会查找：
- 文章标题
- 文章内容
- 文章摘要
- URL

### 配置

在 `hugo.yaml` 中已配置：
```yaml
outputs:
    home:
        - HTML
        - RSS
        - JSON  # 用于搜索索引

fuseOpts:
    threshold: 1
    keys: ["title", "permalink", "summary"]
```

---

## 📋 文章模板

复制此模板创建新文章：

```markdown
---
title: "文章标题"
date: "2025-01-01"
author: "Cooper"
categories: ["tech"]
tags: ["标签1", "标签2"]
description: "文章简短描述，100-160字符"
slug: "article-url-slug"
draft: false
featured: false
---

> 文章引言或摘要（可选）

## 第一部分

正文内容...

### 小节标题

内容...

## 第二部分

更多内容...

## 总结

总结内容...
```

---

## ❓ 常见问题

### 1. 如何修改网站标题？

在 `hugo.yaml` 中修改：
```yaml
title: 你的博客标题
```

### 2. 如何添加社交链接？

在 `hugo.yaml` 中修改：
```yaml
params:
    socialIcons:
        - name: github
          url: "https://github.com/yourusername"
        - name: email
          url: "mailto:your@email.com"
```

### 3. 草稿如何预览？

```bash
hugo server -D  # -D 参数显示草稿
```

### 4. 如何修改代码块主题？

在 `hugo.yaml` 中取消注释：
```yaml
markup:
    highlight:
        style: monokai  # 或 darcula, github, etc.
```

### 5. 如何禁用某个功能？

**禁用代码复制按钮**：
删除或注释 `layouts/partials/extend_footer.html` 中的 JS 引用

**禁用行号**：
```yaml
markup:
    highlight:
        lineNos: false
```

### 6. 文章不显示怎么办？

检查：
1. ✅ `draft: false`（不是草稿）
2. ✅ 日期格式正确：`"2025-01-01"`
3. ✅ 分类拼写正确
4. ✅ Front Matter 格式正确（YAML 语法）

### 7. 如何更改首页显示的文章数量？

在 `hugo.yaml` 中修改：
```yaml
pagination:
    pagerSize: 15  # 改为你想要的数量
```

---

## 📚 参考资料

### 官方文档
- [Hugo 官方文档](https://gohugo.io/documentation/)
- [PaperMod 主题文档](https://github.com/adityatelange/hugo-PaperMod/wiki)
- [Markdown 语法指南](https://www.markdownguide.org/)

### 本博客相关
- 模板文章：`content/posts/other/文章使用模板.md`
- 代码示例：`content/posts/other/code-block-test.md`
- Markdown 参考：`content/posts/other/markdown-validate.md`

---

## 🎯 最佳实践

### 文章写作
1. ✅ 标题简洁明了（5-15 字）
2. ✅ 合理使用标题层级（最多 4 级）
3. ✅ 添加有意义的描述（SEO）
4. ✅ 使用清晰的 slug（英文）
5. ✅ 适当添加代码示例
6. ✅ 配图清晰、压缩优化

### 分类和标签
1. ✅ 每篇文章只选 1-2 个分类
2. ✅ 标签 3-5 个最佳
3. ✅ 保持分类体系简洁
4. ✅ 标签要具体、有搜索价值

### 代码块
1. ✅ 始终指定语言
2. ✅ 添加必要的注释
3. ✅ 保持代码简洁可读
4. ✅ 长代码考虑拆分展示

### 性能优化
1. ✅ 压缩图片
2. ✅ 使用 WebP 格式
3. ✅ 避免过长的文章
4. ✅ 合理使用摘要

---

## 📝 版本历史

### v2.0.0 (2025-01-01)
- ✨ 新增 macOS 风格代码块
- ✨ 新增一键复制功能
- ✨ 新增分类中英文映射
- ✨ 优化响应式布局
- ✨ 美化滚动条
- 🐛 修复复制内容重复问题
- 🐛 修复时间轴日期显示问题
- 🐛 修复摘要显示过长问题

### v1.0.0 (2024-01-01)
- 🎉 初始版本发布
- ✨ 基础功能实现

---

## 💡 贡献和反馈

如有问题或建议，欢迎通过以下方式反馈：
- 📧 邮箱：coopers@gmail.com
- 🐛 GitHub Issues

---

**祝你写作愉快！** ✍️
