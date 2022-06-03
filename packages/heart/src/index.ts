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
  async fetch(request: Request, env: HeartEnvironment, ctx: ExecutionContext): Promise<Response> {
    console.log(request.url)

    switch (new URL(request.url).pathname) {
      case '/api/connect':
        // eslint-disable-next-line no-case-declarations
        const id = env.PLACE.idFromName('worker-place')
        return env.PLACE.get(id).fetch(request)
    }

    return comet({ name: 'main' })(request, env, ctx)
  }
}

export { Place } from '../place/Place'
