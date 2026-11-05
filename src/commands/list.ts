import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { Context, h } from 'koishi'
import { AudioManager } from '../audio'
import { Config, DEFAULT_KEYWORDS_IMAGE_URL_LIST } from '../config'
import { FA_KEYWORD_MAP } from '../data/keywords'

export function registerListCommand(ctx: Context, config: Config, audioManager: AudioManager) {
  const mainCmd = ctx.command(config.commandName, '学Fa♂音 哲学语音互动')
  if (Array.isArray(config.commandAliases)) {
    for (const alias of config.commandAliases) {
      if (alias && alias.trim()) mainCmd.alias(alias.trim())
    }
  }

  // 注册主指令本身行为：若直接调用 /fa 不带参数，显示帮助引导
  mainCmd.action(async ({ session }) => {
    if (!session) return
    const audioCount = audioManager.getInstalledAudioCount()
    const keywordCount = Object.keys(FA_KEYWORD_MAP).length

    return [
      `📻 【学Fa♂音 哲学互动】已就绪`,
      `📦 词库收录：${keywordCount} 个关键词 · ${audioCount > 0 ? `本地已就绪 ${audioCount} 个音频` : '网络兜底模式'}`,
      `💡 使用方式：在聊天中直接发送关键词（如 "乖乖站好"、"搞死你"、"faq" 等）即可触发！`,
      `📋 查看全量图鉴：使用指令 /${config.commandName} ${config.listCommandName}（或 /fa .list）`,
    ].join('\n')
  })

  // 注册子指令：列出所有触发词
  const listCmd = mainCmd.subcommand(config.listCommandName, '查看全量学Fa♂音触发词图鉴')
    .option('text', '-t 强制以文本模式输出触发词列表')
    .option('image', '-i 强制以图鉴海报大图输出')

  if (Array.isArray(config.listCommandAliases)) {
    for (const alias of config.listCommandAliases) {
      if (alias && alias.trim()) listCmd.alias(alias.trim())
    }
  }

  listCmd.action(async ({ session, options }) => {
    if (!session) return

    const forceText = Boolean(options?.text)
    const forceImage = Boolean(options?.image)
    const useImage = forceImage || (!forceText && config.listDisplayMode === 'image')

    // 1. 图片展示模式
    if (useImage) {
      // 检查本地是否有预生成的图鉴大图
      const localImagePath = path.resolve(__dirname, '..', '..', 'docs', 'images', 'keywords_overview.png')
      if (fs.existsSync(localImagePath) && fs.statSync(localImagePath).size > 0) {
        return h.image(pathToFileURL(localImagePath).href)
      }

      // 否则从多源候选列表中提取第一有效链接（Gitee -> jsDelivr -> GitHub）
      const candidateList = Array.isArray(config.keywordsImageUrls) && config.keywordsImageUrls.length > 0
        ? config.keywordsImageUrls
        : DEFAULT_KEYWORDS_IMAGE_URL_LIST

      const validUrl = candidateList.find(u => typeof u === 'string' && u.trim().length > 0)
      if (validUrl) {
        return h.image(validUrl.trim())
      }
    }

    // 2. 文本展示模式（排版整齐的分栏）
    const keywords = Object.keys(FA_KEYWORD_MAP)
    keywords.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))

    const lines: string[] = [
      `📜 【学Fa♂音 全量触发词大全】（共 ${keywords.length} 个）`,
      '----------------------------------------',
    ]

    const chunkSize = 4
    for (let i = 0; i < keywords.length; i += chunkSize) {
      const chunk = keywords.slice(i, i + chunkSize)
      lines.push(chunk.map(w => `• ${w}`).join('   '))
    }

    lines.push('----------------------------------------')
    lines.push('💡 提示：在聊天中直接发送以上任意词汇即可触发对应音频！')

    return lines.join('\n')
  })
}
