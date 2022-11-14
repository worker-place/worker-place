import { comet } from '@neoaren/comet'
import './routes/user'
import './routes/squad'


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
  }
}

// export { Place } from '../place/Place'
