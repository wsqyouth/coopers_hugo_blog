# 关于页背景音乐

`static/audio/about/` 下的音频文件，由关于页的 `{{< music-player >}}` shortcode
读取（曲目信息在 `data/about-music.yml`）。

## 授权情况（全部可放心商用）

五首都是**已进入公有领域**的作品，采用 **CC0 1.0 / Public Domain Mark 1.0**
——可自由使用、修改、商用，**无需署名、无附加条件**。

按年代排列，覆盖三种风格；梦幻曲最适合看书时当背景。

| 文件 | 曲目 | 风格 | 时长 | 授权 | 来源 |
|---|---|---|---|---|---|
| `04-bach-goldberg-aria.mp3` | 哥德堡变奏曲 · 咏叹调 | 巴洛克 | 4:52 | PD Mark 1.0 | `archive.org/details/musopen-dvd-in-lossless-flac-format` |
| `01-chopin-nocturne-c-minor.mp3` | 夜曲 C 小调 B.108 | 浪漫派 | 3:13 | CC0 1.0 | `archive.org/details/parso-0376f076666a403745bbb1c79277856a9f5ef9d4` |
| `02-chopin-nocturne-op55-no1.mp3` | 夜曲 F 小调 Op.55 No.1 | 浪漫派 | 5:17 | CC0 1.0 | `archive.org/details/parso-2baabd827af86a852bb54f058dbceba9edc4ec00` |
| `03-chopin-nocturne-op37-no2.mp3` | 夜曲 G 大调 Op.37 No.2 | 浪漫派 | 6:12 | CC0 1.0 | `archive.org/details/parso-1c53a71e4ef6f47591ab605d801bc3780b27824a` |
| `05-schumann-traumerei.mp3` | 梦幻曲（Träumerei） | 浪漫派 | 3:23 | Public domain | `commons.wikimedia.org/wiki/File:Robert_Schumann_-_scenes_from_childhood,_op._15_-_vii._dreaming.ogg` |

原始文件为 44.1/48kHz 立体声，合计 45MB；
已统一转码为 **44.1kHz 立体声 96kbps，合计 15.8MB**。
钢琴独奏在此码率下听感几乎无损。转码命令：

```bash
ffmpeg -i in.flac -codec:a libmp3lame -b:a 96k -ar 44100 -ac 2 -map_metadata -1 out.mp3
```

## 播放模式

播放器右下角有一个模式按钮，点一下在三种模式间循环：

| 模式 | 行为 |
|---|---|
| 顺序播放（默认） | 播完最后一首就停 |
| 列表循环 | 播完最后一首回到第一首 |
| 单曲循环 | 一直重复当前这首 |

⚠️ **`<audio>` 元素上不能写 `loop` 属性**——写了它浏览器会自动重播，
`ended` 事件就永远不触发，"播完自动下一首"会变成死代码。
单曲循环由 JS 在 `ended` 里按当前模式分支处理（已实测三种模式都正确）。

## 加一首歌怎么做

只改 `data/about-music.yml`，加一行：

```yaml
- title: "歌名"
  artist: "作者 / 风格"
  file: "/audio/about/06.mp3"
```

然后把音频文件放进 `static/audio/about/`。
不用改任何模板——播放器自己读这个文件。

## 实现要点

- **纯静态、零外部依赖**：HTML5 `<audio>` + 原生 JS，
  不引 aplayer/meting/CDN（不给自己加故障点）
- **绝不自动播放**：浏览器会拦，且未经同意出声很打扰
- **按需加载**：`preload="none"`，只有点某一首才下载那一首。
  15.8MB 不会在进页面时就全压上去
- **默认折叠**：页面上只有一个入口按钮，多数人不听歌也不该被它占空间
- **进度条可键盘操作**：`role="slider"` + `tabindex`

## 快速上手（加一首歌）

```bash
# 1) 找音乐（只列 CC0 / 公有领域）
scripts/fetch-cc-music.sh search ia "chopin nocturne"
scripts/fetch-cc-music.sh search wc "schumann traumerei"

# 2) 下载（会自动校验授权，不合规拒绝下载）
scripts/fetch-cc-music.sh get ia <identifier> -o /tmp/新歌.mp3

# 3) 转码到站点规格（MP3/44.1kHz/立体声/96kbps/无元数据）
scripts/transcode-audio.sh /tmp/新歌.mp3 -o static/audio/about/06-新歌.mp3

# 4) 在 data/about-music.yml 加一行，然后构建
```

完整方案文档（含授权判据、格式测算、踩坑记录）：
`~/Documents/ObsidianVault/1-AI相关/12-实战记录/项目实战/myblog/背景音乐方案 获取转码播放与新增 2026-10-24.md`
