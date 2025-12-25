# Cooper's Hugo Blog

> 基于 Hugo 的个人博客，支持在线编辑和自动部署

🌐 **在线访问**: [www.wsqyouth.cn](http://www.wsqyouth.cn) _(可替换为你的域名或使用 localhost)_

[![Deploy Status](https://github.com/wsqyouth/coopers_hugo_blog/actions/workflows/deploy.yml/badge.svg)](https://github.com/wsqyouth/coopers_hugo_blog/actions)

---

## ✨ 功能特性

- 🚀 **自动部署** - 推送代码自动触发 GitHub Actions 构建并部署到服务器
- 📝 **在线编辑** - 文章页面点击编辑按钮，直接在 GitHub 修改（仅作者）
- 🎨 **现代化主题** - 使用 PaperMod 主题，响应式设计
- ⚡ **快速构建** - Hugo 静态站点生成器，秒级构建
- 🔒 **安全可靠** - 通过 GitHub Secrets 管理敏感信息，SSH 部署

---

## 📁 项目结构

```
coopers_hugo_blog/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 自动部署配置
├── content/posts/              # 📝 文章目录
│   ├── hello-world.md
│   └── ...
├── layouts/_default/
│   ├── single.html            # 文章模板（含在线编辑按钮）
│   └── ...
├── themes/PaperMod/           # Hugo 主题（submodule）
├── static/                    # 静态资源（图片、CSS等）
├── hugo.yaml                  # Hugo 主配置文件
└── README.md                  # 项目文档
```

---

## 🚀 快速开始

### 1. 本地开发

#### 克隆项目

```bash
# 克隆仓库（包含主题 submodule）
git clone --recurse-submodules https://github.com/wsqyouth/coopers_hugo_blog.git
cd coopers_hugo_blog

# 如果已克隆但没有 submodule，执行
git submodule update --init --recursive
```

#### 创建文章

```bash
# 创建新文章
hugo new posts/my-new-post.md

# 编辑文章（使用你喜欢的编辑器）
nano content/posts/my-new-post.md
# 或
code content/posts/my-new-post.md
```

#### 本地预览

```bash
# 启动本地服务器（包括草稿）
hugo server -D

# 访问 http://localhost:1313 预览
```

#### 提交推送

```bash
# 添加更改
git add .

# 提交
git commit -m "feat: 添加新文章"

# 推送到 GitHub（自动触发部署）
git push origin main
```

---

### 2. 在线编辑（仅作者）

#### 启用编辑按钮

1. 访问任意文章页面
2. 打开浏览器开发者工具（按 `F12` 或 `Cmd/Ctrl + Shift + I`）
3. 切换到 **Console（控制台）** 标签
4. 执行以下命令：

```javascript
localStorage.setItem('blog-admin', 'true');
```

5. 刷新页面，文章底部会显示 **"📝 编辑此文"** 按钮

#### 编辑流程

1. 点击文章底部的 **"📝 编辑此文"** 按钮
2. 自动跳转到 GitHub 在线编辑器
3. 修改 Markdown 内容
4. 填写 Commit 信息，点击 **"Commit changes"**
5. 等待 2-3 分钟，GitHub Actions 自动部署
6. 刷新网站查看更新

> **📌 Note**: 在线编辑功能仅对仓库 Owner 有效。其他访客点击编辑按钮会被 GitHub 引导创建 Pull Request。

---

## ⚙️ 部署配置

### GitHub Actions Secrets

自动部署需要在 GitHub 仓库中配置以下 Secrets：

**配置位置**: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `SSH_PRIVATE_KEY` | SSH 私钥 | `ssh-keygen -t ed25519 -C "deploy"`，复制私钥内容 |
| `REMOTE_HOST` | 服务器地址 | 服务器 IP 或域名 |
| `REMOTE_USER` | SSH 用户名 | 服务器登录用户（如 `root` 或 `ubuntu`） |
| `REMOTE_TARGET` | 部署目标路径 | 网站文件目录（如 `/var/www/your-site/`，注意末尾 `/`） |

**配置步骤**:

1. 生成 SSH 密钥对：
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key
   # 按回车，不设置密码
   ```

2. 将公钥添加到服务器：
   ```bash
   # 复制公钥
   cat ~/.ssh/deploy_key.pub

   # 登录服务器，添加到 authorized_keys
   echo "公钥内容" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. 在 GitHub 添加私钥和其他 Secrets（见上表）

4. 推送代码测试部署：
   - 访问 `Actions` 标签查看构建状态
   - 绿色 ✓ = 成功，红色 ✗ = 失败（查看日志）

---

## 🔧 服务器检查与排查

### Nginx 状态检查

```bash
# 1. 检查 Nginx 运行状态
sudo systemctl status nginx

# 2. 检查端口监听（应显示 nginx 监听 80/443 端口）
sudo netstat -tlnp | grep nginx
# 或
sudo ss -tlnp | grep nginx

# 3. 测试 Nginx 配置语法
sudo nginx -t

# 4. 查看 Nginx 错误日志（最近 20 行）
sudo tail -20 /var/log/nginx/error.log

# 5. 实时查看访问日志
sudo tail -f /var/log/nginx/access.log
```

### 部署文件检查

```bash
# 1. 列出网站目录文件（检查是否部署成功）
ls -la /var/www/your-site/

# 2. 查看首页内容（确认是否为最新）
head -20 /var/www/your-site/index.html

# 3. 检查文件修改时间
stat /var/www/your-site/index.html

# 4. 检查目录权限
ls -ld /var/www/your-site/
```

### 本地测试访问

```bash
# 1. 本地 curl 测试
curl http://localhost

# 2. 查看 HTTP 响应头
curl -I http://localhost

# 3. 测试特定域名（在服务器上）
curl -H "Host: www.your-domain.com" http://localhost
```

---

## 🐛 常见问题排查

### 问题 1: 网站无法访问

**症状**: 浏览器显示"无法访问此网站"或"连接超时"

**排查步骤**:

1. **检查 Nginx 是否运行**
   ```bash
   sudo systemctl status nginx
   ```
   - 如果显示 `inactive (dead)` 或 `failed`，重启 Nginx：
     ```bash
     sudo systemctl restart nginx
     ```

2. **检查端口监听**
   ```bash
   sudo netstat -tlnp | grep :80
   ```
   - 如果没有输出，Nginx 没有监听 80 端口，检查配置

3. **检查防火墙**
   ```bash
   # CentOS/RHEL
   sudo firewall-cmd --list-all

   # 如果 80 端口未开放，添加规则
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --reload
   ```

4. **检查云服务商安全组**
   - 登录云服务控制台（腾讯云/阿里云等）
   - 进入安全组管理
   - 确保入站规则允许 TCP 80 端口（来源：0.0.0.0/0）

---

### 问题 2: 显示 Nginx 默认页面

**症状**: 访问域名显示 "Welcome to Nginx" 而不是博客内容

**原因**: Nginx 配置中有多个 server 块，默认 server 被优先匹配

**解决方案**:

1. **检查站点配置文件**
   ```bash
   cat /etc/nginx/conf.d/your-site.conf
   ```

2. **确保配置中设置了 `default_server`**
   ```nginx
   server {
       listen 80 default_server;        # 必须有 default_server
       listen [::]:80 default_server;
       server_name www.your-domain.com your-domain.com;
       root /var/www/your-site;
       # ...
   }
   ```

3. **检查主配置文件是否有冲突**
   ```bash
   # 查看主配置文件中是否有 server 块
   grep -A 10 "server {" /etc/nginx/nginx.conf

   # 如果有，注释掉整个 server 块
   sudo nano /etc/nginx/nginx.conf
   ```

4. **重新加载配置**
   ```bash
   sudo nginx -t
   sudo nginx -s reload
   ```

---

### 问题 3: 部署后内容未更新

**症状**: GitHub Actions 显示部署成功，但访问网站看到的是旧内容

**排查**:

1. **确认文件已更新**
   ```bash
   # 查看最新修改的文件
   ls -lt /var/www/your-site/ | head -10

   # 查看 index.html 的修改时间
   stat /var/www/your-site/index.html
   ```

2. **清除浏览器缓存**
   - 强制刷新：`Ctrl + Shift + R` (Windows/Linux) 或 `Cmd + Shift + R` (Mac)
   - 或使用隐私/无痕模式访问

3. **服务器端测试（绕过缓存）**
   ```bash
   curl -H "Cache-Control: no-cache" http://your-domain.com | head -20
   ```

4. **检查 Nginx 配置的 root 路径**
   ```bash
   grep "root" /etc/nginx/conf.d/your-site.conf
   ```

---

### 问题 4: GitHub Actions 部署失败

**查看日志**:
1. 访问 GitHub 仓库的 `Actions` 标签
2. 点击失败的工作流
3. 展开失败的步骤查看详细错误

**常见错误**:

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `Permission denied (publickey)` | SSH 密钥配置错误 | 检查 `SSH_PRIVATE_KEY` Secret 是否正确，公钥是否在服务器上 |
| `Connection refused` | 服务器未运行或防火墙阻止 | 检查服务器状态和 SSH 端口（默认 22） |
| `No such file or directory` | 目标路径不存在 | 在服务器上创建目标目录：`mkdir -p /var/www/your-site` |
| `rsync: failed to set permissions` | 权限问题 | 检查目标目录权限：`chown -R user:user /var/www/your-site` |

---

### 问题 5: 编辑按钮不显示

**排查**:

1. **确认已设置 localStorage**
   ```javascript
   // 在浏览器控制台检查
   localStorage.getItem('blog-admin')
   // 应该返回 "true"
   ```

2. **重新设置**
   ```javascript
   localStorage.setItem('blog-admin', 'true');
   location.reload();
   ```

3. **检查浏览器控制台是否有 JavaScript 错误**

---

## 📋 维护命令速查

### Hugo 命令

```bash
# 创建新文章
hugo new posts/article-title.md

# 本地预览（包括草稿）
hugo server -D

# 构建生产版本
hugo --minify

# 查看 Hugo 版本
hugo version
```

### Git 命令

```bash
# 查看状态
git status

# 暂存所有更改
git add .

# 提交
git commit -m "描述"

# 推送
git push origin main

# 查看最近提交
git log --oneline -5

# 拉取远程更新
git pull
```

### Nginx 命令

```bash
# 测试配置
sudo nginx -t

# 重新加载配置（不中断服务）
sudo nginx -s reload

# 重启 Nginx
sudo systemctl restart nginx

# 查看 Nginx 版本
nginx -v

# 查看完整配置
sudo nginx -T
```

---

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Hugo** | v0.148.2 | 静态站点生成器 |
| **PaperMod** | Latest | Hugo 主题 |
| **GitHub Actions** | - | CI/CD 自动部署 |
| **Nginx** | Latest | Web 服务器 |
| **Git** | - | 版本控制 |

---

## 📚 相关文档

- [Hugo 官方文档](https://gohugo.io/documentation/)
- [PaperMod 主题文档](https://github.com/adityatelange/hugo-PaperMod/wiki)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Nginx 配置指南](./NGINX_DEPLOYMENT_GUIDE.md) _(项目中的详细文档)_

---

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- [Hugo](https://gohugo.io/) - 快速灵活的静态站点生成器
- [PaperMod](https://github.com/adityatelange/hugo-PaperMod) - 优雅的 Hugo 主题
- [GitHub Actions](https://github.com/features/actions) - 强大的 CI/CD 工具

---

**⭐ 如果这个项目对你有帮助，欢迎 Star！**
