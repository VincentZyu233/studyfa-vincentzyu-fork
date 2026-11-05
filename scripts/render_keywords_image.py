#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
render_keywords_image.py

使用 Pillow 渲染学Fa♂音全量 105 个触发词的现代暗黑紧凑图鉴长图
优先采用 LXGWWenKaiMono（霞鹜文楷等宽）字体，自适应列宽与大字号排版
输出文件：docs/images/keywords_overview.png
"""

import json
import math
import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


def get_font(size: int, bold: bool = False):
    root = Path(__file__).resolve().parent.parent  # external/studyfa-vincentzyu-fork
    workspace_root = root.parent.parent            # koishi-dev-8

    # 优先查找本地公共字体库中的霞鹜文楷 (LXGW WenKai Mono)
    lxgw_candidates = [
        workspace_root / "data" / "fonts" / ("LXGWWenKaiMono-Medium.ttf" if bold else "LXGWWenKaiMono-Regular.ttf"),
        workspace_root / "data" / "fonts" / "LXGWWenKaiMono-Regular.ttf",
        workspace_root / "data" / "assets" / "bili-live-music" / "fonts" / "LXGWWenKaiMono-Regular.ttf",
        workspace_root / "data" / "assets" / "music-link-vincentzyu-fork" / "LXGWWenKaiMono-Regular.ttf",
    ]

    for p in lxgw_candidates:
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size)
            except Exception:
                pass

    # 系统备用中文字体
    system_candidates = [
        "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    ]
    for p in system_candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass

    return ImageFont.load_default()


def main():
    root = Path(__file__).resolve().parent.parent
    workspace_root = root.parent.parent

    # 读取本地关键词字典
    map_file = workspace_root / "data" / "studyfa" / "studyfa_map.json"
    if not map_file.exists():
        map_file = Path("D:/temp/gemini/studyfa/studyfa_map.json")
    if not map_file.exists():
        # 从 keywords.ts 解析提取
        ts_file = root / "src" / "data" / "keywords.ts"
        lines = ts_file.read_text(encoding="utf-8")
        json_str = lines.split("FA_KEYWORD_MAP: Record<string, string[]> =")[1].strip().rstrip(";")
        data = json.loads(json_str)
    else:
        with open(map_file, "r", encoding="utf-8") as f:
            data = json.load(f)

    keywords = list(data.keys())
    # 按字数和拼音自然排序
    keywords.sort(key=lambda k: (len(k), k))

    # 紧凑化排版参数：改为 5 列更充分利用宽度，大幅减小多余留白
    img_width = 1080
    cols = 5
    padding = 24
    card_gap = 8
    card_height = 48
    card_width = (img_width - padding * 2 - (cols - 1) * card_gap) // cols

    rows = math.ceil(len(keywords) / cols)
    header_height = 136
    footer_height = 80
    img_height = header_height + rows * (card_height + card_gap) + footer_height

    # 高对比度暗黑画布
    img = Image.new("RGBA", (img_width, img_height), (16, 18, 24, 255))
    draw = ImageDraw.Draw(img)

    # 顶部背景层
    draw.rectangle([(0, 0), (img_width, header_height)], fill=(22, 25, 34, 255))
    draw.line([(padding, header_height - 1), (img_width - padding, header_height - 1)], fill=(40, 48, 64, 255), width=2)

    # 加载霞鹜文楷字体，字号更大更饱满
    title_font = get_font(34, bold=True)
    sub_font = get_font(16)
    badge_font = get_font(13, bold=True)
    kw_font = get_font(17, bold=True)       # 从 15 放大到 17
    count_font = get_font(12, bold=True)
    footer_font = get_font(14)

    # 顶部标题栏
    title_text = "学Fa♂音 哲学语音触发词大全"
    draw.text((padding, 24), title_text, font=title_font, fill=(246, 173, 85, 255))

    badge_text = f"共 {len(keywords)} 个关键词 · 205 段纯正原声"
    draw.rounded_rectangle([(padding, 80), (padding + 225, 108)], radius=6, fill=(49, 130, 206, 50), outline=(66, 153, 225, 160), width=1)
    draw.text((padding + 12, 84), badge_text, font=badge_font, fill=(144, 205, 244, 255))

    tip_text = "※ 在聊天中直接发送以下任意词汇即可触发原声语音条"
    draw.text((padding + 245, 85), tip_text, font=sub_font, fill=(160, 174, 192, 255))

    # 绘制 5 列紧凑卡片
    for idx, kw in enumerate(keywords):
        r = idx // cols
        c = idx % cols
        x = padding + c * (card_width + card_gap)
        y = header_height + 16 + r * (card_height + card_gap)

        audio_count = len(data[kw])

        # 卡片背景
        draw.rounded_rectangle([(x, y), (x + card_width, y + card_height)], radius=8, fill=(26, 31, 42, 255), outline=(48, 56, 74, 255), width=1)

        # 关键词字词（字号更大）
        draw.text((x + 10, y + 12), kw, font=kw_font, fill=(240, 244, 248, 255))

        # 右侧分片数小标
        count_str = f"{audio_count}P" if audio_count > 1 else "1P"
        cx = x + card_width - 32
        cy = y + 15
        badge_fill = (237, 137, 54, 220) if audio_count > 1 else (113, 128, 150, 160)
        draw.rounded_rectangle([(cx - 4, cy - 2), (cx + 22, cy + 18)], radius=4, fill=(35, 42, 58, 255))
        draw.text((cx, cy), count_str, font=count_font, fill=badge_fill)

    # 底部 Footer
    fy = img_height - footer_height + 20
    draw.line([(padding, fy - 15), (img_width - padding, fy - 15)], fill=(40, 48, 64, 255), width=1)
    footer_text = "由 koishi-plugin-studyfa-vincentzyu-fork 驱动 · 支持纯离线/在线多镜像双模式"
    draw.text((padding, fy), footer_text, font=footer_font, fill=(113, 128, 150, 255))
    cmd_text = "指令：/studyfa .list 或 /fa .list"
    draw.text((img_width - padding - 260, fy), cmd_text, font=footer_font, fill=(160, 174, 192, 255))

    out_file = root / "docs" / "images" / "keywords_overview.png"
    out_file.parent.mkdir(parents=True, exist_ok=True)
    img.save(str(out_file), "PNG", optimize=True)
    print("✅ 紧凑版大字号触发词长图渲染完成:", out_file, f"({out_file.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
