# Hugo 博客图片使用指南 📸

## 快速开始

### 方式1：Page Bundle（推荐，图片与文章在一起）

**创建新文章并添加图片：**
```bash
# 1. 创建文章目录
mkdir -p content/posts/tech/my-article

# 2. 创建文章
hugo new content/posts/tech/my-article/index.md

# 3. 添加图片
cp ~/Downloads/screenshot.png content/posts/tech/my-article/
```

**在Markdown中引用：**
```markdown
![图片描述](screenshot.png)
```

---

### 方式2：Static 目录（全局共享图片）

**添加共享图片：**
```bash
# 复制图片到static目录
cp ~/Downloads/logo.png static/images/
```

**在任意文章中引用：**
```markdown
![Logo](/images/logo.png)
```

---

## 详细说明

### Page Bundle 目录结构

```
content/posts/
├── tech/
│   ├── article-1/
│   │   ├── index.md          # 文章内容
│   │   ├── image1.png        # 图片1
│   │   ├── image2.jpg        # 图片2
│   │   └── diagram.svg       # SVG图
│   └── article-2/
│       ├── index.md
│       └── cover.jpg
├── thinking/
│   └── book-review/
│       ├── index.md
│       └── book-cover.jpg
```

**引用方式：**
```markdown
# 相对路径（推荐）
![描述](image1.png)
![描述](./image2.jpg)

# 也支持
![描述](diagram.svg)
```

**生成的URL：**
```
/2025/12/25/article-1/image1.png
/2025/12/25/article-1/image2.jpg
```

---

### Static 目录结构

```
static/
├── images/
│   ├── posts/              # 文章配图
│   │   ├── diagram.png
│   │   └── flowchart.svg
│   ├── icons/              # 图标
│   │   ├── github.svg
│   │   └── twitter.svg
│   └── common/             # 公共资源
│       ├── logo.png
│       └── avatar.jpg
├── img/                    # 当前使用
│   ├── avatar.svg
│   └── favicon.ico
```

**引用方式：**
```markdown
# 从网站根路径引用（必须以/开头）
![流程图](/images/posts/diagram.png)
![Logo](/images/common/logo.png)
![头像](/img/avatar.svg)
```

**生成的URL：**
```
/images/posts/diagram.png
/images/common/logo.png
```

---

## 两种方式对比

| 特性 | Page Bundle | Static 目录 |
|------|-------------|-------------|
| **图片位置** | 与文章在同一目录 | static/images/ |
| **引用方式** | `![](image.png)` | `![](/images/image.png)` |
| **适用场景** | 文章专属图片 | 多文章共享图片 |
| **管理便利性** | ⭐⭐⭐⭐⭐ 图文一体 | ⭐⭐⭐ 需单独管理 |
| **复用性** | ⭐⭐ 单文章使用 | ⭐⭐⭐⭐⭐ 全站复用 |
| **删除文章** | 图片自动删除 | 图片需手动删除 |
| **URL结构** | `/年/月/日/文章名/图片` | `/images/图片` |

---

## 最佳实践

### 1. 图片命名规范

✅ **推荐：**
```
user-flow-diagram.png
system-architecture.jpg
install-step-1.png
install-step-2.png
```

❌ **避免：**
```
图片1.png              # 中文
User Flow Diagram.png  # 空格
image.png              # 不具描述性
IMG_20231225.jpg       # 无意义编号
```

### 2. 图片格式选择

| 格式 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **PNG** | 截图、图表、Logo | 无损压缩，支持透明 | 文件较大 |
| **JPG** | 照片、复杂图像 | 文件小 | 有损压缩 |
| **SVG** | 图标、简单图形 | 矢量可缩放 | 不适合复杂图像 |
| **WebP** | 网页优化 | 体积小、质量高 | 旧浏览器不支持 |

### 3. 图片优化

**压缩工具：**
```bash
# macOS 安装 ImageMagick
brew install imagemagick

# 压缩PNG（保持质量）
convert input.png -quality 85 output.png

# 压缩JPG
convert input.jpg -quality 75 output.jpg

# 批量调整尺寸（宽度1200px）
convert input.png -resize 1200x output.png
```

**在线工具：**
- [TinyPNG](https://tinypng.com/) - PNG/JPG压缩
- [Squoosh](https://squoosh.app/) - Google开源图片压缩工具

**建议：**
- 文章配图宽度：800-1200px
- 单张图片大小：< 500KB
- 总页面图片：< 2MB

### 4. 响应式图片

Hugo支持响应式图片处理（仅Page Bundle）：

```markdown
{{< figure src="screenshot.png" alt="截图" caption="这是标题" >}}
```

### 5. 图片描述

**SEO友好的描述：**
```markdown
# ❌ 不好
![](image.png)
![图片](image.png)
![alt text](image.png)

# ✅ 好
![用户登录流程图](user-login-flow.png)
![系统架构设计](system-architecture.png)
![Google AI Studio 操作界面](google-ai-studio.png)
```

---

## 实战示例

### 示例1：技术教程（多图）

**目录结构：**
```
content/posts/tech/docker-tutorial/
├── index.md
├── step1-install.png
├── step2-config.png
├── step3-run.png
└── architecture.svg
```

**Markdown：**
```markdown
---
title: "Docker 入门教程"
date: "2025-12-25"
---

## 安装步骤

第一步，下载安装包：
![Docker安装界面](step1-install.png)

第二步，配置环境：
![配置界面](step2-config.png)

系统架构如下：
![Docker架构图](architecture.svg)
```

---

### 示例2：使用共享Logo

**目录结构：**
```
static/images/common/
└── logo.png

content/posts/tech/article1/index.md
content/posts/tech/article2/index.md
```

**两篇文章都可以引用：**
```markdown
![Cooper's Blog Logo](/images/common/logo.png)
```

---

### 示例3：转换现有文章

**如果你已有文章和图片在同一目录：**

```bash
# 当前结构（无法显示图片）
content/posts/tech/
├── my-article.md
└── screenshot.png

# 转换为Page Bundle
mkdir -p content/posts/tech/my-article
mv content/posts/tech/my-article.md content/posts/tech/my-article/index.md
mv content/posts/tech/screenshot.png content/posts/tech/my-article/

# 最终结构（图片正常显示）
content/posts/tech/my-article/
├── index.md
└── screenshot.png
```

---

## 常见问题

### Q1: 图片无法显示？

**检查清单：**
1. ✅ Page Bundle：文章是 `index.md` 而不是 `article.md`
2. ✅ 图片路径：使用相对路径 `image.png` 或 `/images/image.png`
3. ✅ 文件存在：确认图片文件确实在对应目录
4. ✅ 文件名：不包含空格和特殊字符
5. ✅ 编译：运行 `hugo --buildDrafts` 查看是否有错误

### Q2: Page Bundle vs Static，如何选择？

**使用 Page Bundle 当：**
- 图片只用于这一篇文章
- 希望图文一起管理、一起删除
- 文章图片较多（教程、测评类）

**使用 Static 当：**
- Logo、图标等多文章共享
- 网站配置图片（favicon、avatar等）
- 需要固定URL的图片

**建议：**
- 新手统一使用 Page Bundle
- 公共资源放 Static

### Q3: 相对路径 vs 绝对路径？

```markdown
# Page Bundle 使用相对路径
![](image.png)           # ✅ 推荐
![](./image.png)         # ✅ 也可以

# Static 使用绝对路径（从网站根目录）
![](/images/logo.png)    # ✅ 必须以/开头
```

### Q4: 如何批量转换为Page Bundle？

创建脚本 `convert-to-bundle.sh`：

```bash
#!/bin/bash
# 将单文件文章转换为Page Bundle

if [ $# -ne 1 ]; then
    echo "用法: ./convert-to-bundle.sh article.md"
    exit 1
fi

FILE=$1
DIR="${FILE%.md}"

# 创建目录
mkdir -p "$DIR"

# 移动文件
mv "$FILE" "$DIR/index.md"

echo "已转换: $DIR/index.md"
echo "现在可以将图片放入 $DIR/ 目录"
```

**使用：**
```bash
chmod +x convert-to-bundle.sh
./convert-to-bundle.sh content/posts/tech/my-article.md
cp ~/Downloads/*.png content/posts/tech/my-article/
```

---

## 快速参考

### Page Bundle 工作流

```bash
# 1. 创建文章
mkdir -p content/posts/tech/new-post
hugo new content/posts/tech/new-post/index.md

# 2. 添加图片
cp ~/Downloads/image.png content/posts/tech/new-post/

# 3. 编辑文章
vim content/posts/tech/new-post/index.md
# 添加: ![描述](image.png)

# 4. 预览
hugo server -D

# 5. 发布
# 将 draft: true 改为 draft: false
git add .
git commit -m "feat: add new post with images"
git push
```

### Static 工作流

```bash
# 1. 添加图片
cp ~/Downloads/logo.png static/images/

# 2. 在任意文章中引用
vim content/posts/tech/article/index.md
# 添加: ![Logo](/images/logo.png)

# 3. 发布
git add .
git commit -m "feat: add logo"
git push
```

---

## 附录

### 当前项目图片位置

```
coopers_hugo_blog/
├── static/
│   ├── img/
│   │   ├── avatar.svg        # 首页头像
│   │   └── favicon.ico       # 网站图标
│   └── images/               # 建议新增
│       ├── posts/            # 文章共享图片
│       └── common/           # 公共资源
├── content/posts/
│   └── tech/
│       ├── gemini-demo/      # ✅ Page Bundle示例
│       │   ├── index.md
│       │   └── google-ai-studio.png
```

### 相关文档

- [Hugo Page Bundles 官方文档](https://gohugo.io/content-management/page-bundles/)
- [Hugo 图片处理文档](https://gohugo.io/content-management/image-processing/)
- [Markdown 图片语法](https://www.markdownguide.org/basic-syntax/#images-1)

---

**最后更新：** 2025-12-25
**适用版本：** Hugo v0.148.2+
