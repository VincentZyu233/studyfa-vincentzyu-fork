import { Schema } from 'koishi'

export const DEFAULT_DOWNLOAD_MIRROR_URL_LIST = [
  'https://gitee.com/vincent-zyu/studyfa-vincentzyu-fork/releases/download/v0.1.0',
  'https://gh-proxy.com/https://github.com/VincentZyu233/studyfa-vincentzyu-fork/releases/download/v0.1.0',
  'https://ghproxy.net/https://github.com/VincentZyu233/studyfa-vincentzyu-fork/releases/download/v0.1.0',
  'https://github.com/VincentZyu233/studyfa-vincentzyu-fork/releases/download/v0.1.0',
]

export const DEFAULT_KEYWORDS_IMAGE_URL_LIST = [
  'https://gitee.com/vincent-zyu/studyfa-vincentzyu-fork/raw/main/docs/images/keywords_overview.png',
  'https://gh-proxy.com/https://raw.githubusercontent.com/VincentZyu233/studyfa-vincentzyu-fork/main/docs/images/keywords_overview.png',
  'https://cdn.jsdelivr.net/gh/VincentZyu233/studyfa-vincentzyu-fork@main/docs/images/keywords_overview.png',
  'https://raw.githubusercontent.com/VincentZyu233/studyfa-vincentzyu-fork/main/docs/images/keywords_overview.png',
]

export type AudioSourceStrategy = 'local_first' | 'remote_first' | 'local_only' | 'remote_only'

export interface Config {
  // ===== 🎙️ 语音监听与响应设置 =====
  enableListener: boolean // 👂 是否开启群聊触发词被动监听
  replyProbability: number // 🎲 匹配成功时的响应概率（0.1 ~ 1.0）
  replyQuote: boolean // 💬 发送哲学语音时是否引用触发消息
  audioSourceStrategy: AudioSourceStrategy // 🎙️ 音频资源获取与回退策略（单选框）

  // ===== 📌 指令与别名设置 =====
  enableQuote: boolean // 💬 bot 发送文本消息时是否引用触发指令的消息（仅对纯文本消息生效）
  commandName: string // 📌 主指令名称（默认 studyfa）
  commandAliases: string[] // 🏷️ 主指令别名列表
  listCommandName: string // 📋 触发词列表子指令名（默认 .list）
  listCommandAliases: string[] // 📋 触发词列表子指令别名列表
  listDisplayMode: 'image' | 'text' // 🖼️ 触发词列表展示方式（图片 / 文本）

  // ===== 📦 资源与离线下载设置 =====
  dataPath?: string // 📁 本地数据存储目录（只读）
  autoDownload: boolean // 🚀 插件启动时若缺少音频资源包是否自动静默下载
  useDownloadProxy: boolean // 🌐 下载语音包时是否使用 HTTP/SOCKS 代理
  downloadProxyUrl: string // 🔌 下载语音包时使用的代理服务器地址（默认 http://127.0.0.1:7890）
  downloadMirrorUrlList: string[] // 🌐 资源下载镜像基础地址列表

  // ===== 🖼️ 触发词大图候选地址设置 =====
  keywordsImageUrls: string[] // 🖼️ 触发词图鉴静态图片候选列表（Gitee -> jsDelivr -> GitHub）
}

export const Config: Schema<Config> = Schema.intersect([
  // ===== 🎙️ 语音监听与响应设置 =====
  Schema.object({
    enableListener: Schema.boolean()
      .default(true)
      .description('👂 是否开启群聊与频道消息中的哲学触发词被动监听（匹配后随机发送对应语音）'),
    replyProbability: Schema.number()
      .min(0.05)
      .max(1.0)
      .step(0.05)
      .default(1.0)
      .description('🎲 捕获到触发词时的回复概率（默认 1.0 即 100% 触发；可适当调小避免刷屏）'),
    replyQuote: Schema.boolean()
      .default(false)
      .description('💬 发送语音条时是否引用触发者的消息（OneBot 语音条建议关闭引用以获得最佳体验）'),
    audioSourceStrategy: Schema.union([
      Schema.const('local_first').description('💾 先 B 再 A（默认推荐）：本地优先，本地缺失时自动回退远程上游 URL'),
      Schema.const('remote_first').description('🌐 先 A 再 B：远程优先，远程受阻/失败时回退本地切片'),
      Schema.const('local_only').description('🔒 只有 B（纯离线）：仅使用本地解压的音频，零外部音频网络请求'),
      Schema.const('remote_only').description('☁️ 只有 A（纯远程）：仅使用原版 smmcat.cn 远程音频，完全不占本地磁盘'),
    ])
      .role('radio')
      .default('local_first')
      .description('🎙️ 音频资源获取与回退策略（A: 原版远程 smmcat.cn；B: GitHub/Gitee Release 离线切片）'),
  }).description('🎙️ 语音监听与响应设置 💬'),

  // ===== 📌 指令与别名设置 =====
  Schema.object({
    enableQuote: Schema.boolean()
      .default(true)
      .description('💬 bot 发送文本消息时是否引用触发指令的消息（仅对纯文本消息生效，含图富媒体消息不引用）'),
    commandName: Schema.string()
      .default('studyfa')
      .description('📌 主指令名称（如 studyfa、fa）'),
    commandAliases: Schema.array(Schema.string())
      .role('table')
      .default(['fa', '学fa音', '学FA音', '哲学', '哲学会话'])
      .description('🏷️ 主指令别名列表（在聊天中可通过任意别名触发）'),
    listCommandName: Schema.string()
      .default('.list')
      .description('📋 触发词列表子指令名称（默认 .list，在主指令后跟随触发，如 /fa .list）'),
    listCommandAliases: Schema.array(Schema.string())
      .role('table')
      .default(['.words', '.wordlist', '.触发词', '.词库', '.列表'])
      .description('📋 触发词列表子指令别名列表'),
    listDisplayMode: Schema.union([
      Schema.const('image').description('🖼️ 渲染图鉴大图（视觉体验极佳，推荐）'),
      Schema.const('text').description('📝 纯文本排版（轻量省流）'),
    ])
      .role('radio')
      .default('image')
      .description('🎨 触发词列表指令的默认输出模式'),
  }).description('📌 指令与展示设置 ⚙️'),

  // ===== 📦 资源与离线下载设置 =====
  Schema.object({
    dataPath: Schema.string()
      .disabled()
      .default('data/studyfa')
      .description('📁 本地数据存储目录（基于 Koishi 根目录 ctx.baseDir 解析。当前暂时只读不可修改；若有自定义路径需求欢迎提 Issue/PR 或加群反馈）'),
    autoDownload: Schema.boolean()
      .default(true)
      .description('🚀 插件启动时，若本地缺失离线音频资源是否在后台自动静默下载'),
    useDownloadProxy: Schema.boolean()
      .default(false)
      .description('🌐 下载音频包时是否使用 HTTP/SOCKS 代理'),
    downloadProxyUrl: Schema.string()
      .default('http://127.0.0.1:7890')
      .description('🔌 下载音频包时使用的代理服务器地址（例如 http://127.0.0.1:7890）'),
    downloadMirrorUrlList: Schema.array(Schema.string())
      .role('table')
      .min(1)
      .default(DEFAULT_DOWNLOAD_MIRROR_URL_LIST)
      .description('🌐 音频资源包下载镜像基础地址列表，按顺序依次尝试，任一成功即停止（末尾无需加斜杠）'),
    keywordsImageUrls: Schema.array(Schema.string())
      .role('table')
      .default(DEFAULT_KEYWORDS_IMAGE_URL_LIST)
      .description('🖼️ 触发词图鉴图片的候选 URL 列表（支持配置多个备用源，顺序建议 Gitee ➔ jsDelivr ➔ GitHub）'),
  }).description('📦 资源镜像与离线下载设置 📥'),
])
