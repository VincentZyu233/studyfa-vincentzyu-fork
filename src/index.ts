import { Context, h } from 'koishi'
import { AudioManager } from './audio-manager'
import { registerListCommand } from './commands/list'
import { Config } from './config'
import { FA_KEYWORD_MAP } from './data/keywords'
import { usage } from './usage'

export * from './config'
export * from './audio-manager'
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

        const audioUrl = audioManager.getAudioUrlForKeyword(keyword)
        if (audioUrl) {
          logger.debug(`Triggered keyword: [${keyword}], sending audio: ${audioUrl}`)
          const elements: any[] = []
          if (config.replyQuote && session.messageId) {
            elements.push(h.quote(session.messageId))
          }
          elements.push(h.audio(audioUrl))
          await session.send(elements)
        }
      }
    }

    return next()
  })
}
