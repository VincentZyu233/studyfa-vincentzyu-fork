const pkg = require('../package.json')

const KOISHI_LOGO_BASE64 = 'data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABU0lEQVR42p2UQSsFYRSGnxnqLuytKWKpKFkQNsS%2FsOHPWPADLCmxU5S7UzYWNrJR7lYiRF2FeWzOMKZ7mXHqNNP5vvP2nu%2B850CY2lP4X1K31ZbaDm%2BpO%2Bpyp5wfAXVEPfRvO1JHf4AVQGbUh7j4EZ4VkrNCXPVRnf3CUBN1SH2KC28VGOV3ntRhNclZHdcAKYM11QR1oVBOXctzFlNgBTC8qmXxPQEegbVeYApIgJT6tg%2F0AdMp0B%2FBpCabK2AAmAAa%2F2GRBft1oBFPkqTAba7LCiAfQC9wClwAY1HJHepuiO29Yrsf1Dn1uiDU3RTYCtTkl1Leg8k9MB4NGgReI28rV3azgyCz0og01Xl1Uz1QX8uCTELm3UbkTF1VJ9Wr0tn3iBSGdjYG0XivE3VN3VD31PM4a3cc2tIGGI0VkTO7rLxGuiy25ejmjfqsvkSXui62TxaK03td4FXTAAAAAElFTkSuQmCC'

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
  <a href="https://npm-stat.com/charts.html?package=koishi-plugin-studyfa-vincentzyu-fork" target="_blank">
    <img src="https://img.shields.io/npm/dm/koishi-plugin-studyfa-vincentzyu-fork?style=flat-square&logo=npm" alt="npm downloads">
  </a>
  <br>
  <a href="https://github.com/VincentZyu233/studyfa-vincentzyu-fork" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://gitee.com/vincent-zyu/studyfa-vincentzyu-fork" target="_blank">
    <img src="https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white" alt="Gitee">
  </a>
  <br>
  <a href="https://forum.koishi.xyz/t/topic/13796" target="_blank">
    <img src="https://img.shields.io/badge/Koishi%20Forum-13796-5546A3?style=for-the-badge&logo=${KOISHI_LOGO_BASE64}&logoColor=white" alt="Koishi Forum">
  </a>
  <a href="https://qm.qq.com/q/ZHj33L5cuC" target="_blank">
    <img src="https://img.shields.io/badge/QQ群-1085190201-12B7F5?style=flat-square&logo=qq&logoColor=white" alt="QQ群">
  </a>
  <br>
</p>

<p><b>💬 交流反馈：</b>欢迎加入 QQ 群 <b>1085190201</b>，在群里直接艾特我，回复更快哦~ ✨</p>

<!-- 醒目的离线下载排障提示 -->
<div class="k-notice-box">
  <div class="k-notice-title">⚡ 离线资源与国内加速下载说明</div>
  <p style="margin: 4px 0 6px;">
    本插件针对原版（依赖单一私人服务器易失效）进行了重大升级：**已将全量 205 段音频打包为离线资源包**，并支持多源备份镜像（Gitee ➔ gh-proxy ➔ GitHub）。
  </p>
  <ul style="margin: 4px 0 0 18px; padding: 0;">
    <li><b>音频策略选择 (audioSourceStrategy)</b>：支持 4 种模式自由切换（先本地再回退远程 / 先远程再回退本地 / 纯离线零外网 / 纯远程不占磁盘）。</li>
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
    <div>/fa —— 查看插件状态与关键词统计（纯文本，遵循 enableQuote 引用设置）</div>
    <div>/fa .list —— 发送全量 105 个触发词图鉴大图 + 说明文本</div>
    <div>/fa .list -t —— 以纯文本分栏模式列出触发词列表（省流模式，遵循 enableQuote 引用设置）</div>
  </div>
</div>
</details>

<!-- ================= 折叠卡片 2: 全量触发词图鉴一览表 ================= -->
<details class="k-usage-card card-orange" style="${baseDetailsStyle}">
<summary style="${baseSummaryStyle}">
  <span>📜 全量 105 个触发词图鉴一览表</span>
  <span class="k-fold-hint"><span class="k-fold-state"></span><span class="k-arrow-icon">▼</span></span>
</summary>
<div class="k-card-body" style="${baseBodyStyle}">
  <p style="margin: 0 0 10px;">
    💡 <b>在聊天中直接发送以下任意词汇即可触发哲学语音</b>；使用指令 <code>/fa .list</code> 也可在群内直接发送暗黑高清图鉴海报大图。
  </p>

  <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
    <a href="https://github.com/VincentZyu233/studyfa-vincentzyu-fork/blob/main/docs/images/keywords_overview.png?raw=true" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #24292e; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
      <span>🐙 前往 GitHub 查看高清海报原图 ↗</span>
    </a>
    <a href="https://gitee.com/vincent-zyu/studyfa-vincentzyu-fork/raw/main/docs/images/keywords_overview.png" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #c71d23; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
      <span>🔴 前往 Gitee 查看图片 ↗</span>
    </a>
  </div>

  <div style="overflow-x: auto; border: 1px solid var(--card-border, rgba(127,127,127,0.25)); border-radius: 8px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
      <thead>
        <tr style="background: var(--card-summary-bg, rgba(127,127,127,0.12)); border-bottom: 2px solid var(--card-border, rgba(127,127,127,0.25));">
          <th style="padding: 8px 10px; width: 20%;">序号 · 触发词</th>
          <th style="padding: 8px 10px; width: 20%;">序号 · 触发词</th>
          <th style="padding: 8px 10px; width: 20%;">序号 · 触发词</th>
          <th style="padding: 8px 10px; width: 20%;">序号 · 触发词</th>
          <th style="padding: 8px 10px; width: 20%;">序号 · 触发词</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">001</span><code>啊</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">002</span><code>啊啊</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">003</span><code>啊啊啊</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">004</span><code>啊啊啊啊</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">005</span><code>啊焯</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">006</span><code>啊乖乖站好</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">007</span><code>啊哈</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">008</span><code>啊幻想乡啊王</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">009</span><code>啊筋疲力尽</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">010</span><code>啊魔男</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">011</span><code>啊无双大黄瓜</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">012</span><code>啊泄</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">013</span><code>啊谢</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">014</span><code>嗷</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">015</span><code>嗷哒哒</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">016</span><code>嗷来米搞</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">017</span><code>奥义很爽</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">018</span><code>标准开头</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">019</span><code>波秋里</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">020</span><code>勃起至今</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">021</span><code>惩罚中</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">022</span><code>喘息声</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">023</span><code>次</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">024</span><code>大</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">025</span><code>大叫</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">026</span><code>大笑</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">027</span><code>当真</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">028</span><code>裆震</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">029</span><code>裆震磨好斯</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">030</span><code>德国鸡腿堡</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">031</span><code>的销魂叫声</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">032</span><code>动</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">033</span><code>洞子大</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">034</span><code>都在干</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">035</span><code>额</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">036</span><code>恶魔的低语</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">037</span><code>翻一个</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">038</span><code>放铁链</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">039</span><code>搞</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">040</span><code>搞死</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">041</span><code>搞死你</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">042</span><code>格斗声</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">043</span><code>给党</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">044</span><code>乖乖站好</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">045</span><code>柜子</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">046</span><code>哈啊啊啊啊啊</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">047</span><code>哈啊啊啊呃</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">048</span><code>还搞不搞了</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">049</span><code>黑暗深邃幻想</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">050</span><code>幻想乡</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">051</span><code>尻</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">052</span><code>快哉</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">053</span><code>拉大便</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">054</span><code>来</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">055</span><code>来一起拉大便</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">056</span><code>立正站好</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">057</span><code>麦当劳</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">058</span><code>米糠</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">059</span><code>魔男</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">060</span><code>嗯</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">061</span><code>嗯哼嗯嗯</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">062</span><code>喔</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">063</span><code>噢卖萧的</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">064</span><code>噢夜色</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">065</span><code>哦</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">066</span><code>哦哄哄全给党</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">067</span><code>哦卖萧的</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">068</span><code>拍手</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">069</span><code>巧舌如簧</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">070</span><code>去年勃起至今</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">071</span><code>全给党</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">072</span><code>人体唢呐</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">073</span><code>胜利的叫声</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">074</span><code>酸萝卜别吃</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">075</span><code>孙红雷</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">076</span><code>螳螂乱摸</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">077</span><code>螳螂让摸</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">078</span><code>哇</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">079</span><code>哇哈</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">080</span><code>玩游戏</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">081</span><code>王的演讲</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">082</span><code>王老板</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">083</span><code>我要搞死你</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">084</span><code>五舅啊</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">085</span><code>务必让螳螂乱摸</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">086</span><code>泄</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">087</span><code>谢</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">088</span><code>新日暮里</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">089</span><code>漾笑声</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">090</span><code>野兽先辈</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">091</span><code>夜色</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">092</span><code>一起拉大便</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">093</span><code>易建联</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">094</span><code>游戏手柄</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">095</span><code>有点骚</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">096</span><code>有没有很好</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">097</span><code>站好</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">098</span><code>长叫</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">099</span><code>哲学</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">100</span><code>哲学套</code></td>
        </tr>
        <tr style="border-bottom: 1px solid var(--card-border, rgba(127,127,127,0.15));">
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">101</span><code>这个世界太乱</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">102</span><code>自我介绍</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">103</span><code>自由深邃黑暗</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">104</span><code>asswecan</code></td>
          <td style="padding: 6px 10px;"><span style="opacity: 0.6; font-size: 11px; margin-right: 6px; font-family: monospace;">105</span><code>faq</code></td>
        </tr>
      </tbody>
    </table>
  </div>
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
