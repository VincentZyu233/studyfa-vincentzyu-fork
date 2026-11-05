import { Context, h } from 'koishi'
import { AudioManager } from './audio'
import { registerListCommand } from './commands/list'
import { Config } from './config'
import { FA_KEYWORD_MAP } from './data/keywords'
import { usage } from './usage'

export * from './config'
export * from './audio'
export * from './data/keywords'
export { usage }

export const name = 'studyfa-vincentzyu-fork'

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('studyfa')
  const audioManager = new AudioManager(
    ctx,
    config.downloadMirrorUrlList,
    config.useDownloadProxy,
    config.downloadProxyUrl,
    config.dataPath,
  )

  // 1. 启动时后台静默预热下载音频切片包
  ctx.on('ready', async () => {
    if (config.autoDownload) {
      try {
        await audioManager.ensureAudioPack()
      } catch (err) {
        logger.warn(`Failed to auto-download studyfa audio pack: ${err}`)
      }
    }
  })

  // 2. 注册指令与子指令
  registerListCommand(ctx, config, audioManager)

  // 3. 注册中间件监听聊天触发词
  ctx.middleware(async (session, next) => {
    // 档位判定，兼容旧版配置 enableListener，默认使用 command_only
    const mode = config.triggerMode ?? (config.enableListener === false ? 'disabled' : (config.enableListener === true ? 'always' : 'command_only'))
    if (mode === 'disabled') return next()

    // 提取纯文本内容
    let text = h.select(session.elements, 'text')
      .map(item => item.attrs.content)
      .join('')
      .trim()

    if (!text || text.length === 0) return next()

    // 档位 2：必须以指令名开头
    if (mode === 'command_only') {
      const allPrefixes = [config.commandName, ...(config.commandAliases || [])]
        .filter(p => typeof p === 'string' && p.trim().length > 0)
        .map(p => p.trim())

      // 允许可选前置标点符号 [/!#.。／#]，并匹配指令名，后面跟随空白字符或直接连接汉字/拼音字母
      const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const prefixPattern = new RegExp(`^(?:[/!#.。／#]?)\\s*(${allPrefixes.map(escapeRegex).join('|')})(?:\\s+|(?=[\\u4e00-\\u9fa5a-zA-Z]))`, 'i')
      const match = text.match(prefixPattern)

      if (!match) {
        // 没有以指令名开头，放行
        return next()
      }

      // 剥离指令前缀部分
      text = text.slice(match[0].length).trim()

      // 如果剥离后没有内容（说明用户只发了例如 "/fa"），放行给指令 action 展示帮助
      if (!text) return next()

      // 如果剥离后的内容以 '.' 开头或是 'list'、'列表' 等子指令，放行给子指令逻辑
      const subNames = [config.listCommandName, ...(config.listCommandAliases || []), 'list', '列表']
        .filter(Boolean)
        .map(s => s.trim().toLowerCase())

      const lowerText = text.toLowerCase()
      if (text.startsWith('.') || subNames.includes(lowerText)) {
        return next()
      }
    }

    // 匹配中文与英文字母（与原版逻辑保持一致）
    const matchedChars = text.match(/[\u4e00-\u9fa5a-zA-Z]/g)
    if (matchedChars) {
      const keyword = matchedChars.join('')
      if (FA_KEYWORD_MAP[keyword]) {
        // 概率判断
        if (config.replyProbability < 1.0 && Math.random() > config.replyProbability) {
          return next()
        }

        const audioUrl = audioManager.getAudioUrlForKeyword(keyword, config.audioSourceStrategy)
        if (audioUrl) {
          logger.debug(`Triggered keyword: [${keyword}], sending audio...`)
          try {
            if (config.replyQuote && session.messageId) {
              await session.send([h.quote(session.messageId), h.audio(audioUrl)])
            } else {
              // 严格对齐上游原版：单发 h.audio
              await session.send(h.audio(audioUrl))
            }
          } catch (err) {
            logger.warn(`发送哲学语音失败: ${err}`)
            // 自动使用互补策略（本地失败回退在线，或在线失败回退本地）兜底重试
            try {
              const fallbackStrategy = config.audioSourceStrategy === 'local_first' ? 'remote_only' : 'local_only'
              const fallbackUrl = audioManager.getAudioUrlForKeyword(keyword, fallbackStrategy)
              if (fallbackUrl && fallbackUrl !== audioUrl) {
                logger.info(`尝试使用备选策略 [${fallbackStrategy}] 重新发送语音...`)
                if (config.replyQuote && session.messageId) {
                  await session.send([h.quote(session.messageId), h.audio(fallbackUrl)])
                } else {
                  await session.send(h.audio(fallbackUrl))
                }
              }
            } catch (fallbackErr) {
              logger.warn(`备选策略重发依然失败: ${fallbackErr}`)
            }
          }
        }
      }
    }

    return next()
  })
}
