import { Method, useComet } from '@neoaren/comet'
import { PNG } from 'pngjs/browser'


type TBody = { key: string; value: number[] }

useComet<HeartEnvironment, TBody>({
  server: 'main',
  method: Method.POST,
  pathname: '/api/backup'
}, async event => {
  const { key, value } = event.body
  console.log('a')
  try {
    console.log('b')
    const bytes = new Uint8Array(1024 * 1024 * 3)
    console.log(JSON.stringify([ ...bytes.slice(0, 10) ]))
    console.log('c')
    bytes.set(value)
    console.log('d')
    const data: ArrayBuffer = await parsePng(bytes)
    console.log('e')
    await event.env.BACKUP.put(key, data)
    console.log('f')
    await event.env.SNAPSHOTS.delete(key)
    console.log('g')
    return event.reply.ok()
  } catch (error: unknown) {
    console.log('h')
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
