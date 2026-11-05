const pkg = require('../package.json')

const baseDetailsStyle = 'margin:12px 0;border-radius:10px;overflow:hidden;box-shadow:var(--k-card-shadow, 0 1px 4px rgb(0 0 0 / 10%));border:1px solid var(--card-border, rgba(127, 127, 127, 0.3));background:var(--k-card-bg, transparent);transition:border-color .2s ease, background-color .2s ease;'
const baseSummaryStyle = 'padding:10px 14px;cursor:pointer;user-select:none;font-weight:700;display:flex;align-items:center;justify-content:space-between;outline:none;background:var(--card-summary-bg, rgba(127, 127, 127, 0.12));color:var(--card-title-color, var(--k-text-dark, #f5f5f5));'
const baseBodyStyle = 'padding:10px 16px 14px;color:var(--k-text-dark, inherit);line-height:1.75;font-size:14px;border-top:1px solid var(--card-border, rgba(127, 127, 127, 0.2));background:var(--k-card-bg, transparent);'
const codeBlockStyle = 'margin:6px 0 10px;padding:8px 12px;background:var(--k-hover-bg, rgba(127, 127, 127, .15));border:1px solid var(--k-color-divider, rgba(127, 127, 127, .25));border-radius:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:13px;line-height:1.6;overflow-x:auto;color:var(--k-text-dark, inherit);'

export const usage = `
<style>
.k-usage-card {
  margin: 12px 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--k-card-shadow, 0 1px 4px rgba(0, 0, 0, 0.1));
  border: 1px solid var(--card-border);
  background: var(--k-card-bg, transparent);
  transition: border-color .2s ease, background-color .2s ease;
}
.k-usage-card summary {
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-summary-bg);
  color: var(--card-title-color, var(--k-text-dark, inherit));
  list-style: none;
  outline: none;
}
.k-usage-card summary::-webkit-details-marker { display: none; }
.k-usage-card summary:hover { filter: brightness(1.06); }
.k-usage-card .k-card-body {
  padding: 10px 16px 14px;
  color: var(--k-text-dark, inherit);
  line-height: 1.75;
  font-size: 14px;
  border-top: 1px solid var(--card-border);
  background: var(--k-card-bg, transparent);
}
.k-usage-card .k-fold-hint {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  opacity: 0.9;
  color: var(--card-hint-color, var(--k-text-normal, inherit));
}
.k-usage-card .k-fold-state::before { content: "展开"; }
.k-usage-card[open] summary .k-fold-state::before { content: "收起"; }
.k-usage-card .k-arrow-icon {
  display: inline-block;
  transition: transform .25s ease;
  font-size: 11px;
}
.k-usage-card[open] summary .k-arrow-icon { transform: rotate(180deg); }

/* 浅色主题色彩 */
.card-green { --card-border: rgba(47, 133, 90, 0.35); --card-summary-bg: rgba(47, 133, 90, 0.1); --card-title-color: #22543d; --card-hint-color: #276749; }
.card-orange { --card-border: rgba(221, 107, 32, 0.35); --card-summary-bg: rgba(221, 107, 32, 0.1); --card-title-color: #9c4221; --card-hint-color: #c05621; }
.card-purple { --card-border: rgba(128, 90, 213, 0.35); --card-summary-bg: rgba(128, 90, 213, 0.1); --card-title-color: #553c9a; --card-hint-color: #6b46c1; }
.card-blue { --card-border: rgba(49, 130, 206, 0.35); --card-summary-bg: rgba(49, 130, 206, 0.1); --card-title-color: #2b6cb0; --card-hint-color: #2b6cb0; }

/* 黑夜模式高对比度适配 */
html.dark .card-green, .dark .card-green { --card-border: rgba(72, 187, 120, 0.45); --card-summary-bg: rgba(72, 187, 120, 0.18); --card-title-color: #68d391; }
html.dark .card-orange, .dark .card-orange { --card-border: rgba(237, 137, 54, 0.45); --card-summary-bg: rgba(237, 137, 54, 0.18); --card-title-color: #f6ad55; }
html.dark .card-purple, .dark .card-purple { --card-border: rgba(159, 122, 234, 0.45); --card-summary-bg: rgba(159, 122, 234, 0.18); --card-title-color: #b794f4; }
html.dark .card-blue, .dark .card-blue { --card-border: rgba(66, 153, 225, 0.45); --card-summary-bg: rgba(66, 153, 225, 0.18); --card-title-color: #63b3ed; }

/* 显眼提示框自适应 */
.k-notice-box { margin: 14px 0; padding: 12px 16px; border-radius: 8px; border-left: 5px solid #3182ce; background: rgba(49, 130, 206, 0.08); line-height: 1.8; }
.k-notice-title { font-weight: 700; font-size: 15px; color: #2b6cb0; margin-bottom: 4px; }
html.dark .k-notice-box, .dark .k-notice-box { background: rgba(49, 130, 206, 0.16) !important; border-left-color: #63b3ed !important; }
html.dark .k-notice-title, .dark .k-notice-title { color: #63b3ed !important; }
</style>

<h1>📻 Koishi 插件：学Fa♂音 (VincentZyu Fork)</h1>
<h2>🎯 插件版本：v${pkg.version}</h2>

<p>
  <a href="https://www.npmjs.com/package/koishi-plugin-studyfa-vincentzyu-fork" target="_blank">
    <img src="https://img.shields.io/npm/v/koishi-plugin-studyfa-vincentzyu-fork?style=flat-square&logo=npm" alt="npm version">
  </a>
  <a href="https://github.com/VincentZyuApps/studyfa-vincentzyu-fork" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://gitee.com/vincent-zyu/studyfa-vincentzyu-fork" target="_blank">
    <img src="https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white" alt="Gitee">
  </a>
  <a href="https://qm.qq.com/q/ZHj33L5cuC" target="_blank">
    <img src="https://img.shields.io/badge/QQ群-1085190201-12B7F5?style=flat-square&logo=qq&logoColor=white" alt="QQ群">
  </a>
</p>

<p><b>💬 交流反馈：</b>欢迎加入 QQ 群 <b>1085190201</b>，在群里直接艾特我，回复更快哦~ ✨</p>

<!-- 醒目的离线下载排障提示 -->
<div class="k-notice-box">
  <div class="k-notice-title">⚡ 离线资源与国内加速下载说明</div>
  <p style="margin: 4px 0 6px;">
    本插件针对原版（依赖单一私人服务器易失效）进行了重大升级：**已将全量 205 段音频打包为离线资源包**，并支持多源备份镜像（Gitee ➔ gh-proxy ➔ GitHub）。
  </p>
  <ul style="margin: 4px 0 0 18px; padding: 0;">
    <li><b>首选直连</b>：Gitee 公开镜像源（国内服务器免代理，秒级快速拉取）。</li>
    <li><b>代理选项</b>：若内网受限，可开启配置项 <code>useDownloadProxy</code> 并填写 <code>downloadProxyUrl</code>（默认 <code>http://127.0.0.1:7890</code>）。</li>
    <li><b>Python 离线预热</b>：可在服务器终端执行自带脚本：<br>
      <code style="${codeBlockStyle}; display: inline-block; margin: 3px 0; padding: 3px 8px;">python3 scripts/download_pack.py --proxy http://127.0.0.1:7890</code>
    </li>
  </ul>
</div>

<hr>

<h2>✨ 核心特色与升级</h2>
<ul>
  <li>🚀 <b>纯 TypeScript 纯净架构</b>：完全重构原版 JavaScript，类型完备，健壮性极高。</li>
  <li>📦 <b>真离线支持，不依赖私人服务器</b>：全量 205 段音频收录至 Release 包，自动下载解压至本地，彻底告别原版 smmcat.cn 关机失效。</li>
  <li>🖼️ <b>触发词图鉴可视化</b>：支持通过 <code>/fa .list</code> 指令直接输出高清现代暗黑图鉴长图，一览 105 个关键词！</li>
  <li>🌐 <b>高可用镜像与回退</b>：本地未就绪时自动尝试 Gitee / GitHub 加速，并保留在线兜底保障。</li>
</ul>

<!-- ================= 折叠卡片 1: 指令说明 ================= -->
<details class="k-usage-card card-green" style="${baseDetailsStyle}">
<summary style="${baseSummaryStyle}">
  <span>📌 指令与使用方法</span>
  <span class="k-fold-hint"><span class="k-fold-state"></span><span class="k-arrow-icon">▼</span></span>
</summary>
<div class="k-card-body" style="${baseBodyStyle}">
  <p><b>1. 被动触发（无需指令前缀）：</b>在开启监听的群内，直接发送收录的触发词（如 <code>乖乖站好</code>、<code>搞死你</code>、<code>faq</code>、<code>幻灭吧</code> 等），机器人将自动发出对应的哲学音频语音条！</p>
  <p><b>2. 主指令：</b><code>studyfa</code>（别名 <code>fa</code>、<code>学fa音</code>、<code>哲学</code>）</p>
  <div style="${codeBlockStyle}">
    <div>/fa —— 查看插件状态与关键词统计</div>
    <div>/fa .list —— 渲染并发送全量 105 个触发词图鉴大图</div>
    <div>/fa .list -t —— 以纯文本模式列出触发词列表（省流模式）</div>
  </div>
</div>
</details>

<!-- ================= 折叠卡片 2: 图鉴大图预览 ================= -->
<details class="k-usage-card card-orange" style="${baseDetailsStyle}">
<summary style="${baseSummaryStyle}">
  <span>🖼️ 触发词图鉴大图预览</span>
  <span class="k-fold-hint"><span class="k-fold-state"></span><span class="k-arrow-icon">▼</span></span>
</summary>
<div class="k-card-body" style="${baseBodyStyle}">
  <p>使用 <code>/fa .list</code> 时将发送由 Pillow 精心绘制的暗黑高对比图鉴：</p>
  <p align="center" style="margin: 10px 0;">
    <img src="https://gitee.com/vincent-zyu/studyfa-vincentzyu-fork/raw/main/docs/images/keywords_overview.png" alt="触发词图鉴预览" style="max-width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
  </p>
</div>
</details>

<!-- ================= 折叠卡片 3: 镜像源与图片设置 ================= -->
<details class="k-usage-card card-blue" style="${baseDetailsStyle}">
<summary style="${baseSummaryStyle}">
  <span>🌐 多源镜像与候选图地址设置</span>
  <span class="k-fold-hint"><span class="k-fold-state"></span><span class="k-arrow-icon">▼</span></span>
</summary>
<div class="k-card-body" style="${baseBodyStyle}">
  <p>本插件参考 <code>onebot-touxian</code> 与 <code>otto-hzys</code> 架构，采用多源容错策略：</p>
  <ul style="margin: 6px 0; padding-left: 18px; line-height: 1.8;">
    <li><b>图鉴候选源 (keywordsImageUrls)</b>：按 Gitee ➔ jsDelivr ➔ GitHub 顺序请求，保障不同服务器网络环境下的秒级出图。</li>
    <li><b>离线包候选源 (downloadMirrorUrlList)</b>：按 Gitee ➔ gh-proxy ➔ GitHub 官方顺序回退下载。</li>
  </ul>
</div>
</details>
<hr>
`
