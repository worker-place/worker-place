import { comet, Method, useComet } from '@neoaren/comet'
import { PNG } from 'pngjs/browser'


useComet<unknown, { image: File }>({
  method: Method.POST,
  pathname: '/api'
}, async event => {
  const png = new PNG()
  const raw = await event.body.image.arrayBuffer()
  const data = await new Promise<Uint8Array>((resolve, reject) => {
    png.parse(raw, (error, data) => {
      if (error) return reject(error)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return resolve(data.data as Uint8Array)
    })
  })
  console.log('data', data)
  return event.reply.ok({ message: 'Hello, Comet!' })
})

export default {
  fetch: comet({ name: 'main' })
}

export { Place } from '../place/Place'
