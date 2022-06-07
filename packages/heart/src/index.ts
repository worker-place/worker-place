import { comet } from '@neoaren/comet'
import { PNG } from 'pngjs/browser'
import './routes/user'
import './routes/squad'


async function doBackup(env: HeartEnvironment): Promise<unknown> {
  // eslint-disable-next-line unicorn/no-await-expression-member
  const keys = (await env.SNAPSHOTS.list()).keys.map(key => key.name)
  const values = await Promise.all(keys.map(each => env.SNAPSHOTS.get(each, { type: 'arrayBuffer' })))
  await Promise.all(values.filter(Boolean)
    // @ts-expect-error ...
    .map(each => new PNG().end(each).pack().data)
    .map(each => env.BACKUP.put(new Date().toISOString(), each)))

  return await Promise.all(keys.map(each => env.SNAPSHOTS.delete(each)))
}

export default {
  async fetch(request: Request, env: HeartEnvironment, ctx: ExecutionContext): Promise<Response> {
    console.log(request.url)
    switch (new URL(request.url).pathname) {
      case '/api/connect': {
        const id = env.PLACE.idFromName('worker-place')
        return env.PLACE.get(id).fetch(request)
      }
      case '/api/image': {
        const id = new URL(request.url).searchParams.get('id')
        if (!id) return new Response('', { status: 400 })
        const image = await env.SQUAD_IMAGES.get(id)
        if (!image) return new Response('', { status: 404 })
        return new Response(image.body, { status: 200 })
      }
      default: {
        return comet({ name: 'main', cors: { origins: '*', headers: '*', methods: '*' } })(request, env, ctx)
      }
    }
  },

  async scheduled(event: ScheduledEvent, env: HeartEnvironment, ctx: ExecutionContext) {
    console.log(`[cron - ${event.cron}] Creating backup...`)
    ctx.waitUntil(doBackup(env))
  }
}

export { Place } from '../place/Place'
