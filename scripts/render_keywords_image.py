#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
render_keywords_image.py

使用 Pillow 渲染学Fa♂音全量 105 个触发词的现代暗黑/金质感图鉴长图
输出文件：docs/images/keywords_overview.png
"""

import json
import math
import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def get_font(size: int, bold: bool = False):
    candidates = [
        "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def main():
    root = Path(__file__).resolve().parent.parent
    map_file = Path("D:/temp/gemini/studyfa/studyfa_map.json")
    if not map_file.exists():
        # 回退寻找
        map_file = root / "src" / "data" / "keywords.ts"

    with open("D:/temp/gemini/studyfa/studyfa_map.json", "r", encoding="utf-8") as f:
        data: dict = json.load(f)

    keywords = list(data.keys())
    # 按长度与拼音/字母简单排序
    keywords.sort(key=lambda k: (len(k), k))

    # 图片参数
    img_width = 1000
    cols = 4
    padding = 32
    card_gap = 12
    card_height = 46
    card_width = (img_width - padding * 2 - (cols - 1) * card_gap) // cols

    rows = math.ceil(len(keywords) / cols)
    header_height = 140
    footer_height = 90
    img_height = header_height + rows * (card_height + card_gap) + footer_height

    # 创建背景（深蓝黑高对比暗黑画布）
    img = Image.new("RGBA", (img_width, img_height), (18, 20, 26, 255))
    draw = ImageDraw.Draw(img)

    # 绘制背景装饰光晕
    draw.rectangle([(0, 0), (img_width, header_height)], fill=(24, 27, 36, 255))
    draw.line([(padding, header_height - 1), (img_width - padding, header_height - 1)], fill=(45, 55, 72, 255), width=2)

    # 字体
    title_font = get_font(32, bold=True)
    sub_font = get_font(16)
    badge_font = get_font(12, bold=True)
    kw_font = get_font(15, bold=True)
    count_font = get_font(12)
    footer_font = get_font(14)

    # 绘制顶部 Header
    # 标题
    title_text = "学Fa♂音 哲学语音触发词大全"
    draw.text((padding, 28), title_text, font=title_font, fill=(246, 173, 85, 255))

    # 标签徽章
    badge_text = f"共 {len(keywords)} 个关键词 · 205 段纯正原声"
    draw.rounded_rectangle([(padding, 80), (padding + 220, 108)], radius=6, fill=(49, 130, 206, 60), outline=(66, 153, 225, 180), width=1)
    draw.text((padding + 14, 85), badge_text, font=badge_font, fill=(144, 205, 244, 255))

    tip_text = "※ 在群聊直接发送任意关键词即可触发对应哲学原声语音条"
    draw.text((padding + 240, 86), tip_text, font=sub_font, fill=(160, 174, 192, 255))

    # 绘制关键词网格
    for idx, kw in enumerate(keywords):
        r = idx // cols
        c = idx % cols
        x = padding + c * (card_width + card_gap)
        y = header_height + 20 + r * (card_height + card_gap)

        audio_count = len(data[kw])

        # 卡片背景（圆角胶囊）
        draw.rounded_rectangle([(x, y), (x + card_width, y + card_height)], radius=8, fill=(30, 35, 48, 255), outline=(55, 65, 85, 255), width=1)

        # 关键词文本
        draw.text((x + 14, y + 13), kw, font=kw_font, fill=(237, 242, 247, 255))

        # 右侧语音切片数量小徽章
        count_str = f"{audio_count}P" if audio_count > 1 else "1P"
        cx = x + card_width - 34
        cy = y + 14
        badge_color = (237, 137, 54, 200) if audio_count > 1 else (113, 128, 150, 180)
        draw.rounded_rectangle([(cx - 4, cy - 2), (cx + 24, cy + 18)], radius=4, fill=(40, 48, 65, 255))
        draw.text((cx, cy), count_str, font=count_font, fill=badge_color)

    # 绘制底部 Footer
    fy = img_height - footer_height + 20
    draw.line([(padding, fy - 15), (img_width - padding, fy - 15)], fill=(45, 55, 72, 255), width=1)
    footer_text = "由 koishi-plugin-studyfa-vincentzyu-fork 驱动 · 支持纯离线/在线多镜像双模式"
    draw.text((padding, fy), footer_text, font=footer_font, fill=(113, 128, 150, 255))
    cmd_text = "指令：/studyfa .list 或 /fa .list"
    draw.text((img_width - padding - 240, fy), cmd_text, font=footer_font, fill=(160, 174, 192, 255))

    out_file = root / "docs" / "images" / "keywords_overview.png"
    out_file.parent.mkdir(parents=True, exist_ok=True)
    img.save(str(out_file), "PNG", optimize=True)
    print("✅ 触发词大图渲染完成:", out_file, f"({out_file.stat().st_size / 1024:.1f} KB)")

if __name__ == "__main__":
    main()
