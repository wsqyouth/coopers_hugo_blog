#!/usr/bin/env bash
# ============================================================================
# fetch-cc-music.sh —— 找可商用的古典钢琴曲（CC0 / 公有领域）
#
# 只认两种授权：
#   · CC0 1.0            —— 放弃所有权利，可自由使用/修改/商用，无需署名
#   · Public Domain Mark —— 标注为公有领域，同上
#
# 刻意排除：
#   · CC BY       —— 要署名（博客页脚常驻一行「音乐作者」很怪）
#   · CC BY-SA    —— 「相同方式共享」，衍生作品也必须开源，对博客是负担
#   · CC BY-NC    —— 禁商用
#   · 无授权标注   —— 无法验证，宁可不加
#
# 用法：
#   scripts/fetch-cc-music.sh search <ia|wc> <关键词>
#   scripts/fetch-cc-music.sh get    <ia|wc> <标识> [-o 输出名]
#
# 依赖：curl jq
# ============================================================================
set -euo pipefail

PROG=$(basename "$0")

die()  { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
info() { printf '\033[36m%s\033[0m\n' "$*"; }
ok()   { printf '\033[32m✓ %s\033[0m\n' "$*"; }

usage() {
    cat <<EOF
用法：
  $PROG search <ia|wc> <关键词>     搜索并列出 CC0 / 公有领域结果
  $PROG get    <ia|wc> <标识> [-o 输出名]   下载指定条目

引擎：
  ia   archive.org         用 advancedsearch API，看 licenseurl 字段
  wc   Wikimedia Commons   用 MediaWiki API，看 LicenseShortName 字段

示例：
  $PROG search ia "chopin nocturne"
  $PROG search wc "schumann traumerei"
  $PROG get ia parso-0376f076666a403745bbb1c79277856a9f5ef9d4 -o 01-chopin.mp3
  $PROG get wc "File:Robert Schumann - scenes from childhood, op. 15 - vii. dreaming.ogg" -o 05-schumann.mp3
EOF
    exit 1
}

# 只保留 CC0 与 Public domain，其余授权一律判为不可用
license_ok() {
    case "$1" in
        *zero*|*publicdomain*) return 0 ;;
        *) return 1 ;;
    esac
}

license_label() {
    case "$1" in
        *zero*)         echo "CC0" ;;
        *publicdomain*) echo "PD " ;;
        "")             echo "?? " ;;
        *)              echo "no " ;;
    esac
}

# ---------------------------------------------------------------- search
cmd_search() {
    # 先取引擎与关键词，没给就出用法。
    # 注意：set -u 下直接写 $1 在缺参数时会以 unbound variable 崩掉，
    # 信息很难懂；用 ${1:-} 兜底，把「缺参数」变成人能看懂的用法提示。
    local engine="${1:-}"
    local query="${2:-}"
    [ -n "$engine" ] && [ -n "$query" ] || usage

    # 用 if/elif 而不是 case：case 分支里调用带 exit 的辅助函数时，
    # set -u 会对分支内的局部变量误报 unbound（已实测复现，见踩坑记录）。
    if [ "$engine" = "ia" ]; then
        info "搜索 archive.org：$query"
        local json
        json=$(curl -sS --max-time 30 -G "https://archive.org/advancedsearch.php" \
            --data-urlencode "q=$query" \
            --data-urlencode "fl[]=identifier" \
            --data-urlencode "fl[]=title" \
            --data-urlencode "fl[]=licenseurl" \
            --data-urlencode "fl[]=creator" \
            --data-urlencode "rows=25" \
            --data-urlencode "output=json") || die "请求 archive.org 失败"

        local count=0
        local id title lic
        while IFS=$'\t' read -r id title lic; do
            [ -n "$id" ] || continue
            count=$((count+1))
            printf '  [%s] %-50s %s\n' "$(license_label "$lic")" "${title:0:50}" "$id"
        done < <(printf '%s' "$json" | jq -r '
            .response.docs[] |
            [(.identifier // ""), (.title // ""), (.licenseurl // "")] | @tsv')

        [ "$count" -gt 0 ] || die "没有结果"
        echo
        info "标 [CC0] / [PD ] 的可用；[no ] 是其它授权，[?? ] 是无授权标注——两者都不要用。"
        info "下载：$PROG get ia <identifier> -o <输出名.mp3>"

    elif [ "$engine" = "wc" ]; then
        info "搜索 Wikimedia Commons：$query"
        local json
        json=$(curl -sS --max-time 30 -G "https://commons.wikimedia.org/w/api.php" \
            --data-urlencode "action=query" \
            --data-urlencode "format=json" \
            --data-urlencode "list=search" \
            --data-urlencode "srsearch=filetype:audio $query" \
            --data-urlencode "srnamespace=6" \
            --data-urlencode "srlimit=25") || die "请求 Commons 失败"

        local titles
        titles=$(printf '%s' "$json" | jq -r '.query.search[]?.title // empty')
        [ -n "$titles" ] || die "没有结果"

        # Commons 的搜索接口不返回授权，要再查一次 imageinfo
        local batch
        batch=$(printf '%s\n' "$titles" | paste -sd'|' -)
        json=$(curl -sS --max-time 30 -G "https://commons.wikimedia.org/w/api.php" \
            --data-urlencode "action=query" \
            --data-urlencode "format=json" \
            --data-urlencode "prop=imageinfo" \
            --data-urlencode "iiprop=extmetadata|size" \
            --data-urlencode "titles=$batch") || die "请求 Commons 详情失败"

        local count=0
        local title lic size mb
        while IFS=$'\t' read -r title lic size; do
            [ -n "$title" ] || continue
            count=$((count+1))
            mb=$(awk -v b="${size:-0}" 'BEGIN{printf "%.1fMB", b/1048576}')
            printf '  [%s] %-48s %8s  %s\n' "$(license_label "$lic")" "${title:0:48}" "$mb" "${title#File:}"
        done < <(printf '%s' "$json" | jq -r '
            .query.pages[] |
            [(.title // ""),
             (.imageinfo[0].extmetadata.LicenseShortName.value // ""),
             (.imageinfo[0].size // 0)] | @tsv')

        [ "$count" -gt 0 ] || die "没有结果"
        echo
        info "下载：$PROG get wc \"<完整 File: 标题>\" -o <输出名.mp3>"

    else
        die "未知引擎：$engine [只支持 ia / wc]"
    fi
}

# ---------------------------------------------------------------- get
cmd_get() {
    local engine="${1:-}"
    local ident="${2:-}"
    [ -n "$engine" ] && [ -n "$ident" ] || usage
    shift 2 2>/dev/null || true

    local out=""
    while [ $# -gt 0 ]; do
        case "$1" in
            -o|--output) out="${2:-}"; shift 2 ;;
            *) die "未知参数：$1" ;;
        esac
    done
    [ -n "$out" ] || out="download.mp3"

    if [ "$engine" = "ia" ]; then
        info "查询 archive.org 条目：$ident"
        local meta
        meta=$(curl -sS --max-time 30 "https://archive.org/metadata/$ident") || die "请求失败"
        local lic title
        lic=$(printf '%s' "$meta" | jq -r '.metadata.licenseurl // ""')
        title=$(printf '%s' "$meta" | jq -r '.metadata.title // ""')

        printf '  标题：%s\n  授权：%s\n' "$title" "${lic:-（未标注）}"
        if ! license_ok "$lic"; then
            die "授权不是 CC0 / 公有领域，拒绝下载。宁可不要，也不要引入无法验证的音频。"
        fi
        ok "授权合规（$(license_label "$lic")）"

        # 这些条目通常一个条目就是一首，取第一个音频文件
        local fname
        fname=$(printf '%s' "$meta" | jq -r '
            [.files[]? | select(.name | test("\\.(mp3|ogg|flac|wav)$"; "i"))][0].name // empty')
        [ -n "$fname" ] || die "该条目下没有音频文件"

        local url
        url="https://archive.org/download/$ident/$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$fname")"
        info "下载：$fname"
        curl -sSL --max-time 300 "$url" -o "$out" || die "下载失败"

    elif [ "$engine" = "wc" ]; then
        info "查询 Commons 文件：$ident"
        local json
        json=$(curl -sS --max-time 30 -G "https://commons.wikimedia.org/w/api.php" \
            --data-urlencode "action=query" \
            --data-urlencode "format=json" \
            --data-urlencode "prop=imageinfo" \
            --data-urlencode "iiprop=extmetadata|url|size" \
            --data-urlencode "titles=$ident") || die "请求失败"

        local lic url size title
        lic=$(printf '%s' "$json" | jq -r '.query.pages[].imageinfo[0].extmetadata.LicenseShortName.value // ""')
        url=$(printf '%s' "$json"  | jq -r '.query.pages[].imageinfo[0].url // ""' | sed 's/?.*//')
        size=$(printf '%s' "$json" | jq -r '.query.pages[].imageinfo[0].size // 0')
        title=$(printf '%s' "$json" | jq -r '.query.pages[].title // ""')

        [ -n "$url" ] || die "没找到该文件（标题要带 File: 前缀，且完全匹配）"
        printf '  文件：%s\n  大小：%.1fMB\n  授权：%s\n' "${title#File:}" \
            "$(awk -v b="$size" 'BEGIN{print b/1048576}')" "${lic:-（未标注）}"
        if ! license_ok "$lic"; then
            die "授权不是 CC0 / 公有领域，拒绝下载。"
        fi
        ok "授权合规（$(license_label "$lic")）"

        info "下载：$url"
        curl -sSL --max-time 300 "$url" -o "$out" || die "下载失败"

    else
        die "未知引擎：$engine [只支持 ia / wc]"
    fi

    # 下载后立刻校验，避免把错误页 / HTML 当成音频
    if command -v ffprobe >/dev/null 2>&1; then
        local dur
        dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out" 2>/dev/null || true)
        if [ -z "$dur" ] || [ "$dur" = "N/A" ]; then
            rm -f "$out"
            die "下载的文件不是有效音频，已删除。检查标识是否正确。"
        fi
        local bytes mb_out
        bytes=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out" 2>/dev/null)
        mb_out=$(awk -v b="$bytes" 'BEGIN{printf "%.2f", b/1048576}')
        ok "下载完成：$out（$(awk -v d="$dur" 'BEGIN{printf "%d:%02d", d/60, d%60}')，${mb_out}MB）"
        info "下一步：scripts/transcode-audio.sh \"$out\" -o static/audio/about/<编号>-<名称>.mp3"
    else
        ok "下载完成：$out（未装 ffprobe，跳过校验）"
    fi
}

[ $# -ge 1 ] || usage
case "$1" in
    search) shift; cmd_search "$@" ;;
    get)    shift; cmd_get "$@" ;;
    -h|--help|help) usage ;;
    *) die "未知命令：$1" ;;
esac
