import { Method, useComet } from '@neoaren/comet'
import { PNG, PNGData } from 'pngjs/browser'


type TBody = { key: string; value: ArrayBuffer }

useComet<HeartEnvironment, TBody>({
  server: 'main',
  method: Method.POST,
  pathname: '/api/backup'
}, async event => {
  const { key, value } = event.body
  try {
    const data: PNGData = await parsePng(value)
    await event.env.BACKUP.put(key, data.data)
    await event.env.SNAPSHOTS.delete(key)
    return event.reply.ok()
  } catch (error) {
    console.log('[backup] PNG conversion failed', error)
    return event.reply.internalServerError('PNG conversion failed')
  }
})

async function parsePng(data: ArrayBuffer): Promise<PNGData> {
  return new Promise((resolve, reject) => {
    new PNG().parse(data, (error: Error, data: PNGData) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}
