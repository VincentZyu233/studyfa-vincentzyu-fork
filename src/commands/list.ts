import fs from 'node:fs'
import path from 'node:path'
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

  // 注册主指令本身行为：若直接调用 /fa 不带参数，显示帮助引导（纯文本模式，支持引用）
  mainCmd.action(async ({ session }) => {
    if (!session) return
    const audioCount = audioManager.getInstalledAudioCount()
    const keywordCount = Object.keys(FA_KEYWORD_MAP).length

    const text = [
      `📻 【学Fa♂音 哲学互动】已就绪`,
      `📦 词库收录：${keywordCount} 个关键词 · ${audioCount > 0 ? `本地已就绪 ${audioCount} 个音频` : '网络兜底模式'}`,
      `💡 使用方式：在聊天中直接发送关键词（如 "乖乖站好"、"搞死你"、"faq" 等）即可触发！`,
      `📋 查看全量图鉴：使用指令 /${config.commandName} ${config.listCommandName}（或 /fa .list）`,
    ].join('\n')

    const quotePrefix = config.enableQuote && session.messageId ? h.quote(session.messageId) : ''
    return `${quotePrefix}${text}`
  })

  // 注册子指令：列出所有触发词
  const listCmd = mainCmd.subcommand(config.listCommandName, '查看全量学Fa♂音触发词图鉴')
    .option('text', '-t 强制以纯文本模式输出触发词列表')
    .option('image', '-i 强制以图鉴海报大图输出')

  const aliasCandidates = new Set<string>()
  if (Array.isArray(config.listCommandAliases)) {
    for (const alias of config.listCommandAliases) {
      if (alias && alias.trim()) aliasCandidates.add(alias.trim())
    }
  }

  // 显式为子指令注入父前缀别名（如 fa.list, fa .list, falist, fa列表 等），彻底避免无空格别名无法匹配
  const parentNames = [config.commandName, ...(config.commandAliases || [])]
  for (const pName of parentNames) {
    if (!pName || !pName.trim()) continue
    const cleanP = pName.trim()
    const dotSub = config.listCommandName.startsWith('.') ? config.listCommandName : `.${config.listCommandName}`
    const rawSub = dotSub.replace(/^\.+/, '')

    aliasCandidates.add(`${cleanP}${dotSub}`)   // 如 fa.list, studyfa.list
    aliasCandidates.add(`${cleanP} ${dotSub}`)  // 如 fa .list
    aliasCandidates.add(`${cleanP}${rawSub}`)    // 如 falist
    aliasCandidates.add(`${cleanP} ${rawSub}`)   // 如 fa list
    aliasCandidates.add(`${cleanP}列表`)        // 如 fa列表
    aliasCandidates.add(`${cleanP}.列表`)       // 如 fa.列表
  }

  for (const alias of aliasCandidates) {
    listCmd.alias(alias)
  }

  listCmd.action(async ({ session, options }) => {
    if (!session) return

    const forceText = Boolean(options?.text)
    const forceImage = Boolean(options?.image)
    const useImage = forceImage || (!forceText && config.listDisplayMode === 'image')

    // 1. 图文展示模式（图片 + 文本说明；富媒体消息不附加引用）
    if (useImage) {
      let imageElement: any = null

      // 检查本地是否有预生成的图鉴大图，使用 Buffer 二进制发送（避免 file:/// 协议在 QQ/OneBot 平台被拒）
      const localImagePath = path.resolve(__dirname, '..', '..', 'docs', 'images', 'keywords_overview.png')
      if (fs.existsSync(localImagePath) && fs.statSync(localImagePath).size > 0) {
        try {
          const imageBuffer = fs.readFileSync(localImagePath)
          imageElement = h.image(imageBuffer, 'image/png')
        } catch (err) {
          ctx.logger('studyfa').warn(`读取本地触发词海报失败: ${err}`)
        }
      }

      // 否则从多源候选列表中提取第一有效链接（Gitee -> jsDelivr -> GitHub）
      if (!imageElement) {
        const candidateList = Array.isArray(config.keywordsImageUrls) && config.keywordsImageUrls.length > 0
          ? config.keywordsImageUrls
          : DEFAULT_KEYWORDS_IMAGE_URL_LIST

        const validUrl = candidateList.find(u => typeof u === 'string' && u.trim().length > 0)
        if (validUrl) {
          imageElement = h.image(validUrl.trim())
        }
      }

      if (imageElement) {
        const keywordCount = Object.keys(FA_KEYWORD_MAP).length
        const captionText = [
          `📜 【学Fa♂音 全量触发词图鉴】（共收录 ${keywordCount} 个关键词）`,
          `💡 提示：在聊天中直接发送图中任意词汇即可触发对应音频！`,
          `📝 如需纯文本分栏列表，可使用指令：/${config.commandName} ${config.listCommandName} -t`,
        ].join('\n')

        try {
          await session.send([imageElement, '\n' + captionText])
          return
        } catch (err) {
          ctx.logger('studyfa').warn(`发送图文消息失败，自动回退纯文本: ${err}`)
        }
      }
    }

    // 2. 纯文本展示模式（排版整齐的分栏；纯文本消息生效引用）
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

    const quotePrefix = config.enableQuote && session.messageId ? h.quote(session.messageId) : ''
    return `${quotePrefix}${lines.join('\n')}`
  })
}
