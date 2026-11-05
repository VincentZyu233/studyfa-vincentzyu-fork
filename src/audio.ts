import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import AdmZip from 'adm-zip'
import { Context, Logger } from 'koishi'
import { AudioSourceStrategy, DEFAULT_DOWNLOAD_MIRROR_URL_LIST } from './config'
import { FA_KEYWORD_MAP } from './data/keywords'

export class AudioManager {
  private logger: Logger
  private mirrors: string[]
  public dataDir: string
  public audioDir: string

  constructor(
    private ctx: Context,
    mirrors: string[],
    private useProxy: boolean = false,
    private proxyUrl: string = 'http://127.0.0.1:7890',
    dataPath?: string,
  ) {
    this.logger = ctx.logger('studyfa')
    this.dataDir = path.resolve(ctx.baseDir, dataPath || 'data/studyfa')
    this.audioDir = path.join(this.dataDir, 'audio')
    fs.mkdirSync(this.audioDir, { recursive: true })

    const normalized = Array.from(new Set(
      (Array.isArray(mirrors) ? mirrors : [])
        .map(mirror => String(mirror || '').trim().replace(/\/+$/, ''))
        .filter(Boolean),
    ))
    this.mirrors = normalized.length > 0 ? normalized : DEFAULT_DOWNLOAD_MIRROR_URL_LIST
  }

  /**
   * 检查本地是否已具备完整的音频切片
   */
  public hasAudioPack(): boolean {
    if (!fs.existsSync(this.audioDir)) return false
    const files = fs.readdirSync(this.audioDir).filter(f => f.endsWith('.mp3'))
    return files.length >= 150 // 全量 205 个，检查大于等于 150 即判定大致完整
  }

  /**
   * 统计本地已有的音频数量
   */
  public getInstalledAudioCount(): number {
    if (!fs.existsSync(this.audioDir)) return 0
    return fs.readdirSync(this.audioDir).filter(f => f.endsWith('.mp3')).length
  }

  /**
   * 确保音频资源包已下载并解压到本地
   */
  public async ensureAudioPack(onProgress?: (msg: string) => void): Promise<void> {
    if (this.hasAudioPack()) return

    const failures: string[] = []
    const tempZipPath = path.join(this.dataDir, '.tmp_studyfa.zip')

    for (let i = 0; i < this.mirrors.length; i++) {
      const mirror = this.mirrors[i]
      const zipUrl = `${mirror}/studyfa.zip`

      onProgress?.(`正在从镜像源（${i + 1}/${this.mirrors.length}）下载学Fa音离线语音包...`)
      this.logger.info(`Downloading audio pack from mirror (${i + 1}/${this.mirrors.length}): ${zipUrl}`)

      try {
        const httpOptions: Record<string, any> = {
          responseType: 'arraybuffer',
          timeout: 60000,
        }
        if (this.useProxy && this.proxyUrl?.trim()) {
          const proxy = this.proxyUrl.trim()
          httpOptions.proxy = proxy
          httpOptions.proxyAgent = proxy
        }

        const buffer = await this.ctx.http.get<ArrayBuffer>(zipUrl, httpOptions)
        fs.writeFileSync(tempZipPath, Buffer.from(buffer))

        onProgress?.('下载完成，正在解压音频资源...')
        const zip = new AdmZip(tempZipPath)
        zip.extractAllTo(this.dataDir, true)

        try { fs.unlinkSync(tempZipPath) } catch {}

        if (this.hasAudioPack()) {
          this.logger.info(`Studyfa audio pack installed successfully at ${this.audioDir} (${this.getInstalledAudioCount()} files)`)
          return
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        failures.push(`${mirror}: ${message}`)
        this.logger.warn(`Failed to download audio pack from ${mirror}: ${message}`)
        try { fs.unlinkSync(tempZipPath) } catch {}
      }
    }

    this.logger.warn(`离线资源下载未完成（${failures.join('；')}），后续将自动回退到在线源模式。`)
  }

  /**
   * 根据关键词获取随机一段音频的可播放地址（根据配置的四种策略解析）
   * @param keyword 触发词
   * @param strategy 获取策略（local_first | remote_first | local_only | remote_only）
   */
  public getAudioUrlForKeyword(
    keyword: string,
    strategy: AudioSourceStrategy = 'local_first',
  ): string | null {
    const filenames = FA_KEYWORD_MAP[keyword]
    if (!filenames || filenames.length === 0) return null

    const chosenFile = filenames[Math.floor(Math.random() * filenames.length)]
    const localFilePath = path.join(this.audioDir, chosenFile)
    const hasLocal = fs.existsSync(localFilePath) && fs.statSync(localFilePath).size > 0
    const localUrl = pathToFileURL(localFilePath).href
    const encodedName = encodeURIComponent(chosenFile)
    const remoteUrl = `http://smmcat.cn/run/fa/${encodedName}`

    switch (strategy) {
      case 'local_first': // 先 B 再 A（默认推荐）
        return hasLocal ? localUrl : remoteUrl

      case 'remote_first': // 先 A 再 B
        return remoteUrl || (hasLocal ? localUrl : null)

      case 'local_only': // 只有 B（纯离线）
        if (!hasLocal) {
          this.logger.warn(`[local_only 模式] 缺失本地离线音频文件: ${chosenFile}，请先执行 download_pack.py`)
          return null
        }
        return localUrl

      case 'remote_only': // 只有 A（纯远程上游）
        return remoteUrl

      default:
        return hasLocal ? localUrl : remoteUrl
    }
  }
}
