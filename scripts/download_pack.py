#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
学Fa♂音 语音包离线/预热下载脚本 (download_pack.py)

功能说明：
  - 自动从 Gitee / GitHub 加速镜像下载学Fa音完整的离线音频包（studyfa.zip），并自动解压。
  - 零外部依赖：纯 Python 3 标准库实现。
  - 代理支持：默认不传 --proxy 参数则直接直连网络（不走代理）；
    若网络受限，可传入代理参数（如 --proxy http://127.0.0.1:7890）。

常用命令示例：
  # 1. 默认直连下载（优先 Gitee 公开镜像，免代理高速直连）
  python3 scripts/download_pack.py

  # 2. 走本地代理下载（默认/常用代理为 http://127.0.0.1:7890）
  python3 scripts/download_pack.py --proxy http://127.0.0.1:7890

  # 3. 强制重新下载并覆盖
  python3 scripts/download_pack.py --proxy http://127.0.0.1:7890 --force
"""

import argparse
import os
import shutil
import sys
import time
import urllib.request
import zipfile
from pathlib import Path

DEFAULT_MIRRORS = [
    "https://gitee.com/vincent-zyu/studyfa-vincentzyu-fork/releases/download/v0.1.0",
    "https://gh-proxy.com/https://github.com/VincentZyuApps/studyfa-vincentzyu-fork/releases/download/v0.1.0",
    "https://ghproxy.net/https://github.com/VincentZyuApps/studyfa-vincentzyu-fork/releases/download/v0.1.0",
    "https://github.com/VincentZyuApps/studyfa-vincentzyu-fork/releases/download/v0.1.0",
]


def resolve_default_target_dir() -> Path:
    current_file = Path(__file__).resolve()
    plugin_root = current_file.parent.parent
    workspace_root = plugin_root.parent.parent

    if (workspace_root / "data").exists() or (workspace_root / "package.json").exists():
        target = workspace_root / "data" / "studyfa"
        target.mkdir(parents=True, exist_ok=True)
        return target

    target = plugin_root / "data" / "studyfa"
    target.mkdir(parents=True, exist_ok=True)
    return target


def create_progress_hook(filename: str):
    start_time = time.time()

    def hook(block_num: int, block_size: int, total_size: int):
        downloaded = block_num * block_size
        elapsed = time.time() - start_time
        speed = downloaded / elapsed if elapsed > 0 else 0
        speed_mb = speed / (1024 * 1024)

        if total_size > 0:
            percent = min(100.0, downloaded * 100.0 / total_size)
            downloaded_mb = downloaded / (1024 * 1024)
            total_mb = total_size / (1024 * 1024)
            bar_len = 30
            filled_len = int(bar_len * percent // 100)
            bar = "=" * filled_len + ("-" * (bar_len - filled_len))
            sys.stdout.write(
                f"\r📦 [{filename}] [{bar}] {percent:5.1f}% | {downloaded_mb:.1f}MB/{total_mb:.1f}MB | {speed_mb:.2f} MB/s"
            )
        else:
            downloaded_mb = downloaded / (1024 * 1024)
            sys.stdout.write(f"\r📦 [{filename}] 已下载: {downloaded_mb:.1f}MB | {speed_mb:.2f} MB/s")
        sys.stdout.flush()

    return hook


def download_file(url: str, dest_path: Path, proxy: str | None = None) -> bool:
    handlers = []
    if proxy and proxy.strip():
        proxy_url = proxy.strip()
        print(f"🔌 使用代理: {proxy_url}")
        handlers.append(urllib.request.ProxyHandler({"http": proxy_url, "https": proxy_url}))
    else:
        handlers.append(urllib.request.ProxyHandler({}))

    opener = urllib.request.build_opener(*handlers)
    opener.addheaders = [("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) studyfa-downloader")]

    temp_path = dest_path.with_suffix(".tmp")
    try:
        hook = create_progress_hook(dest_path.name)
        with opener.open(url, timeout=60) as response, open(temp_path, "wb") as out_file:
            total_size = int(response.headers.get("Content-Length", "0"))
            block_size = 1024 * 64
            block_num = 0
            while True:
                chunk = response.read(block_size)
                if not chunk:
                    break
                out_file.write(chunk)
                block_num += 1
                hook(block_num, block_size, total_size)

        sys.stdout.write("\n")
        sys.stdout.flush()

        if temp_path.exists():
            if dest_path.exists():
                dest_path.unlink()
            temp_path.rename(dest_path)
            return True
        return False
    except Exception as exc:
        sys.stdout.write("\n")
        sys.stdout.flush()
        print(f"⚠️ 下载失败: {exc}")
        if temp_path.exists():
            try:
                temp_path.unlink()
            except OSError:
                pass
        return False


def main():
    parser = argparse.ArgumentParser(
        description="📻 学Fa♂音 离线语音包预热下载工具 (零外部依赖，支持代理)"
    )
    parser.add_argument(
        "--output",
        "-o",
        type=str,
        default="",
        help="输出存放目录（默认自动定位至 data/studyfa）",
    )
    parser.add_argument(
        "--proxy",
        type=str,
        default="",
        help="HTTP/HTTPS 代理地址（例如: http://127.0.0.1:7890，不传此参数则直连）",
    )
    parser.add_argument(
        "--mirror",
        type=str,
        default="",
        help="自定义下载镜像基础 URL",
    )
    parser.add_argument(
        "--force",
        "-f",
        action="store_true",
        help="若音频目录已就绪，是否强制重新下载覆盖",
    )

    args = parser.parse_args()
    proxy = args.proxy.strip() if args.proxy else None

    target_dir = Path(args.output.strip()).resolve() if args.output.strip() else resolve_default_target_dir()
    audio_dir = target_dir / "audio"

    is_ready = audio_dir.exists() and len(list(audio_dir.glob("*.mp3"))) >= 150
    if is_ready and not args.force:
        print(f"✨ 学Fa♂音音频资源已完整就绪于: {audio_dir} ({len(list(audio_dir.glob('*.mp3')))} 个音频)")
        print("💡 如需强制重新下载，请添加 --force 参数。")
        return

    mirrors = []
    if args.mirror.strip():
        mirrors.append(args.mirror.strip().rstrip("/"))
    mirrors.extend(DEFAULT_MIRRORS)

    zip_filename = "studyfa.zip"
    temp_zip_path = target_dir / f".tmp_{zip_filename}"

    print(f"🎯 准备下载离线音频资源包...")
    print(f"📁 目标目录: {target_dir}")
    if proxy:
        print(f"🌐 代理设置: {proxy}")
    else:
        print("🌐 网络模式: 直连（未启用代理，若下载受阻可添加 --proxy http://127.0.0.1:7890）")

    success = False
    for idx, mirror in enumerate(mirrors, start=1):
        url = f"{mirror}/{zip_filename}"
        print(f"\n🚀 正在尝试镜像 ({idx}/{len(mirrors)}): {url}")
        if download_file(url, temp_zip_path, proxy=proxy):
            print("📦 下载完成，正在解压音频资源...")
            try:
                with zipfile.ZipFile(temp_zip_path, "r") as zf:
                    zf.extractall(target_dir)

                if (target_dir / "audio").exists() and len(list((target_dir / "audio").glob("*.mp3"))) >= 150:
                    success = True
                    print(f"✅ 解压成功！共就绪 {len(list((target_dir / 'audio').glob('*.mp3')))} 个音频切片！")
                    try:
                        temp_zip_path.unlink()
                    except OSError:
                        pass
                    break
            except Exception as exc:
                print(f"❌ 解压校验失败: {exc}")
                try:
                    temp_zip_path.unlink()
                except OSError:
                    pass

    if success:
        print("\n🎉 恭喜！学Fa♂音离线资源包已全部安装就绪！")
        sys.exit(0)
    else:
        print("\n❌ 所有镜像源均下载失败，请检查网络或配置 --proxy http://127.0.0.1:7890 后重试。")
        sys.exit(1)


if __name__ == "__main__":
    main()
