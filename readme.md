> 💡 推荐前往 [GitHub](https://github.com/VincentZyu233/studyfa-vincentzyu-fork) 或 [Gitee](https://gitee.com/vincent-zyu/studyfa-vincentzyu-fork) 阅读 README，排版体验更佳。

# 📻 koishi-plugin-studyfa-vincentzyu-fork

[![npm](https://img.shields.io/npm/v/koishi-plugin-studyfa-vincentzyu-fork?style=flat-square&logo=npm)](https://www.npmjs.com/package/koishi-plugin-studyfa-vincentzyu-fork)
[![npm-download](https://img.shields.io/npm/dm/koishi-plugin-studyfa-vincentzyu-fork?style=flat-square&logo=npm)](https://npm-stat.com/charts.html?package=koishi-plugin-studyfa-vincentzyu-fork)

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VincentZyu233/studyfa-vincentzyu-fork)
[![Gitee](https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white)](https://gitee.com/vincent-zyu/studyfa-vincentzyu-fork)

[![Koishi Forum](https://img.shields.io/badge/Koishi%20Forum-xxxxx-5546A3?style=for-the-badge&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABU0lEQVR42p2UQSsFYRSGnxnqLuytKWKpKFkQNsS%2FsOHPWPADLCmxU5S7UzYWNrJR7lYiRF2FeWzOMKZ7mXHqNNP5vvP2nu%2B850CY2lP4X1K31ZbaDm%2BpO%2Bpyp5wfAXVEPfRvO1JHf4AVQGbUh7j4EZ4VkrNCXPVRnf3CUBN1SH2KC28VGOV3ntRhNclZHdcAKYM11QR1oVBOXctzFlNgBTC8qmXxPQEegbVeYApIgJT6tg%2F0AdMp0B%2FBpCabK2AAmAAa%2F2GRBft1oBFPkqTAba7LCiAfQC9wClwAY1HJHepuiO29Yrsf1Dn1uiDU3RTYCtTkl1Leg8k9MB4NGgReI28rV3azgyCz0og01Xl1Uz1QX8uCTELm3UbkTF1VJ9Wr0tn3iBSGdjYG0XivE3VN3VD31PM4a3cc2tIGGI0VkTO7rLxGuiy25ejmjfqsvkSXui62TxaK03td4FXTAAAAAElFTkSuQmCC&logoColor=white)](https://forum.koishi.xyz/t/topic/xxxxx)

[![QQ群](https://img.shields.io/badge/QQ群-1085190201-12B7F5?style=flat-square&logo=qq&logoColor=white)](https://qm.qq.com/q/ZHj33L5cuC)

<h2>💬 交流反馈</h2>
<p>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>1085190201</b> 🎉</p>
<p>💡 在群里直接艾特我，回复的更快哦~ ✨</p>

---

**📻 学Fa♂音 哲学语音互动与触发词图鉴插件（VincentZyu Fork） ✨**。基于原版 `koishi-plugin-smmcat-studyfa` 进行纯 TypeScript 重构，并彻底解决原插件依赖单一远程私人服务器失效的顽疾，现已支持全量 205 段音频离线本地化与高可用镜像分发！

> ❓ **为什么新开 Fork 独立发布？**
> 由于目前在 GitHub 与网络上完全搜不到上游原插件的开源代码仓库（上游作者创建了空仓库但未公开源码），想提交 PR 或反馈优化均无门可入；加之原版音频强依赖单一私人轻量服务器随时可能关机失效，为了保障广大群友与用户的长期可用性，并彻底实现**全量离线化、多源镜像容错与触发词可视化长图**，特此开设独立 GitHub 仓库重构维护并发布。

> 🙏 **上游致谢**：本项目基于社区原作者 [@smmcat](https://github.com/smmcat) 开发的 `koishi-plugin-smmcat-studyfa` 进行现代化架构重构与离线化升级，感谢原作者整理的经典音频！

## 📸 效果预览

### 1. 聊天被动触发实机效果

在聊天平台（以 OneBot 协议为例）直接发送词库内的哲学触发词（如“乖乖站好”、“搞死你”、“啊”等），机器人毫秒级快速响应并自动发出原生语音条：

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/VincentZyu233/studyfa-vincentzyu-fork@main/docs/preview/preview.%E5%93%B2%E5%AD%A6%E8%AF%AD%E9%9F%B3%E5%8C%85233.png" alt="哲学语音互动实机效果预览" width="720">
</p>

### 2. 触发词图鉴长图（`/fa .list`）

使用指令 `/fa .list` 时，将自动渲染并发送全量 105 个关键词的暗黑高对比度图鉴长图：

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/VincentZyu233/studyfa-vincentzyu-fork@main/docs/images/keywords_overview.png" alt="学Fa♂音全量触发词图鉴" width="750">
</p>

## ✨ 核心特色与升级

- 🚀 **纯 TypeScript 现代架构**：从源码重构原版 JavaScript，完整类型约束与 Koishi 4.18+ 深度适配。
- 📦 **真离线支持，告别服务器失效**：
  - 自动从 Gitee / GitHub Releases 下载完整 12MB 音频包并解压至本地 `data/studyfa/audio`；
  - 即使网络离线也能 100% 毫秒级播放，彻底不依赖第三方单点服务器。
- 📋 **独立图鉴与查词指令**：独家支持 `/fa .list`（支持高清长图渲染或 `-t` 纯文本分栏查看）。
- 🌐 **高可用镜像与 CDN 容错**：
  - 参考 `onebot-touxian` 与 `otto-hzys` 优秀实践，内置 Gitee ➔ jsDelivr ➔ GitHub 多重候选回退列表。
  - 支持配置 HTTP/SOCKS 代理（`downloadProxyUrl`），并自带零依赖 Python 离线预热脚本。

## 📖 指令与用法

### 1. 聊天被动触发

在群聊中直接发送词库内的任意关键词（如 `乖乖站好`、`搞死你`、`faq`、`比利` 等），机器人将自动发出对应的哲学原声！

### 2. 管理与查询指令

- `studyfa`（别名：`fa`、`学fa音`、`学FA音`、`哲学`）：查看插件状态与统计。
- `studyfa .list`（别名：`.words`、`.触发词`、`.列表`）：输出 105 个关键词的完整高清图鉴长图。
  - 选项：`-t` 强制以文本模式输出触发词列表；
  - 选项：`-i` 强制以图片模式输出。

### 📥 离线预热脚本（可选）

若服务器网络受限或希望在 Koishi 启动前预先下载资源包，可直接运行仓库内自带的 Python 3 脚本：

```bash
# 默认直连下载（首选 Gitee 公开镜像，免代理高速直连）
python3 scripts/download_pack.py

# 走本地代理下载（默认/常用代理为 http://127.0.0.1:7890）
python3 scripts/download_pack.py --proxy http://127.0.0.1:7890

# 强制重新下载并覆盖
python3 scripts/download_pack.py --proxy http://127.0.0.1:7890 --force
```

## ⚙️ 插件配置项

| 配置项 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `enableListener` | `boolean` | `true` | 是否开启群聊触发词被动监听 |
| `replyProbability` | `number` | `1.0` | 捕获到触发词时的回复概率（0.05 ~ 1.0） |
| `replyQuote` | `boolean` | `false` | 发送语音条时是否引用触发消息 |
| `audioSourceStrategy` | `'local_first' \| 'remote_first' \| 'local_only' \| 'remote_only'` | `'local_first'` | 音频获取策略（先B再A/先A再B/只有B/只有A） |
| `enableQuote` | `boolean` | `true` | bot 发送指令回复时是否引用触发指令的消息 |
| `commandName` | `string` | `studyfa` | 主指令名称 |
| `commandAliases` | `string[]` | `fa`、`学fa音`、`哲学` 等 | 主指令别名列表 |
| `listCommandName` | `string` | `.list` | 触发词列表子指令名 |
| `listDisplayMode` | `'image' \| 'text'` | `image` | 触发词列表输出模式（图片 / 纯文本） |
| `dataPath` | `string[]` | `['data', 'studyfa']` | 本地数据存储路径切片（基于 `ctx.baseDir`，只读锁定） |
| `autoDownload` | `boolean` | `true` | 启动时是否自动静默下载离线音频资源包 |
| `useDownloadProxy` | `boolean` | `false` | 下载音频包时是否使用代理 |
| `downloadProxyUrl` | `string` | `http://127.0.0.1:7890` | 下载使用的代理服务器地址 |
| `downloadMirrorUrlList` | `string[]` | Gitee / gh-proxy / GitHub 地址 | 音频包下载候选镜像列表，按顺序尝试 |
| `keywordsImageUrls` | `string[]` | Gitee / jsDelivr / GitHub 地址 | 触发词图鉴图片的候选多源 URL 列表 |
