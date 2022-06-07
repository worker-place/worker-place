import { Method, useComet } from '@neoaren/comet'
import jpeg, { RawImageData } from 'jpeg-js'


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
    const rawData: RawImageData<ArrayBuffer> = {
      data: data,
      height: 1024,
      width: 1024
    }

    const result = jpeg.encode(rawData, 50)
    resolve(result.data)
  })
}
