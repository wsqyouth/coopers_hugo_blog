#!/usr/bin/env bash
# ============================================================================
# transcode-audio.sh —— 把下载的音乐转成博客播放器要的格式
#
# 目标格式（实测听感与体积的平衡点）：
#   · 编码    MP3（LAME）
#   · 采样率  44.1 kHz
#   · 声道    立体声 2.0
#   · 码率    96 kbps CBR
#   · 元数据  全部剥离（-map_metadata -1）
#
# 为什么是这套参数：
#   钢琴独奏在中低码率下损失很小，96kbps 比常见的 128kbps 体积小 25%，
#   比 320kbps 小 70%。站点上一共 5 首，从原始的 ~45MB 压到 ~16MB。
#   剥离元数据是因为原始文件常带用不着的标签，还会泄露来源信息。
#
# 用法：
#   scripts/transcode-audio.sh <输入文件> [-o 输出.mp3] [--keep-source]
#
# 依赖：ffmpeg ffprobe
# ============================================================================
set -euo pipefail

PROG=$(basename "$0")

# ---- 目标格式：改这里就等于改全站规格 ----
TARGET_CODEC="libmp3lame"
TARGET_RATE="44100"
TARGET_CHANNELS="2"
TARGET_BITRATE="96k"

die() { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
info() { printf '\033[36m%s\033[0m\n' "$*"; }
ok()   { printf '\033[32m✓ %s\033[0m\n' "$*"; }

usage() {
    cat <<EOF
用法：
  $PROG <输入文件> [-o 输出.mp3] [--keep-source]

示例：
  $PROG /tmp/traumerei.ogg -o static/audio/about/05-schumann-traumerei.mp3
  $PROG ~/Downloads/某首歌.flac          # 输出到当前目录 某首歌.mp3

当前规格：MP3 / ${TARGET_RATE}Hz / ${TARGET_CHANNELS}ch / ${TARGET_BITRATE} / 无元数据
EOF
    exit 1
}

# ---------------------------------------------------------------- 参数
IN="" ; OUT="" ; KEEP=0
while [ $# -gt 0 ]; do
    case "$1" in
        -o|--output) OUT="${2:-}"; shift 2 ;;
        --keep-source) KEEP=1; shift ;;
        -h|--help) usage ;;
        -*) die "未知参数：$1" ;;
        *)  [ -z "$IN" ] && IN="$1" || die "只能处理一个输入文件（收到：$1）"; shift ;;
    esac
done
[ -n "$IN" ] || usage
[ -f "$IN" ] || die "文件不存在：$IN"

command -v ffmpeg  >/dev/null 2>&1 || die "需要 ffmpeg（brew install ffmpeg）"
command -v ffprobe >/dev/null 2>&1 || die "需要 ffprobe（随 ffmpeg 一起安装）"

# 默认输出名：同目录、同主名、.mp3 后缀
if [ -z "$OUT" ]; then
    OUT="$(dirname "$IN")/$(basename "${IN%.*}").mp3"
fi

# ---------------------------------------------------------------- 转码前体检
info "输入：$IN"
# 注意：-of default=noprint_wrappers=1 的输出是 "duration=123.4"（带字段名前缀），
# 不能直接当数字用。csv=p=0 才是纯值。
IN_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
IN_SIZE=$(ffprobe -v error -show_entries format=size -of csv=p=0 "$IN")
IN_INFO=$(ffprobe -v error -select_streams a:0 \
    -show_entries stream=codec_name,sample_rate,channels,bit_rate \
    -of default=noprint_wrappers=1 "$IN" | tr '\n' ' ')

[ -n "$IN_DUR" ] && [ "$IN_DUR" != "N/A" ] || die "不是有效音频文件（ffprobe 读不到时长）"

mmss() { awk -v d="$1" 'BEGIN{printf "%d:%02d", d/60, d%60}'; }
mb()   { awk -v b="$1" 'BEGIN{printf "%.2f", b/1048576}'; }

# 跨平台取字节数：BSD/macOS 用 -f%z，GNU/Linux 用 -c%s
file_bytes() {
    stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null
}
file_size_mb() { awk -v b="$(file_bytes "$1")" 'BEGIN{printf "%.2f", b/1048576}'; }

printf '  源：%s | %s | %sMB\n' "$IN_INFO" "$(mmss "$IN_DUR")" "$(mb "$IN_SIZE")"

if [ "$IN_SIZE" -lt 10240 ]; then
    die "文件只有 $(mb "$IN_SIZE")MB，太小了——多半是下载到了错误页而不是音频"
fi

# ---------------------------------------------------------------- 转码
info "转码 → MP3 ${TARGET_RATE}Hz ${TARGET_CHANNELS}ch ${TARGET_BITRATE}（剥离元数据）"

ffmpeg -hide_banner -loglevel error -y -i "$IN" \
    -codec:a "$TARGET_CODEC" \
    -b:a "$TARGET_BITRATE" \
    -ar "$TARGET_RATE" \
    -ac "$TARGET_CHANNELS" \
    -map_metadata -1 \
    "$OUT" || die "ffmpeg 转码失败"

# ---------------------------------------------------------------- 转码后校验
OUT_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")
OUT_SIZE=$(ffprobe -v error -show_entries format=size -of csv=p=0 "$OUT")
OUT_INFO=$(ffprobe -v error -select_streams a:0 \
    -show_entries stream=codec_name,sample_rate,channels,bit_rate \
    -of default=noprint_wrappers=1 "$OUT" | tr '\n' ' ')

# 时长偏差超过 1.5 秒说明转码出了问题（截断/编码错误）
DRIFT=$(awk -v a="$IN_DUR" -v b="$OUT_DUR" 'BEGIN{d=a-b; if(d<0)d=-d; print d}')
if awk -v d="$DRIFT" 'BEGIN{exit !(d>1.5)}'; then
    die "转码后时长偏差 ${DRIFT}s（源 $(mmss "$IN_DUR") → 目标 $(mmss "$OUT_DUR")），疑似截断，已保留文件待查"
fi

printf '  出：%s | %s | %sMB\n' "$OUT_INFO" "$(mmss "$OUT_DUR")" "$(mb "$OUT_SIZE")"

SAVED=$(awk -v a="$IN_SIZE" -v b="$OUT_SIZE" 'BEGIN{printf "%.0f", (a-b)/a*100}')
ok "完成：$OUT"
ok "体积 $(mb "$IN_SIZE")MB → $(mb "$OUT_SIZE")MB（省 ${SAVED}%），时长一致（偏差 ${DRIFT}s）"

# ---------------------------------------------------------------- 清理
if [ "$KEEP" -eq 0 ] && [ "$(cd "$(dirname "$IN")" && pwd)/$(basename "$IN")" != "$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")" ]; then
    rm -f "$IN"
    info "已删除源文件（保留请加 --keep-source）"
fi

# ---------------------------------------------------------------- 下一步提示
info "下一步：在 data/about-music.yml 加一行"
cat <<EOF

  - title: "曲名"
    artist: "作者 · 风格"
    file: "/audio/about/$(basename "$OUT")"

EOF
info "文件放到 static/audio/about/ 下即可，播放器自动读 data/about-music.yml"
