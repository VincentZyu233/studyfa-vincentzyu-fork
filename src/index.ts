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

  // 3. 注册中间件被动监听聊天触发词
  ctx.middleware(async (session, next) => {
    if (!config.enableListener) return next()

    // 提取纯文本内容
    const text = h.select(session.elements, 'text')
      .map(item => item.attrs.content)
      .join('')

    if (!text || text.trim().length === 0) return next()

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
