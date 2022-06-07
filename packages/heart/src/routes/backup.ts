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
    console.log('c')
    bytes.set(value)
    console.log(JSON.stringify([ ...bytes.slice(0, 10) ]))
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
    const uintBuffer = new Uint8Array(data)
    const lastbuffer = new Uint8ClampedArray(4 * 1024 * 1024)
    lastbuffer.fill(255)
    for (let i = 0; i < 1024 * 1024; i++) {
      if (uintBuffer[3 * i] === 4 && uintBuffer[3 * i + 1] === 4 && uintBuffer[3 * i + 2] === 4) {
        lastbuffer[4 * i + 3] = 0
      } else {
        lastbuffer[4 * i] = uintBuffer[3 * i]
        lastbuffer[4 * i + 1] = uintBuffer[3 * i + 1]
        lastbuffer[4 * i + 2] = uintBuffer[3 * i + 2]
      }
    }

    const png = new PNG()
    png.data = lastbuffer.buffer
    resolve(png.pack().data)
  })
}
