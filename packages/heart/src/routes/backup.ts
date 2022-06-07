import { Method, useComet } from '@neoaren/comet'
import { PNG } from 'pngjs/browser'


type TBody = { key: string; value: number[] }

useComet<HeartEnvironment, TBody>({
  server: 'main',
  method: Method.POST,
  pathname: '/api/backup'
}, async event => {
  const { key, value } = event.body
  try {
    const bytes = new Uint8Array(1024 * 1024 * 3)
    bytes.set(value)
    console.log(value)
    console.log(JSON.stringify([ ...bytes.slice(0, 10) ]))
    const data: ArrayBuffer = await parsePng(bytes)
    await event.env.BACKUP.put(key, data)
    await event.env.SNAPSHOTS.delete(key)
    return event.reply.ok()
  } catch (error: unknown) {
    // @ts-expect-error ...
    console.log('[backup] PNG conversion failed', error.message)
    // @ts-expect-error ...
    console.log(error.stack)
    return event.reply.internalServerError('PNG conversion failed')
  }
})

async function parsePng(data: ArrayBuffer): Promise<ArrayBuffer> {
  return new Promise(resolve => {
    /*new PNG().parse(data, (error: Error, data: PNGData) => {
      if (error) reject(error)
      else resolve(data)
    })*/
    const png = new PNG()
    png.write(data)
    resolve(png.pack().data)
  })
}
