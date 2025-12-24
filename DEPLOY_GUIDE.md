# 博客部署与使用指南

## 一、编辑文章功能使用说明

### 1. 启用编辑按钮

编辑按钮默认隐藏。要显示编辑按钮，需要在浏览器中设置管理员标识：

1. 访问你的博客文章页面
2. 打开浏览器开发者工具（F12 或 右键 -> 检查）
3. 切换到 Console（控制台）标签
4. 输入以下命令并回车：

```javascript
localStorage.setItem('blog-admin', 'true');
```

5. 刷新页面，文章底部会显示 "📝 编辑此文" 按钮

### 2. 编辑文章流程

1. 点击文章底部的 "📝 编辑此文" 按钮
2. 自动跳转到 GitHub 编辑页面
3. 在线编辑 Markdown 内容
4. 填写提交信息（Commit message）
5. 点击 "Commit changes" 按钮
6. GitHub Actions 自动触发构建和部署
7. 约 2-3 分钟后，网站自动更新

### 3. 取消编辑权限

如果想隐藏编辑按钮，在控制台运行：

```javascript
localStorage.removeItem('blog-admin');
```

---

## 二、GitHub 仓库配置

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`blog`
3. 选择 Public 或 Private
4. 不要勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

### 2. 推送代码到 GitHub

在博客目录下执行：

```bash
cd /Users/cooperswang/Documents/coopersWork/demotest/hugoblog

# 添加所有文件到暂存区
git add .

# 创建初始提交
git commit -m "Initial commit: Hugo blog setup"

# 添加远程仓库
git remote add origin https://github.com/wsqyouth/blog.git

# 推送到 GitHub
git push -u origin main
```

---

## 三、配置自动部署到服务器

### 1. 生成 SSH 密钥对

在本地终端执行：

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key
```

这会生成两个文件：
- `~/.ssh/github_actions_key`（私钥）
- `~/.ssh/github_actions_key.pub`（公钥）

### 2. 配置服务器

将公钥添加到服务器的授权列表：

```bash
# 复制公钥内容
cat ~/.ssh/github_actions_key.pub

# SSH 登录到服务器
ssh your_user@your_server

# 添加公钥到授权文件
echo "公钥内容" >> ~/.ssh/authorized_keys

# 设置权限
chmod 600 ~/.ssh/authorized_keys
```

### 3. 配置 GitHub Secrets

1. 访问仓库页面：https://github.com/wsqyouth/blog
2. 点击 Settings -> Secrets and variables -> Actions
3. 点击 "New repository secret" 添加以下密钥：

**必需的 Secrets：**

| 名称 | 说明 | 示例 |
|------|------|------|
| `SSH_PRIVATE_KEY` | SSH 私钥内容 | 将 `~/.ssh/github_actions_key` 的全部内容复制粘贴 |
| `REMOTE_HOST` | 服务器 IP 或域名 | `123.45.67.89` 或 `server.example.com` |
| `REMOTE_USER` | SSH 登录用户名 | `root` 或 `www-data` |
| `REMOTE_TARGET` | 网站文件目标路径 | `/var/www/sulvblog.cn/`（注意末尾的 `/`） |

**可选的 Secrets：**

| 名称 | 说明 | 默认值 |
|------|------|--------|
| `REMOTE_PORT` | SSH 端口 | `22` |

### 4. 测试部署

配置完成后：

1. 在 GitHub 仓库页面点击 Actions 标签
2. 手动触发工作流：点击 "部署Hugo博客到服务器" -> "Run workflow" -> "Run workflow"
3. 观察构建日志，确认部署成功

### 5. 配置域名（如需要）

如果使用自定义域名 `www.sulvblog.cn`：

1. 在域名服务商配置 DNS：
   - 类型：A 记录
   - 主机记录：www
   - 记录值：你的服务器 IP

2. 在服务器配置 Nginx：

```nginx
server {
    listen 80;
    server_name www.sulvblog.cn sulvblog.cn;

    root /var/www/sulvblog.cn;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

3. 重启 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 四、日常使用流程

### 方式一：通过编辑按钮（推荐）

1. 访问文章页面
2. 点击底部的 "📝 编辑此文"
3. 在 GitHub 上编辑并提交
4. 等待自动部署完成

### 方式二：通过 Git 推送

1. 本地修改 Markdown 文件
2. 提交更改：

```bash
git add .
git commit -m "更新文章：修复错别字"
git push
```

3. GitHub Actions 自动触发部署

### 方式三：直接在 GitHub 网页编辑

1. 访问 https://github.com/wsqyouth/blog
2. 找到要编辑的文件（如 `content/posts/xxx.md`）
3. 点击编辑按钮（铅笔图标）
4. 编辑并提交

---

## 五、故障排查

### 编辑按钮不显示

- 确认已执行 `localStorage.setItem('blog-admin', 'true')`
- 刷新页面
- 检查浏览器控制台是否有 JavaScript 错误

### GitHub Actions 部署失败

1. 检查 Actions 标签下的错误日志
2. 常见问题：
   - SSH 连接失败：检查 `SSH_PRIVATE_KEY`、`REMOTE_HOST`、`REMOTE_USER` 是否正确
   - 权限问题：确保服务器目标目录有写权限
   - 端口问题：检查 `REMOTE_PORT` 是否正确（默认 22）

### 服务器部署后网站未更新

1. 检查文件是否正确上传到 `REMOTE_TARGET` 目录
2. 检查 Nginx 配置的 root 路径是否正确
3. 清除浏览器缓存

---

## 六、权限说明

### 谁可以编辑文章？

- **仓库协作者**：有仓库写权限的用户可以直接修改
- **普通访客**：点击编辑按钮后，GitHub 会引导他们 fork 仓库并创建 Pull Request
- **Pull Request**：需要你审核和合并，不会自动修改网站

### 如何添加协作者？

1. 访问 https://github.com/wsqyouth/blog/settings/access
2. 点击 "Add people"
3. 输入 GitHub 用户名并邀请

---

## 七、备份与恢复

由于使用 Git 管理，所有历史版本都保存在 GitHub：

- 查看历史：https://github.com/wsqyouth/blog/commits/main
- 回滚到某个版本：`git reset --hard <commit-id> && git push -f`
- 下载备份：`git clone https://github.com/wsqyouth/blog.git`

---

如有问题，请查看 GitHub Actions 日志或联系技术支持。
