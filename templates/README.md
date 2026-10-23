# templates/ — 写作模板与参考（不发布）

这里的两份文件于 2026-10-22 从 `content/posts/other/` 移出。它们原本是 `draft: true` 的草稿，
从未发布过，但一直躺在 `content/` 里——等于在站点里挂了一个"半成品抽屉"。

⚠️ **它们描述的是旧的手工 Hugo 流程**：手写 front matter → 复制到 `content/posts/` →
改 `draft: false` → 提交。现行流程是 `blog-publisher` skill：在 Obsidian `Blog/` 只写正文 →
AI 判断元数据并写回 front matter → 脚本搬运 + 本地构建验证 + 推送。
**写新文章不需要这里的模板。**

Hugo 只读 `content/`、`layouts/`、`assets/` 等目录，本目录不在其列，
所以放这里不会被构建、不会上线。保留它们仅因其中一部分 Markdown / Hugo 语法参考还有查的价值。

| 文件 | 内容 |
|---|---|
| `新建文章步骤.md` | 旧流程的步骤说明（已过时，仅存档） |
| `文章使用模板.md` | front matter 字段说明 + Markdown 语法参考（参考价值最高） |
